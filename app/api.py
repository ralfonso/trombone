from functools import wraps
from datetime import datetime, timedelta
from flask import Blueprint, request, jsonify, make_response, g, render_template, current_app
from models import User, Demerit, Excuse


UNPROTECTED_METHODS = ('/api/login', '/api/user/list/top')

blueprint = Blueprint('api', __name__)

def render_json(*args, **kwargs):
    return make_response(jsonify(*args, **kwargs))

def check_api_key():
    if request.path in UNPROTECTED_METHODS:
        return

    api_key_str = request.values.get('api_key')

    request.user = User.query.filter(User.api_key==api_key_str).first()

    if not request.user:
        return render_json(success=False, message="Invalid API Key")


blueprint.before_request(check_api_key)


@blueprint.route('/hello/<s>')
def hello(s):
    return render_json(success=True, message="hello: %s" % s) 

@blueprint.route('/login', methods=['POST'])
def login():
    api_key_str = request.form.get('api_key').strip()
    user = User.query.filter(User.api_key==api_key_str).first()

    if not user:
        return render_json(success=False, message="Invalid API Key")
    else:
        duration = timedelta(days=365)
        expires = datetime.now() + duration
        response = make_response(jsonify(success=True))
        response.set_cookie('api_key', api_key_str, expires=expires)
        return response

@blueprint.route('/user/list/top')
def user_list_top():
    link_users = request.values.get('link_users', True)
    as_html = request.values.get('as_html', False)
    users = [u.to_dict() for u in User.query.order_by(User.demerits.desc())]

    if as_html:
        return render_template('top_scores.html', users=users, link_users=link_users)
    else:
        return render_json(users=users)

@blueprint.route('/user/list')
def user_list():
    users = [u.to_dict() for u in User.query.order_by(User.demerits.desc())]
    return render_json(success=True, users=users)


@blueprint.route('/user/<user_slug>')
def user_get(user_slug):
    user = User.query.filter(User.slug==user_slug).first()
    if user:
        return render_json(success=True, user=user.to_dict())
    else:
        return render_json(success=False, message="User not found")

@blueprint.route('/demerit/create', methods=['POST'])
def demerit_create():
    to_user_slug = request.form.get('to_user')
    reason = request.form.get('reason', None)

    api_key = request.cookies.get('api_key', 'XXX')

    from_user = User.query.filter(User.api_key==api_key).first()

    if not from_user:
        return render_json(success=False, message="From-user not found")

    if not from_user.can_give_demerits:
        return render_json(success=False, message="You are not allowed to give demerits")

    to_user = User.query.filter(User.slug==to_user_slug).first()
    if not to_user:
        return render_json(success=False, message="To-user not found: %s" % to_user_slug)

    demerit = Demerit()
    demerit.from_user_id = from_user.id
    demerit.to_user_id = to_user.id
    if reason:
        demerit.reason = reason.strip()
    to_user.demerits += 1
    current_app.db.session.add(demerit)
    current_app.db.session.commit()

    return render_json(success=True, user=to_user.to_dict())

@blueprint.route('/demerit/list/<string:slug>')
def demerit_list(slug):
    as_html = request.values.get('as_html', False)
    user = User.query.filter(User.slug==slug).first()
    if user:
        demerits = [d.to_dict() for d in Demerit.query.filter(Demerit.to_user_id==user.id).order_by(Demerit.created_at.desc())]
    else:
        demerits = []

    if as_html:
        return render_template('demerits.html', demerits=demerits)
    else:
        return render_json(demerits=demerits)

@blueprint.route('/excuse/create', methods=['POST'])
def excuse_create():
    excuse = request.form.get('excuse', None)
    demerit_id = request.form.get('demerit_id', True)
    #
    #Use the demerit_id as the new Excuses reference
    
    #Create a new Excuse
    newExcuse = Excuse()
    #Set the to_demerit_id to the demerit id that we are working on
    newExcuse.to_demerit_id = demerit_id
    #assign the excuse text that the user just submitted
    newExcuse.excuse = excuse
    #Add that to the commit (save it)
    current_app.db.session.add(newExcuse)
    
    #now set the demerit property has_excuse to true
    to_demerit = Demerit.query.filter(Demerit.id==demerit_id).first()
    to_demerit.has_excuse = True
    #Add that to the commit (save it)
    current_app.db.session.add(to_demerit)

    #commit that shit
    current_app.db.session.commit()
    # print excuse 
    return render_json(success=True, excuse=newExcuse.to_dict())

@blueprint.route('/excuse/list/<string:id>')
def excuse_list(id):
    as_html = request.values.get('as_html', False)
    demerit = Demerit.query.filter(Demerit.id==id).first()
    has_excuse = demerit.has_excuse
    print "******************()(*)(*)*"
    print demerit.id
    print as_html
    
    if as_html:
        excuses = [e.to_dict() for e in Excuse.query.filter(Excuse.to_demerit_id==demerit.id)]
    else:
        excuses = []
        print "XXXXXX ELSE IS FIRINGXXXXX"
    
    print "**********@*@*@*@**********"
    print excuses
    
    if has_excuse:
        return render_template('excuses.html', excuses=excuses)
    else:
        return render_template('excuse.html', excuses=excuses, demerit=demerit)
	
    
