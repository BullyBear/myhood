from flask import Flask, request
from flask_restful import Api, Resource
from config import DATABASE_URI, SQLALCHEMY_TRACK_MODIFICATIONS
from extensions import db, ma, bcrypt, jwt, cors
from flask_migrate import Migrate
from geopy.distance import geodesic

from models import User, Toy, UserSchema, ToySchema
from API.toy_resources import ToyList, ToyResourceTime
from API.user_resources import Users, Register, Login, Invite, Forgot

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = SQLALCHEMY_TRACK_MODIFICATIONS
app.config['JWT_SECRET_KEY'] = 'your-secret-key'

db.init_app(app)
ma.init_app(app)
bcrypt.init_app(app)
jwt.init_app(app)
cors.init_app(app)

migrate = Migrate(app, db)

api = Api(app)

@app.before_first_request
def create_tables():
    db.create_all()

class Home(Resource):
    def get(self):
        return {'message': 'Hello, World!'}

api.add_resource(Home, '/')

api.add_resource(Users, '/users')
api.add_resource(Register, '/register')
api.add_resource(Login, '/login')
api.add_resource(ToyList, '/toys')
api.add_resource(ToyResourceTime, '/toys/<int:toy_id>')
api.add_resource(Invite, '/invite')
api.add_resource(Forgot, '/forgot')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)



