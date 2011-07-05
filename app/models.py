import mongoengine
import re
from pymongo.objectid import ObjectId
from pymongo.dbref import DBRef

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


class TromboneDocument(mongoengine.Document):
    def as_dict(self): 
        if isinstance(self, (mongoengine.Document, mongoengine.EmbeddedDocument)): 
            out = dict(self._data) 
            for k,v in out.items(): 
                if isinstance(v, ObjectId): 
                    out[k] = str(v) 

                if isinstance(v, DBRef): 
                    out[k] = str(v) 
        elif isinstance(self, mongoengine.queryset.QuerySet): 
            out = list(self) 
        elif isinstance(self, types.ModuleType): 
            out = None 
        elif isinstance(self, groupby): 
            out = [ (g,list(l)) for g,l in self ] 
        else: 
            raise TypeError, "Could not dict-encode type '%s': %s" % (type(self), str(self)) 
        return out 
    

class User(TromboneDocument):
    meta = {'collection': 'users'}
    email = mongoengine.StringField(required=True)
    first_name = mongoengine.StringField(required=True)
    last_name = mongoengine.StringField(required=True)
    slug = mongoengine.StringField()
    can_give_demerits = mongoengine.BooleanField(default=False)
    demerits = mongoengine.IntField(default=0)

    def save(self):
        self.slug = slugify(self.first_name + '-' + self.last_name)
        super(User, self).save()

class APIKey(TromboneDocument):
    meta = {'collection': 'apikeys'}
    user = mongoengine.ReferenceField(User, required=True)
    key = mongoengine.StringField(required=True)

class Demerit(TromboneDocument):
    meta = {'collection': 'demerits'}
    from_user = mongoengine.ReferenceField(User, required=True)
    to_user = mongoengine.ReferenceField(User, required=True)

    def save(self):
        to_user = User.objects(slug=self.to_user.slug).update_one(inc__demerits=1)
        super(Demerit, self).save()
