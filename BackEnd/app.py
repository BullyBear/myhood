from flask import Flask
from flask_restful import Api, Resource
from models import User, Toy, UserSchema, ToySchema
from config import DATABASE_URI, SQLALCHEMY_TRACK_MODIFICATIONS
from extensions import db, ma, bcrypt, jwt, cors

from API.toy_resources import ToyList, ToyResourceTime
from API.user_resources import Users, Register, Login

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = SQLALCHEMY_TRACK_MODIFICATIONS
app.config['JWT_SECRET_KEY'] = 'your-secret-key'

db.init_app(app)
ma.init_app(app)
bcrypt.init_app(app)
jwt.init_app(app)
cors.init_app(app)

api = Api(app)

@app.before_first_request
def create_tables():
    db.create_all()

# Add the Home class here
class Home(Resource):
    def get(self):
        return {'message': 'Hello, World!'}

# Register the Home route here
api.add_resource(Home, '/')

# The rest of your routes
api.add_resource(Users, '/users')
api.add_resource(Register, '/register')
api.add_resource(Login, '/login')
api.add_resource(ToyList, '/toys')
api.add_resource(ToyResourceTime, '/toys/<int:toy_id>')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
