from functools import wraps
from datetime import datetime, timedelta
from flask import Blueprint, request, jsonify, make_response, g, render_template
from models import User, Demerit, APIKey


UNPROTECTED_METHODS = ('/api/login', '/api/user/list/top')

blueprint = Blueprint('api', __name__)

def render_json(*args, **kwargs):
    return make_response(jsonify(*args, **kwargs))

def check_api_key():
    if request.path in UNPROTECTED_METHODS:
        return

    api_key_str = request.values.get('api_key')

    request.api_key = APIKey.objects(key=api_key_str).first()

    if not request.api_key:
        return render_json(success=False, message="Invalid API Key")


blueprint.before_request(check_api_key)


@blueprint.route('/hello/<s>')
def hello(s):
    return render_json(success=True, message="hello: %s" % s) 

@blueprint.route('/login', methods=['POST'])
def login():
    api_key_str = request.form.get('api_key')
    api_key = APIKey.objects(key=api_key_str).first()

    if not api_key:
        return render_json(success=False, message="Invalid API Key")
    else:
        duration = timedelta(days=365)
        expires = datetime.now() + duration
        response = make_response(jsonify(success=True))
        response.set_cookie('api_key', api_key.key, expires=expires)
        return response

@blueprint.route('/user/list/top')
def user_list_top():
    users = [u.as_dict() for u in User.objects.order_by('-demerits')]
    return render_template('top_scores.html', users=users)

@blueprint.route('/user/list')
def user_list():
    users = [u.as_dict() for u in User.objects.order_by('last_name')]
    return render_json(success=True, users=users)


@blueprint.route('/user/<user_slug>')
def user_get(user_slug):
    user = User.objects(slug=user_slug).first()
    if user:
        return render_json(success=True, user=user.as_dict())
    else:
        return render_json(success=False, message="User not found")

@blueprint.route('/demerit/create', methods=['POST'])
def demerit_create():
    to_user_slug = request.form.get('to_user')

    from_user = request.api_key.user
    if not from_user:
        return render_json(success=False, message="From-user not found")

    if not from_user.can_give_demerits:
        return render_json(success=False, message="You are not allowed to give demerits")

    to_user = User.objects(slug=to_user_slug).first()
    if not to_user:
        return render_json(success=False, message="To-user not found: %s" % to_user_slug)

    demerit = Demerit()
    demerit.from_user = from_user
    demerit.to_user = to_user
    demerit.save()

    to_user.reload()

    return render_json(success=True, user=to_user.as_dict())

@blueprint.route('/demerit/list')
def demerit_list():
    demerits = [d.as_dict() for d in Demerit.objects]
    return render_json(success=True, demerits=demerits)
