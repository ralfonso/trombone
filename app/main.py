from flask import Flask, Blueprint, g, render_template
from mongoengine import connect
import models
import api

# create the little application object
app = Flask(__name__)
app.config.from_pyfile('trombone.cfg')

# connect to the database
connection = connect(app.config['MONGODB_DB'], host=app.config['MONGODB_HOST'], port=app.config['MONGODB_PORT'])

app.register_blueprint(api.blueprint, url_prefix='/api')

@app.before_request
def set_connection():
    g.connection = connection

@app.route('/')
def index():
    return render_template('index.html', controller='main', action='index')

@app.route('/demerit')
def demerit():
    return render_template('demerit.html', controller='main', action='demerit')
    

if __name__ == '__main__':
    app.run()
