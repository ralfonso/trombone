from flask import Flask, Blueprint, g, render_template
from flaskext.sqlalchemy import SQLAlchemy
from database import init_db
import api

# create the little application object
app = Flask(__name__)
app.config.from_pyfile('trombone.cfg')
app.db = SQLAlchemy()
app = init_db(app)

import models

app.register_blueprint(api.blueprint, url_prefix='/api')

@app.route('/')
def index():
    return render_template('index.html', controller='main', action='index')

@app.route('/demerit')
def demerit():
    return render_template('demerit.html', controller='main', action='demerit')
    

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
