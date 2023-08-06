from extensions import db, ma
import uuid

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    profile_picture = db.Column(db.String(200), nullable=True)
    bio = db.Column(db.Text, nullable=True)
    user_latitude = db.Column(db.Float, nullable=True)
    user_longitude = db.Column(db.Float, nullable=True)

    #toys = db.relationship('Toy', backref='user', lazy=True)
    toys = db.relationship('Toy', backref='user', lazy='dynamic')

class Toy(db.Model):
    __tablename__ = 'toys'
    id = db.Column(db.Integer, primary_key=True)
    image_url = db.Column(db.String(200), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    toy_latitude = db.Column(db.Float, nullable=True)
    toy_longitude = db.Column(db.Float, nullable=True)

class UserSchema(ma.SQLAlchemyAutoSchema):
    toys = ma.Nested('ToySchema', many=True)

    class Meta:
        model = User
        fields = ('id', 'name', 'email', 'password', 'profile_picture', 'bio', 'user_latitude', 'user_longitude', 'toys')
        load_instance = True

class ToySchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Toy
        fields = ('id', 'image_url', 'user_id', 'toy_latitude', 'toy_longitude')
        load_instance = True
