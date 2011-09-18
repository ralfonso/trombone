from sqlalchemy.ext.declarative import declarative_base

db = None
engine = None
Base = declarative_base()

def init_db(app):
    db = app.db.init_app(app)
    Base.query = app.db.session.query_property()
    
    return app


def create_db(app):
    engine = app.db.engine
    Base.metadata.create_all(engine)
