from extensions import db, ma
import uuid
import json


# toybox_association = db.Table('toybox_association',
#     db.Column('user_id', db.Integer, db.ForeignKey('users.id')),
#     db.Column('toy_id', db.Integer, db.ForeignKey('toys.id'))
# )


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

    is_deleted = db.Column(db.Boolean, default=False)

    # userBox = db.Column(db.String(5000), nullable=True)

    # def set_userBox(self, urls_list):
    #     """Set the userBox with a list of URLs."""
    #     self.userBox = ','.join(urls_list)

    # def get_userBox(self):
    #     """Get the userBox as a list of URLs."""
    #     return self.userBox.split(',') if self.userBox else []

    
    userBox = db.Column(db.String(5000), nullable=True)

    def set_userBox(self, urls_list):
        if urls_list and isinstance(urls_list, list):
            self.userBox = json.dumps(urls_list)
        else:
            self.userBox = json.dumps([])

    def get_userBox(self):
        try:
            return json.loads(self.userBox) if self.userBox else []
        except json.JSONDecodeError:
            return []





    toys = db.relationship('Toy', backref='user', lazy='dynamic')
    # toybox = db.relationship('Toy', secondary=toybox_association, backref='toyboxes', lazy='dynamic')

    #toys = db.relationship('Toy', backref='user')
    #toybox = db.relationship('Toy', secondary=toybox_association, backref='toyboxes')




class Toy(db.Model):
    __tablename__ = 'toys'
    id = db.Column(db.Integer, primary_key=True)
    image_url_one = db.Column(db.String(200), nullable=False)
    image_url_two = db.Column(db.String(200), nullable=True)
    image_url_three = db.Column(db.String(200), nullable=True)
    image_url_four = db.Column(db.String(200), nullable=True)
    image_url_five = db.Column(db.String(200), nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    toy_latitude = db.Column(db.Float, nullable=True)
    toy_longitude = db.Column(db.Float, nullable=True)

    is_deleted = db.Column(db.Boolean, default=False)



class UserToyAction(db.Model):
    __tablename__ = 'user_toy_actions'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    toy_id = db.Column(db.Integer, db.ForeignKey('toys.id'), nullable=False)
    action = db.Column(db.String(10), nullable=False)  # 'left', 'right', or 'none'




class UserSchema(ma.SQLAlchemyAutoSchema):
    toys = ma.Nested('ToySchema', many=True)

    class Meta:
        model = User
        #fields = ('id', 'name', 'email', 'password', 'profile_picture', 'bio', 'user_latitude', 'user_longitude', 'toys', 'toybox')
        fields = ('id', 'name', 'email', 'password', 'profile_picture', 'bio', 'user_latitude', 'user_longitude', 'is_deleted', 'userBox', 'toys')
        load_instance = True



class ToySchema(ma.SQLAlchemyAutoSchema):
    #toyboxes = ma.Nested('UserSchema', many=True)

    class Meta:
        model = Toy
        ## First fields line includes toyboxes which I don't think I need but perhaps
        #fields = ('id', 'image_url_one', 'image_url_two', 'image_url_three', 'image_url_four', 'image_url_five', 'user_id', 'toy_latitude', 'toy_longitude', 'toyboxes')
        fields = ('id', 'image_url_one', 'image_url_two', 'image_url_three', 'image_url_four', 'image_url_five', 'user_id', 'toy_latitude', 'toy_longitude', 'is_deleted')
        load_instance = True



class UserToyActionSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = UserToyAction
        fields = ('id', 'user_id', 'toy_id', 'action')
        load_instance = True


