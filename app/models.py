import re
import datetime
from inspect import isdatadescriptor
from sqlalchemy import String, Integer, Column, Boolean, Sequence, ForeignKey, func, DateTime, event
from sqlalchemy.orm import relationship

from database import Base

_slugify_strip_re = re.compile(r'[^\w\s-]')
_slugify_hyphenate_re = re.compile(r'[-\s]+')
def slugify(value):
    """
    Normalizes string, converts to lowercase, removes non-alpha characters,
    and converts spaces to hyphens.
    
    From Django's "django/template/defaultfilters.py".
    """
    import unicodedata
    if not isinstance(value, unicode):
        value = unicode(value)
    value = unicodedata.normalize('NFKD', value).encode('ascii', 'ignore')
    value = unicode(_slugify_strip_re.sub('', value).strip().lower())
    return _slugify_hyphenate_re.sub('-', value)

def name_slugger(mapper, connection, target):
    if hasattr(target, 'first_name'):
        target.slug = slugify('%s %s' % (target.first_name, target.last_name))


#class TromboneDocument(mongoengine.Document):
    #def as_dict(self): 
        #if isinstance(self, (mongoengine.Document, mongoengine.EmbeddedDocument)): 
            #out = dict(self._data) 
            #for k,v in out.items(): 
                #if isinstance(v, ObjectId): 
                    #out[k] = str(v) 

                #if isinstance(v, DBRef): 
                    #out[k] = str(v) 
        #elif isinstance(self, mongoengine.queryset.QuerySet): 
            #out = list(self) 
        #elif isinstance(self, types.ModuleType): 
            #out = None 
        #elif isinstance(self, groupby): 
            #out = [ (g,list(l)) for g,l in self ] 
        #else: 
            #raise TypeError, "Could not dict-encode type '%s': %s" % (type(self), str(self)) 
        #return out 
    

class User(Base):
    __tablename__ = 'users'
    __dict_ignore = ['__weakref__', 'given_demerits', 'received_demerits']
    
    id = Column(Integer, primary_key=True)
    email = Column(String(200))
    first_name = Column(String(100))
    last_name = Column(String(100))
    slug = Column(String(200))
    can_give_demerits = Column(Boolean)
    api_key = Column(String(100))
    demerits = Column(Integer, default=0)
    #do the same for excuses?
    given_demerits = relationship("Demerit", backref="from_user", primaryjoin="User.id==Demerit.from_user_id")
    received_demerits = relationship("Demerit", backref="to_user", primaryjoin="User.id==Demerit.to_user_id")
    
    def to_dict(self):
        def convert_datetime(value):
            return value.strftime("%Y-%m-%d %H:%M:%S")
        
        base_dict = {}
        for prop_name in dir(User):
            if isdatadescriptor(getattr(User, prop_name)) and prop_name not in User.__dict_ignore and prop_name not in base_dict:
                value = getattr(self, prop_name)
                if isinstance(value, datetime.datetime):
                    value = convert_datetime(value)

                base_dict[prop_name] = value

        return base_dict

event.listen(User.__mapper__, 'before_insert', name_slugger)
event.listen(User.__mapper__, 'before_update', name_slugger)


class Demerit(Base):
    __tablename__ = 'demerits'
    __dict_ignore = ['__weakref__', 'to_user', 'from_user']

    id = Column(Integer, primary_key=True)
    created_at = Column(DateTime, default=func.now())
    from_user_id = Column(Integer, ForeignKey('users.id'))
    to_user_id = Column(Integer, ForeignKey('users.id'))
    reason = Column(String(1000))
    has_excuse = Column(Boolean, default=False)


    def to_dict(self):
        def convert_datetime(value):
            return value.strftime("%Y-%m-%d %H:%M:%S")

        def convert_datetime_dateonly(value):
            return value.strftime("%Y-%m-%d")

        base_dict = {}
        for prop_name in dir(Demerit):
            if isdatadescriptor(getattr(Demerit, prop_name)) and prop_name not in Demerit.__dict_ignore and prop_name not in base_dict:
                value = getattr(self, prop_name)
                if isinstance(value, datetime.datetime):
                    base_dict[prop_name + '_date'] = convert_datetime_dateonly(value)
                    value = convert_datetime(value)
                base_dict[prop_name] = value

        return base_dict

# adding a table for excuses

class Excuse(Base):
    __tablename__ = 'excuses'
    __dict_ignore = ['__weakref__']
	
    id = Column(Integer, primary_key=True)
    to_demerit_id = Column(Integer, ForeignKey('demerits.id'))
    excuse = Column(String(1000))
	
    def to_dict(self):

        base_dict = {}
	for prop_name in dir(Excuse):
            if isdatadescriptor(getattr(Excuse, prop_name)) and prop_name not in Excuse.__dict_ignore and prop_name not in base_dict:
                #print 'ok: ' + prop_name
                value = getattr(self, prop_name)
                #print 'setting value %s: %s' % (prop_name, value)				
                base_dict[prop_name] = value
                #print 'sup dog'
                #print base_dict
	
        return base_dict
