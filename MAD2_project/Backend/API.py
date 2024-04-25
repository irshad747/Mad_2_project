from flask import Flask, render_template, request, redirect, url_for,session,flash,jsonify
import os
from flask_jwt_extended import jwt_required,get_jwt
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import requests
from sqlalchemy import Column, Integer, String, Date
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime,date
from flask_cors import cross_origin
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_restful import Api, Resource
import datetime
import json
from datetime import date,datetime
from flask_security import Security, SQLAlchemyUserDatastore, UserMixin, RoleMixin
from flask_security.utils import hash_password, verify_password
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
from flask import Flask, jsonify, request
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField
from wtforms.validators import DataRequired, Email, EqualTo
from flask_cors import cross_origin
from sqlalchemy import or_, and_
from flask_mail import Mail, Message
from celery import Celery
import redis

# Assuming your existing database configuration and models are already defined
current_dir = os.path.abspath(os.path.dirname(__file__))
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*", "methods": ["GET", "POST", "PUT", "DELETE"]}})
app.config["JWT_SECRET_KEY"] = "your-secret-key"  # Change this!
jwt = JWTManager(app)
api = Api(app)
app.config['CORS_HEADERS'] = '*'


app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///"+ os.path.join(current_dir,"project.db")
db = SQLAlchemy(app)
app.app_context().push()


# Configure Flask-Mail
app.config['MAIL_SERVER'] = 'smtp.googlemail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'irshadsareshwala@gmail.com'  # replace with your email
app.config['MAIL_PASSWORD'] = 'uqyabulwdbxvzapb'  # replace with your email password
app.config['MAIL_DEFAULT_SENDER'] = 'irshadsareshwala@gmail.com'
MAIL_DEBUG = True

mail = Mail(app)

# Configure Celery
app.config['broker_url'] = 'redis://localhost:6379/0'
app.config['result_backend'] = 'redis://localhost:6379/0'

celery = Celery(app.name, broker=app.config['broker_url'])
celery.conf.update(app.config)

r = redis.Redis(host='localhost', port=6379, db=0)
class admin(db.Model):
    __tablename__ = 'admin'
    admin_id = db.Column(db.Integer,autoincrement=True,primary_key=True)
    admin_name = db.Column(db.String,nullable=False)
    admin_email =db.Column(db.String,unique=True,nullable=False)
    admin_pass = db.Column(db.String,nullable=False,unique=True)
roles_users = db.Table('roles_users',
    db.Column('user_id', db.Integer(), db.ForeignKey('user.id')),
    db.Column('role_id', db.Integer(), db.ForeignKey('role.id'))
)
class user(db.Model,UserMixin):
    __tablename__ = 'user'
    id = db.Column(db.Integer,autoincrement=True,primary_key=True)
    #name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(50), nullable=False)
    active = db.Column(db.Boolean())
    name = db.Column(db.String(50), nullable=False)
    phone = db.Column(db.Integer)
    address =db.Column(db.String)
    active = db.Column(db.Boolean())
    roles = db.relationship('Role', secondary=roles_users,
                            backref=db.backref('users', lazy='dynamic'))
    def hash_password(self, password):
        self.password = generate_password_hash(password)

    def verify_password(self, password):
        return check_password_hash(self.password, password)
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
            'address': self.address,
            'active': self.active,
            'roles': [role.to_dict() for role in self.roles]  # include role details in each user
        }
class Role(db.Model, RoleMixin):
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(80), unique=True)
    description = db.Column(db.String(255))

class venue(db.Model):
    __tablename__ = 'venue'
    id = db.Column(db.Integer,autoincrement=True,primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    location = db.Column(db.String(50), nullable=False)
    capacity = db.Column(db.Integer, nullable=False)
    current_capacity = db.Column(db.Integer)
    shows = db.relationship('show', backref='venue', lazy=True,cascade='all,delete')
    def to_dict(self):
        return {'id': self.id, 'name': self.name, 'location': self.location,
                'capacity': self.capacity,'current_capacity':self.current_capacity,'shows': [show.to_dict() for show in self.shows]}
class show(db.Model):
    __tablename__ = 'show'
    id = db.Column(db.Integer,autoincrement=True,primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    time = db.Column(db.String(), nullable=False)
    venue_id = db.Column(db.Integer, db.ForeignKey('venue.id'))
    available_seats = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Integer)
    rating = db.Column(db.String)
    tag = db.Column(db.String)
    Date = db.Column(db.Date)
    poster = db.Column(db.String)
    Synopsis = db.Column(db.String)
    Description = db.Column(db.String)
    bookings = db.relationship('booking', backref='show', lazy=True,cascade='all,delete')
    '''def to_dict(self):
        return {'id': self.id, 'name': self.name, 'time': self.time,
                'venue_id': self.venue_id,'available_seats':self.available_seats,'price':self.price,'rating':self.rating,'tag':self.tag,'Date':self.Date.isoformat(),'poster':self.poster,'Synopsis':self.Synopsis,'Description':self.Description,'venue': self.venue.to_dict()}'''
    def to_dict(self):
      return {
        'id': self.id,
        'name': self.name,
        'time': self.time,
        'venue_id': self.venue_id,
        'available_seats': self.available_seats,
        'price': self.price,
        'rating': self.rating,
        'tag': self.tag,
        'Date': self.Date.isoformat(),
        'poster': self.poster,
        'Synopsis': self.Synopsis,
        'Description': self.Description,
        'venue': {
            'id': self.venue.id,
            'name': self.venue.name,
            'location': self.venue.location,
            'capacity': self.venue.capacity,
            'current_capacity': self.venue.current_capacity,
        }
    }


class booking(db.Model):
    __tablename__ = 'booking'
    id = db.Column(db.Integer,autoincrement=True,primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    show_id = db.Column(db.Integer, db.ForeignKey('show.id'))
    num_tickets = db.Column(db.Integer, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow) 
    shows = db.relationship('show')
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'show_id': self.show_id,
            'num_tickets': self.num_tickets,
            'show': self.show.to_dict(),
            'timestamp': self.timestamp.isoformat(),  
        }

class ratings(db.Model):
    __tablename__ = 'ratings'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    show_id = db.Column(db.Integer, db.ForeignKey('show.id'), nullable=False)
    r = db.Column(db.Integer, nullable=False)
#user_datastore = SQLAlchemyUserDatastore(db, user, Role)
#security = Security(app, user_datastore)

# Registration endpoint
@app.route("/user/register", methods=["POST"])
@cross_origin()
def register():
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    
    if user.query.filter_by(email=email).first():
        return jsonify({"msg": "Email already registered"}), 400

    userr = user(email=email, password=generate_password_hash(password))
    db.session.add(userr)
    db.session.commit()

    return jsonify({"msg": "User created"}), 201

# Login endpoint
@app.route("/user/login", methods=["POST"])
@cross_origin()
def login():
    email = request.json.get("email", None)
    password = request.json.get("password", None)

    userr = user.query.filter_by(email=email).first()
    if userr and check_password_hash(userr.password, password):
        access_token = create_access_token(identity=userr.id)
        return jsonify(access_token=access_token,userId=userr.id), 200
    else:
        return jsonify({"msg": "Bad username or password"}), 401


@app.route('/admin/login', methods=['POST'])
@cross_origin()
def admin_login():
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400

    username = request.json.get('username', None)
    password = request.json.get('password', None)

    admins = admin.query.filter_by(admin_name=username).first()
    #if admins and check_password_hash(admins.password, password):
    if admins and admins.admin_pass==password:
        access_token = create_access_token(identity=admins.admin_id, additional_claims={"role": "admin"})
        return jsonify(access_token=access_token), 200
    else:
        return jsonify({"msg": "Bad username or password"}), 401
    

##############_________________Celery_Tasks__________________________################
from datetime import datetime

import csv


@celery.task
def export_venue_details(venue_id):
    # Create a Flask application context
    with app.app_context():
        req_venue = venue.query.filter_by(id=int(venue_id)).first()
        if req_venue is None:
            return json.dumps({"error": "Venue not found"}), 404

        shows = show.query.filter_by(venue_id=venue_id).all()
        print("fetched the Shows")

        # Prepare CSV data
        data = []
        for s in shows:
            num_bookings = booking.query.filter_by(show_id=s.id).count()
            
            # Query ratings for the show
            show_ratings = ratings.query.filter_by(show_id=s.id).all()
            show_ratings = [r.r for r in show_ratings]
            
            # Calculate average rating if there are any ratings, else set to None
            avg_rating = sum(show_ratings) / len(show_ratings) if show_ratings else None

            data.append({
                'show_name': s.name,
                'num_bookings': num_bookings,
                'avg_rating': avg_rating
            })

        # Write CSV data to a file
        with open(f'venue_{venue_id}_details.csv', 'w') as f:
            writer = csv.DictWriter(f, fieldnames=['show_name', 'num_bookings', 'avg_rating'])
            writer.writeheader()
            writer.writerows(data)

        return 'Export task completed successfully'

from datetime import datetime, timedelta
@celery.task()
def send_monthly_reports():
    with app.app_context():
        one_month_ago = datetime.now() - timedelta(days=30)

        all_user = user.query.all()
        for users in all_user:
            bookings = booking.query.filter_by(user_id=users.id).filter(booking.timestamp >= one_month_ago).all()
            shows = [booking.show for booking in bookings]
            rratings = ratings.query.filter_by(user_id=users.id).all()

            html = render_template('monthly_report.html', user=users, bookings=bookings, shows=shows, ratings=rratings)
            msg = Message('Monthly Report', recipients=[users.email], html=html)
            mail.send(msg)

@app.route('/')
def index():
    return render_template('check.html', user=user.query.all(), bookings=booking.query.filter_by(user_id=1), shows=show.query.all(), ratings=ratings.query.all())


# A function to send emails
def send_email(to, subject, template):
    msg = Message(
        subject,
        recipients=[to],
        html=template,
        sender=app.config['MAIL_DEFAULT_SENDER']
    )
    mail.send(msg)

# A Celery task to check if users have booked any shows
@celery.task
def check_bookings_and_send_emails():
    with app.app_context():
      users = user.query.all()
      for userr in users:
          last_booking = booking.query.filter_by(user_id=userr.id).order_by(booking.timestamp.desc()).first()
          if last_booking is None or last_booking.timestamp.date() < datetime.now().date():
            send_email(userr.email, 'We miss you!', '<h1>Please come back and book a show!</h1>')
            print('hello')
            return 'hello'



from celery.schedules import crontab

celery.conf.beat_schedule = {
    'send-every-month': {
        'task': 'API.send_monthly_reports',
        'schedule': timedelta(seconds=20),
    },
    'send-every-day': {
        'task': 'API.check_bookings_and_send_emails',
        'schedule': timedelta(seconds=30),
    },
}





#################_______________All The APIs _______#################_________________############
from datetime import datetime

@app.route('/api/venue/<int:venue_id>/export', methods=['POST'])
def export_venue(venue_id):
    export_venue_details.delay(venue_id)
    return jsonify({'message': 'Export task started successfully'}), 200

class ShowResource(Resource):
    def get(self, show_date):
        try:
            # Parse the date string into a datetime.date object
            show_date_obj = datetime.strptime(show_date, "%Y-%m-%d").date()
        except ValueError:
            return {"message": "Invalid date format. Expected format: 'YYYY-MM-DD'."}, 400

        # Convert the date object to a string in the format 'YYYYMMDD'
        show_date_str = show_date_obj.strftime('%Y%m%d')

        # Check if the data is in the cache
        shows_from_date = r.get(show_date_str)
        if shows_from_date is None:
            # If not, get it from the database
            shows_from_date = show.query.filter(show.Date>=show_date_obj).distinct(show.name).group_by(show.name).all()

            # Convert the shows_on_date list into a list of dictionaries
            show_list = [s.to_dict() for s in shows_from_date]

            # Store the data in the cache, with an expiry time of 1 hour
            r.setex(show_date_str, 3600, json.dumps(show_list))
        else:
            # If the data is in the cache, load it
            show_list = json.loads(shows_from_date)

        return {"shows": show_list}

# Register the ShowResource with the API under the route "/shows/<string:show_date>"
api.add_resource(ShowResource, "/shows/<string:show_date>")

'''
class ShowResource(Resource):
    def get(self, show_date):
        try:
            # Parse the date string into a datetime.date object
            show_date = datetime.strptime(show_date, "%Y-%m-%d").date()
        except ValueError:
            return {"message": "Invalid date format. Expected format: 'YYYY-MM-DD'."}, 400
        
        shows_from_date = r.get(show_date)

        if shows_from_date is None:
          shows_from_date = show.query.filter(show.Date>=show_date).distinct(show.name).group_by(show.name).all()

        # Convert the shows_on_date list into a list of dictionaries
          show_list = [s.to_dict() for s in shows_from_date]
          r.set(show_date, json.dumps(show_list), ex=3600)

          return {"shows": show_list}
        else:
            # If the data is in Redis, return it
            return {"shows": json.loads(shows_from_date)}

# Register the ShowResource with the API under the route "/shows/<string:show_date>"
api.add_resource(ShowResource, "/shows/<string:show_date>")'''


'''
class ShowByNameResource(Resource):
    def get(self, show_name):
        req_show = show.query.filter_by(name=show_name).all()
        venues = []
        for s in req_show:
            venuee = s.venue
            if venuee not in venues:
                venuee_dict = venuee.to_dict()
                venuee_dict['shows'] = [s.to_dict() for s in venuee.shows]
                venues.append(venuee_dict)

        # Convert the req_show list into a list of dictionaries
        show_list = [s.to_dict() for s in req_show]

        return {"shows": show_list}

api.add_resource(ShowByNameResource, "/shows/byname/<string:show_name>")'''

class ShowByNameResource(Resource):
    def get(self, show_name):
        # First, try to get the show using Redis
        show_from_cache = r.get(show_name)

        # If the data is not in the cache
        if show_from_cache is None:
            req_show = show.query.filter_by(name=show_name).all()
            venues = []
            for s in req_show:
                venuee = s.venue
                if venuee not in venues:
                    venuee_dict = venuee.to_dict()
                    venuee_dict['shows'] = [s.to_dict() for s in venuee.shows]
                    venues.append(venuee_dict)

            # Convert the req_show list into a list of dictionaries
            show_list = [s.to_dict() for s in req_show]

            # Save the data to the cache
            r.setex(show_name,3600, json.dumps(show_list))
        else:
            # If the data is in the cache, convert it back to a list
            show_list = json.loads(show_from_cache.decode('utf-8'))
        return {"shows": show_list}

api.add_resource(ShowByNameResource, "/shows/byname/<string:show_name>")

'''
class ShowByIdResource(Resource):
    def get(self, show_id):
        req_show = show.query.get(show_id)
        if req_show:
            return jsonify({"show": req_show.to_dict()})
        else:
            return {"message": "Show not found"}, 404'''

class ShowByIdResource(Resource):
    def get(self, show_id):
        # Try to get the show from the cache first
        show_from_cache = r.get(f'show_{show_id}')

        if show_from_cache is None:
            # If the show is not in the cache, get it from the database
            req_show = show.query.get(show_id)
            if req_show:
                # Convert the show data to a dictionary and store it in a variable
                show_data = req_show.to_dict()
                # Store the show data in the cache
                r.setex(f'show_{show_id}',3600, json.dumps(show_data))
            else:
                return {"message": "Show not found"}, 404
        else:
            # If the show is in the cache, load it from the cache
            show_data = json.loads(show_from_cache.decode('utf-8'))

        return jsonify({"show": show_data})

'''
class VenueByIdResource(Resource):
    def get(self, venue_id):
        req_venue = venue.query.filter_by(id=venue_id).first()
        if req_venue:
            return {"venue": req_venue.to_dict()}
        else:
            return {"message": "Venue not found"}, 404'''
class VenueByIdResource(Resource):
    def get(self, venue_id):
        # Try to get the venue from Redis
        venue_from_cache = r.get(f'venue_{venue_id}')
        # If the venue is not in the cache
        if venue_from_cache is None:
            # Get the venue from the database
            req_venue = venue.query.filter_by(id=venue_id).first()
            if req_venue:
                # Save the venue to the cache
                r.setex(f'venue_{venue_id}',3600, json.dumps(req_venue.to_dict()))
                return {"venue": req_venue.to_dict()}
            else:
                return {"message": "Venue not found"}, 404
        else:
            # If the venue is in the cache, return it
            venue = json.loads(venue_from_cache.decode('utf-8'))
            return {"venue": venue}
api.add_resource(ShowByIdResource, "/shows/<int:show_id>")
api.add_resource(VenueByIdResource, "/venues/<int:venue_id>")

from flask_restful import Resource, reqparse

class ShowAndVenueResource(Resource):
    def get(self, show_name, venue_name):
        req_show = show.query.join(venue).\
            filter(show.name == show_name, venue.name == venue_name).first()
        if req_show:
            return {"show": req_show.to_dict()}
        else:
            return {"message": "Show and venue combination not found"}, 404

    def put(self, show_name, venue_name):
        parser = reqparse.RequestParser()
        parser.add_argument('num_tickets', type=int, required=True)
        args = parser.parse_args()

        req_show = show.query.join(venue).\
            filter(show.name == show_name, venue.name == venue_name).first()
        if req_show:
            if args['num_tickets'] <= req_show.available_seats:
                req_show.available_seats -= args['num_tickets']
                db.session.commit()
                return {"message": "Show updated successfully", "show": req_show.to_dict()}
            else:
                return {"message": "Insufficient available seats"}, 400
        else:
            return {"message": "Show and venue combination not found"}, 404
api.add_resource(ShowAndVenueResource, "/showandvenue/<string:show_name>/<string:venue_name>")


class VenueListResource(Resource):
    def get(self):
        # first trying to get list of venues using redis
        venues_from_cache = r.get('venues')
        # If the data is not in the cache
        if venues_from_cache is None:
            # Get the data from the database
            venues_from_table = venue.query.all()
            venues = [v.to_dict() for v in venues_from_table]
            # Save the data to the cache
            r.setex('venues',3600, json.dumps(venues))
        else:
            # If the data is in the cache, convert it back to a list
            venues = json.loads(venues_from_cache.decode('utf-8'))
        return {"venues": venues}

api.add_resource(VenueListResource, "/api/venues")

'''
class ShowsByVenueResource(Resource):
    def get(self, venue_id):
        req_shows = show.query.filter_by(venue_id=venue_id).all()
        return {"shows": [s.to_dict() for s in req_shows]}
api.add_resource(ShowsByVenueResource, "/api/shows/byvenue/<int:venue_id>")'''
class ShowsByVenueResource(Resource):
    def get(self, venue_id):
        # first trying to get list of shows for the venue from Redis
        shows_from_cache = r.get(f'shows_by_venue_{venue_id}')
        # If the data is not in the cache
        if shows_from_cache is None:
            # Get the data from the database
            req_shows = show.query.filter_by(venue_id=venue_id).all()
            shows = [s.to_dict() for s in req_shows]
            # Save the data to the cache
            r.setex(f'shows_by_venue_{venue_id}',3600, json.dumps(shows))
        else:
            # If the data is in the cache, convert it back to a list
            shows = json.loads(shows_from_cache.decode('utf-8'))
        return {"shows": shows}

api.add_resource(ShowsByVenueResource, "/api/shows/byvenue/<int:venue_id>")



@app.route('/api/add/venues', methods=['POST'])
@cross_origin()
@jwt_required()
def add_venue():
    claims = get_jwt()  # Get the claims from the JWT token
    if 'role' not in claims or claims['role'] != 'admin':  # Check if the user is an admin
        return jsonify({"msg": "Access forbidden"}), 403
    # Get the JSON data from the request
    data = request.get_json()

    # Extract data from the JSON
    name = data['name']
    location = data['location']
    capacity = int(data['capacity'])  # Convert string to int

    # Create new venue object
    new_venue = venue(name=name, location=location, capacity=capacity, current_capacity=capacity)

    # Add the new venue to the database
    db.session.add(new_venue)
    db.session.commit()
    r.flushdb()

    return jsonify({'message': 'Venue added successfully'}), 201


'''
class AddVenueResource(Resource):
    def __init__(self):
        self.reqparse = reqparse.RequestParser()
        self.reqparse.add_argument('name', type=str, required=True, help="No venue name provided")
        self.reqparse.add_argument('location', type=str, required=True, help="No venue location provided")
        self.reqparse.add_argument('capacity', type=int, required=True, help="No venue capacity provided")
        self.reqparse.add_argument('current_capacity', type=int, required=False, help="No venue current capacity provided")

    def post(self):
        args = self.reqparse.parse_args()
        new_venue = venue(name=args['name'], location=args['location'], capacity=args['capacity'], current_capacity=args['capacity'])
        db.session.add(new_venue)
        db.session.commit()

        return {'message': 'Venue added successfully'}, 201
api.add_resource(AddVenueResource, "/api/add/venues")'''

@app.route('/api/update/venues/<int:venue_ids>', methods=['PUT'])
@jwt_required()
def update_venue(venue_ids):
    claims = get_jwt()  # Get the claims from the JWT token
    if 'role' not in claims or claims['role'] != 'admin':  # Check if the user is an admin
        return jsonify({"msg": "Access forbidden"}), 403
    # Get the JSON data from the request
    data = request.get_json()

    # Extract data from the JSON
    name = data['name']
    location = data['location']
    capacity = int(data['capacity'])
    #venue_idd = int(data['venue_ids'])

    # Get the venue to update from the database
    venue_to_update = venue.query.filter_by(id=venue_ids).first()

    # If the venue is not found, return a 404 error
    if not venue_to_update:
        return jsonify({'message': 'Venue not found'}), 404

    # Update the venue's details
    venue_to_update.name = name
    venue_to_update.location = location
    venue_to_update.capacity = capacity

    # Update the venue's current_capacity
    shows = show.query.filter_by(venue_id=venue_ids).all()
    booked_seats = sum(s.available_seats for s in shows)
    venue_to_update.current_capacity = capacity - booked_seats

    # Commit the changes to the database
    db.session.commit()
    r.flushdb()

    return jsonify({'message': 'Venue updated successfully'}), 200



'''
class delVenueResource(Resource):
    @jwt_required
    def delete(self, venue_id):
        claims = get_jwt()  # Get the claims from the JWT token
        if 'role' not in claims or claims['role'] != 'admin':  # Check if the user is an admin
          return jsonify({"msg": "Access forbidden"}), 403
        # Get the venue by its ID
        venue_id = int(venue_id)
        target_venue = venue.query.get(venue_id)

        # If the venue is not found, return a 404 error
        if target_venue is None:
            return {'message': f"Venue with id {venue_id} not found."}, 404

        # Delete the venue's shows
        show.query.filter_by(venue_id=venue_id).delete()

        # Delete the venue
        db.session.delete(target_venue)

        # Commit the changes
        db.session.commit()

        return {'message': f"Venue with id {venue_id} and its corresponding shows have been deleted."}, 200

# Add the API resource for the venue
api.add_resource(delVenueResource, '/api/venue/<int:venue_id>')'''
@app.route('/api/venue/<int:venue_id>', methods=['DELETE'])
@jwt_required()
def delete_venue(venue_id):
    claims = get_jwt()  # Get the claims from the JWT token
    if 'role' not in claims or claims['role'] != 'admin':  # Check if the user is an admin
        return jsonify({"msg": "Access forbidden"}), 403
    # Get the venue by its ID
    venue_id = int(venue_id)
    target_venue = venue.query.get(venue_id)

    # If the venue is not found, return a 404 error
    if target_venue is None:
        return {'message': f"Venue with id {venue_id} not found."}, 404

    # Delete the venue's shows
    show.query.filter_by(venue_id=venue_id).delete()

    # Delete the venue
    db.session.delete(target_venue)

    # Commit the changes
    db.session.commit()
    r.flushdb()

    return {'message': f"Venue with id {venue_id} and its corresponding shows have been deleted."}, 200

@app.route('/api/show/delete/<int:show_id>', methods=['DELETE'])
@jwt_required()
def delete_show(show_id):
    claims = get_jwt()  # Get the claims from the JWT token
    if 'role' not in claims or claims['role'] != 'admin':  # Check if the user is an admin
      return jsonify({"msg": "Access forbidden"}), 403
    # Get the show object by its ID

    show_to_delete = show.query.get(show_id)

    # If the show is not found, return a 404 error
    if show_to_delete is None:
        return {'message': f"Show with id {show_id} not found."}, 404

    # Update the venue's current_capacity
    req_ven = show_to_delete.venue
    req_ven.current_capacity += show_to_delete.available_seats

    # Delete the show object from the database
    db.session.delete(show_to_delete)
    db.session.commit()
    r.flushdb()

    # Return a success message
    return {'message': f"Show with id {show_id} deleted successfully."}, 200

'''
class ShowDeleterResource(Resource):
    def delete(self, show_id):
        claims = get_jwt()  # Get the claims from the JWT token
        if 'role' not in claims or claims['role'] != 'admin':  # Check if the user is an admin
          return jsonify({"msg": "Access forbidden"}), 403
        # Get the show object by its ID
      
        show_to_delete = show.query.get(show_id)

        # If the show is not found, return a 404 error
        if show_to_delete is None:
            return {'message': f"Show with id {show_id} not found."}, 404

        # Update the venue's current_capacity
        req_ven = show_to_delete.venue
        req_ven.current_capacity += show_to_delete.available_seats

        # Delete the show object from the database
        db.session.delete(show_to_delete)
        db.session.commit()

        # Return a success message
        return {'message': f"Show with id {show_id} deleted successfully."}, 200

# Add the API resource for the show deleter
api.add_resource(ShowDeleterResource, '/api/show/delete/<int:show_id>')'''


@cross_origin
@app.route('/api/add/show', methods=['POST'])
@jwt_required()
def add_show():
    # Get the JSON data from the request
    claims = get_jwt()  # Get the claims from the JWT token
    if 'role' not in claims or claims['role'] != 'admin':  # Check if the user is an admin
        return jsonify({"msg": "Access forbidden"}), 403
    data = request.get_json()

    # Extract data from the JSON
    name = data['name']
    time = data['time']
    venue_id = int(data['venue_id'])
    avail_seats = int(data['available_seats'])
    rating = data['ratings']
    tags = data['tags']
    price = int(data['price'])
    Date = data['date']
    Date = datetime.strptime(Date, '%Y-%m-%d')
    Synopsis = data['synopsis']
    Description = data['description']

    # Find the venue and update its current_capacity
    req_ven = venue.query.filter_by(id=venue_id).first()
    if req_ven.current_capacity < int(avail_seats):
        return jsonify({'message': f"Cannot add more available seats than the current capacity of the venue. Current capacity is {req_ven.current_capacity}"}), 400

    req_ven.current_capacity = req_ven.current_capacity - int(avail_seats)

    # Create a new show object
    new_show = show(name=name, time=time, venue_id=venue_id, available_seats=avail_seats, price=price, rating=rating, tag=tags, Date=Date, poster=None, Synopsis=Synopsis, Description=Description)
    
    # Add the new show to the database
    db.session.add(new_show)
    db.session.commit()
    r.flushdb()

    return jsonify({'message': f"Show '{name}' has been added successfully."}), 201

#from flask_cors import cross_origin
#@cross_origin()
@app.route('/api/show/update/<int:show_id>', methods=['PUT'])
@cross_origin()
@jwt_required()
def update_show(show_id):
    #Get the show object by its ID
    claims = get_jwt()  # Get the claims from the JWT token
    print(claims)
    if 'role' not in claims or claims['role'] != 'admin':  # Check if the user is an admin
        return jsonify({"msg": "Access forbidden"}), 403
    new_show = show.query.filter_by(id=int(show_id)).first()
    print(f"New show: {new_show}")

    # If the show is not found, return a 404 error
    if new_show is None:
        return {'message': f"Show with id {show_id} not found."}, 404

    # Get the new venue from the form data
    new_venue_id = int(request.get_json().get('venue_id'))
    new_venue = venue.query.filter_by(id=new_show.venue_id).first()
    print(f"New venue: {new_venue}")
    print(f"New venue: {new_venue.current_capacity}")

    # If the new venue is not found, return a 404 error
    if new_venue is None:
        return {'message': f"Venue with id {new_venue_id} not found."}, 404

    # Check if the requested number of seats is greater than the current capacity of the venue
    # Reset the current_capacity of the venue
    new_venue.current_capacity +=new_show.available_seats
    requested_seats = int(request.get_json().get('Available_seats'))
    if requested_seats > int(new_venue.current_capacity):
        return {'message': "The requested number of seats is greater than the current capacity of the venue."}, 400
    # Update the show object with the new data
    new_show.name = request.get_json().get('name')
    new_show.time = request.get_json().get('Time')
    new_show.available_seats = requested_seats
    new_show.rating = int(request.get_json().get('Ratings'))
    new_show.tags = request.get_json().get('Tags')
    new_show.price = int(request.get_json().get('price'))

    date_string = request.get_json().get('Date')
    date_object = datetime.strptime(date_string, '%Y-%m-%d').date()
    new_show.Date = date_object

    new_show.Synopsis = request.get_json().get('Synopsis')
    new_show.Description = request.get_json().get('Description')

    # Update the venue_id and adjust the venue's current_capacity
    ven_to_update = new_venue
    ven_to_update.current_capacity = ven_to_update.current_capacity - new_show.available_seats
    #old_venue = new_show.venue
    #print(f"old venue: {old_venue}")
    #old_venue.current_capacity += new_show.available_seats  # release the old seats
    #print(f"old venue current capacity: {old_venue.current_capacity}")
    #new_show.venue_id = new_venue.id
    #new_venue.current_capacity -= requested_seats  # reserve the new seats

    # Commit the changes to the database
    db.session.commit()
    r.flushdb()

    # Return the updated show object as a JSON object
    return jsonify({"show": new_show.to_dict()}), 200



from flask_cors import cross_origin
@cross_origin()
@app.route('/api/booking', methods=['POST'])
@jwt_required()
def create_booking():
    # Extract arguments from the request
    venue_name = request.json.get('venue_name')
    show_name = request.json.get('show_name')
    date = request.json.get('date')
    time = request.json.get('time')
    num_tickets = request.json.get('num_tickets')
    user_id = int(request.json.get('user_id'))
    jwt_user_id = get_jwt_identity()

    if jwt_user_id != user_id:
        return jsonify({"message": "Unauthorized"}), 401


    # Convert date from string to date object
    date = datetime.strptime(date, "%Y-%m-%d").date()

    # Convert number of tickets to int
    num_tickets = int(num_tickets)

    # Find the venue and show that match the given names, date, and time
    venuee = venue.query.filter_by(name=venue_name).first()
    if venuee is None:
        return jsonify({"message": "Venue not found"}), 404

    showe = show.query.filter_by(name=show_name, venue_id=venuee.id, Date=date, time=time).first()
    if showe is None:
        return jsonify({"message": "Show not found"}), 404

    # Check if there are enough available seats
    if showe.available_seats < num_tickets:
        return jsonify({"message": "Insufficient available seats"}), 400

    # Try to find an existing booking
    existing_booking = booking.query.filter_by(user_id=user_id, show_id=showe.id).first()

    if existing_booking is None:
        # If no existing booking, create a new one
        new_booking = booking(user_id=user_id, show_id=showe.id, num_tickets=num_tickets)
        db.session.add(new_booking)
    else:
        # If an existing booking is found, update the number of tickets
        existing_booking.num_tickets += num_tickets

    # Update the available seats for the show
    showe.available_seats -= num_tickets

    db.session.commit()
    r.flushdb()

    return jsonify({"message": "Booking created or updated successfully"}), 201

class BookingListResource(Resource):
    def get(self, user_id):
        user_id = int(user_id)
        bookings = booking.query.filter_by(user_id=user_id).all()
        return {"bookings": [booking.to_dict() for booking in bookings]}

api.add_resource(BookingListResource, "/api/get/bookings/<int:user_id>")

class UserResource(Resource):
    def get(self, user_id):
        userr = user.query.get(user_id)
        if userr is None:
            return {'message': 'User not found'}, 404
        return userr.to_dict()
from sqlalchemy.orm.exc import NoResultFound
api.add_resource(UserResource, "/api/get/user/<int:user_id>")



@cross_origin()
@app.route('/update/user/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    try:
        # Query the User table for the specific user
        userr = user.query.filter_by(id=user_id).one()

        # Extract the new user info from the request
        new_info = request.get_json()

        # Update the user's information
        userr.name = new_info.get('name', userr.name)
        userr.email = new_info.get('email', userr.email)
        userr.phone = new_info.get('phone', userr.phone)
        userr.address = new_info.get('address', userr.address)

        # Commit the changes to the database
        db.session.commit()

        # Return a success message
        return jsonify({"message": f"User {user_id} updated successfully"}), 200
    except NoResultFound:
        return jsonify({"message": f"User {user_id} not found"}), 404


@cross_origin()
@app.route('/api/ratings', methods=['POST'])
def rate_show():
    # Extract the rating info from the request
    rating_info = request.get_json()

    # Try to get the existing rating from the database
    existing_rating = ratings.query.filter_by(
        user_id=rating_info['user_id'],
        show_id=rating_info['show_id']
    ).first()

    if existing_rating:
        # If the rating exists, update it
        existing_rating.r = rating_info['rating']
        db.session.commit()
        return jsonify({"message": "Rating updated successfully"}), 200
    else:
        # If the rating doesn't exist, create a new one
        new_rating = ratings(
            user_id=rating_info['user_id'],
            show_id=rating_info['show_id'],
            r=rating_info['rating']
        )

        # Add the new rating to the database
        db.session.add(new_rating)
        db.session.commit()

        # Return a success message
        return jsonify({"message": "Rating added successfully"}), 201


'''
@cross_origin()
@app.route('/api/ratings', methods=['POST'])
def rate_show():
    # Extract the rating info from the request
    rating_info = request.get_json()

    # Create a new Ratings object
    new_rating = ratings(
        user_id=rating_info['user_id'],
        show_id=rating_info['show_id'],
        r=rating_info['rating']
    )

    # Add the new rating to the database
    db.session.add(new_rating)
    db.session.commit()

    # Return a success message
    return jsonify({"message": "Rating added successfully"}), 201'''
'''
@app.route('/api/search/shows', methods=['GET'])
def search_shows():
    show_query = request.args.get('query') or None
    show_tags = request.args.get('tags') or None
    print(f"Searching for shows with query: {show_query}, tags: {show_tags}")

    # split the tags by comma and strip any leading/trailing whitespace
    tags = [tagss.strip() for tagss in show_tags.split(',')]
    req_show = show.query.filter(or_(show.name.contains(show_query), show.tag.contains(show_tags))).all()
    print(f"Found shows: {req_show}")
    return jsonify(shows=[show.to_dict() for show in req_show])  # assuming your Show model has a to_dict() method
'''
@app.route('/api/search/shows', methods=['GET'])
def search_shows():
    show_query = request.args.get('query') or ''
    show_tags = request.args.get('tags') or ''

    print(f"Searching for shows with query: {show_query}, tags: {show_tags}")

    # split the tags by comma and strip any leading/trailing whitespace
    tags = [tagss.strip() for tagss in show_tags.split(',')]

    # create a key for the cache by concatenating the query and tags
    cache_key = f'show_search:{show_query}:{show_tags}'

    # try to get the results from the cache
    cached_results = r.get(cache_key)

    if cached_results is None:
        # if the results are not in the cache, get them from the database
        req_show = show.query.filter(or_(show.name.contains(show_query), show.tag.contains(show_tags))).all()
        shows = [show.to_dict() for show in req_show]

        # save the results to the cache
        r.set(cache_key, json.dumps(shows))

        print(f"Found shows: {shows}")
    else:
        # if the results are in the cache, load them
        shows = json.loads(cached_results.decode('utf-8'))
        print(f"Loaded shows from cache: {shows}")

    return jsonify(shows=shows)



@app.route('/api/search/venues', methods=['GET'])
def search_venues():
    venue_location = request.args.get('location') or None

    # Create a unique key based on the search parameters
    cache_key = f'venues_{venue_location}'

    # Try to get the results from the cache
    venues_from_cache = r.get(cache_key)

    if venues_from_cache is None:
        # If the results are not in the cache, get them from the database
        req_venue = venue.query.filter(venue.location.contains(venue_location))

        # Convert the venues to a list of dictionaries
        venues = [venuee.to_dict() for venuee in req_venue]

        # Store the results in the cache
        r.set(cache_key, json.dumps(venues))
    else:
        # If the results are in the cache, load them from the cache
        venues = json.loads(venues_from_cache.decode('utf-8'))

    return jsonify(venues=venues)


if __name__ == '__main__':
    app.run(debug=True)





'''
class AddShowResource(Resource):
    def post(self):
        # Get the form data from the request
        name = request.form['name']
        time = request.form['Time']
        venue_id = request.form['venue_id']
        avail_seats = request.form['Available_seats']
        rating = request.form['Ratings']
        tags = request.form['Tags']
        price = request.form['price']
        Date = request.form['Date']
        Date = datetime.strptime(Date, '%Y-%m-%d')
        Synopsis = request.form['Synopsis']
        Description = request.form['Description']

        # Find the venue and update its current_capacity
        req_ven = venue.query.filter_by(id=venue_id).first()
        if req_ven.current_capacity < int(avail_seats):
            return {'message': f"Cannot add more available seats than the current capacity of the venue. Current capacity is {req_ven.current_capacity}"}, 400

        req_ven.current_capacity = req_ven.current_capacity - int(avail_seats)

        # Create a new show object
        new_show = show(name=name, time=time, venue_id=venue_id, available_seats=avail_seats, price=price, rating=rating, tag=tags, Date=Date, poster=None, Synopsis=Synopsis, Description=Description)

        # Add the new show to the database
        db.session.add(new_show)
        db.session.commit()

        return {'message': f"Show '{name}' has been added successfully."}, 201

# Add the API resource for the show
api.add_resource(AddShowResource, '/api/add/show')'''

'''
class UpdateVenueResource(Resource):
    def put(self, venue_id):
        parser = reqparse.RequestParser()
        parser.add_argument('name', type=str, required=True, help='Name is required')
        parser.add_argument('location', type=str, required=True, help='Location is required')
        parser.add_argument('capacity', type=int, required=True, help='Capacity is required')
        args = parser.parse_args()

        venue_to_update = venue.query.get(venue_id)

        if venue_to_update:
            venue_to_update.name = args['name']
            venue_to_update.location = args['location']
            venue_to_update.capacity = args['capacity']

            shows = show.query.filter_by(venue_id=venue_id)
            booked_seats = 0
            for s in shows:
                booked_seats += s.available_seats

            venue_to_update.current_capacity = args['capacity'] - booked_seats
            db.session.commit()

            return {'message': 'Venue updated successfully'}, 200
        else:
            return {'message': 'Venue not found'}, 404
api.add_resource(UpdateVenueResource, '/api/venues/<int:venue_id>')'''


'''
class AddShowResource(Resource):
    def post(self):
        # Get the form data from the request
        name = request.form['name']
        time = request.form['Time']
        venue_id = request.form['venue_id']
        avail_seats = request.form['Available_seats']
        rating = request.form['Ratings']
        tags = request.form['Tags']
        price = request.form['price']
        Date = request.form['Date']
        Date = datetime.strptime(Date, '%Y-%m-%d')
        Synopsis = request.form['Synopsis']
        Description = request.form['Description']

        # Find the venue and update its current_capacity
        req_ven = venue.query.filter_by(id=venue_id).first()
        req_ven.current_capacity = req_ven.current_capacity - int(avail_seats)

        # Create a new show object
        new_show = show(name=name, time=time, venue_id=venue_id, available_seats=avail_seats, price=price, rating=rating, tag=tags, Date=Date, poster=None, Synopsis=Synopsis, Description=Description)

        # Add the new show to the database
        db.session.add(new_show)
        db.session.commit()

        return {'message': f"Show '{name}' has been added successfully."}, 201

# Add the API resource for the show
api.add_resource(AddShowResource, '/api/show')'''

'''class ShowResource(Resource):
    def get(self, show_date):
        try:
            # Parse the date string into a datetime.date object
            show_date = datetime.datetime.strptime(show_date, "%Y-%m-%d").date()
        except ValueError:
            return {"message": "Invalid date format. Expected format: 'YYYY-MM-DD'."}, 400

        shows_from_date = show.query.filter(show.Date>=show_date).distinct(show.name).group_by(show.name).all()

        # Convert the shows_on_date list into a list of dictionaries
        show_list = [s.to_dict() for s in shows_from_date]

        return {"shows": show_list}
# Register the ShowResource with the API under the route "/shows/<string:show_date>"
api.add_resource(ShowResource, "/shows/<string:show_date>")'''

'''def create_booking():
    # Extract arguments from the request
    venue_name = request.json.get('venue_name')
    show_name = request.json.get('show_name')
    date = request.json.get('date')
    time = request.json.get('time')
    num_tickets = request.json.get('num_tickets')
    user_id = request.json.get('user_id')

    # Convert date from string to date object
    date = datetime.strptime(date, "%Y-%m-%d").date()

    # Convert number of tickets to int
    num_tickets = int(num_tickets)

    # Find the venue and show that match the given names, date, and time
    venuee = venue.query.filter_by(name=venue_name).first()
    if venuee is None:
        return jsonify({"message": "Venue not found"}), 404

    showe = show.query.filter_by(name=show_name, venue_id=venuee.id, Date=date, time=time).first()
    if showe is None:
        return jsonify({"message": "Show not found"}), 404

    # Check if there are enough available seats
    if showe.available_seats < num_tickets:
        return jsonify({"message": "Insufficient available seats"}), 400

    # Create a new booking
    new_booking = booking(user_id=user_id, show_id=showe.id, num_tickets=num_tickets)
    db.session.add(new_booking)

    # Update the available seats for the show
    showe.available_seats -= num_tickets
    db.session.commit()

    return jsonify({"message": "Booking created successfully"}), 201
'''
'''
from flask import request, jsonify

@app.route('/check', methods=['GET', 'POST'])
def index():
    if request.method == "GET":
        return('index.html')
    elif request.method == "POST":
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        return jsonify({'email': email, 'password': password})
    
from flask import Flask, send_from_directory

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    return app.send_static_file('proj.html')

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'proj.html')

'''
'''
class ShowUpdaterResource(Resource):
    def put(self, show_id):
        # Get the show object by its ID
        new_show = show.query.get(show_id)

        # If the show is not found, return a 404 error
        if new_show is None:
            return {'message': f"Show with id {show_id} not found."}, 404

        # Get the new venue from the form data
        new_venue_id = request.form['venue_id']
        new_venue = venue.query.get(new_venue_id)

        # If the new venue is not found, return a 404 error
        if new_venue is None:
            return {'message': f"Venue with id {new_venue_id} not found."}, 404

        # Check if the requested number of seats is greater than the current capacity of the venue
        requested_seats = int(request.form['Available_seats'])
        if requested_seats > new_venue.current_capacity:
            return {'message': "The requested number of seats is greater than the current capacity of the venue."}, 400

        # Update the show object with the new data
        new_show.name = request.form['name']
        new_show.time = request.form['Time']
        new_show.available_seats = requested_seats
        new_show.rating = request.form['Ratings']
        new_show.tags = request.form['Tags']
        new_show.price = request.form['price']
        
        date_string = request.form['Date']
        date_object = datetime.strptime(date_string, '%Y-%m-%d').date()
        new_show.Date = date_object
        
        new_show.Synopsis = request.form['Synopsis']
        new_show.Description = request.form['Description']

        # Update the venue_id and adjust the venue's current_capacity
        old_venue = new_show.venue
        old_venue.current_capacity += new_show.available_seats  # release the old seats
        new_show.venue_id = new_venue.id
        new_venue.current_capacity -= requested_seats  # reserve the new seats

        # Commit the changes to the database
        db.session.commit()

        # Return the updated show object as a JSON object
        return jsonify({"show": new_show.to_dict()})

# Add the API resource for the show updater
api.add_resource(ShowUpdaterResource, '/api/show/update/<int:show_id>')'''


# Add bookings
'''
from flask_cors import cross_origin
#@cross_origin()
class BookingResource(Resource):
    @cross_origin()
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('venue_name', type=str, required=True)
        parser.add_argument('show_name', type=str, required=True)
        parser.add_argument('date', type=str, required=True)
        parser.add_argument('time', type=str, required=True)
        parser.add_argument('num_tickets', type=int, required=True)
        parser.add_argument('user_id', type=int, required=True)
        args = parser.parse_args()

        date = datetime.datetime.strptime(args['date'], "%Y-%m-%d").date()
        time = args['time']
        venue_name = args['venue_name']
        show_name = args['show_name']
        num_tickets = args['num_tickets']
        num_tickets = int(num_tickets)
        user_id = args['user_id']

        # Find the venue and show that match the given names, date, and time
        venue = venue.query.filter_by(name=venue_name).first()
        if venue is None:
            return {"message": "Venue not found"}, 404

        show = show.query.filter_by(name=show_name, venue_id=venue.id, Date=date, time=time).first()
        if show is None:
            return {"message": "Show not found"}, 404

        # Check if there are enough available seats
        if show.available_seats < num_tickets:
            return {"message": "Insufficient available seats"}, 400

        # Create a new booking
        new_booking = booking(user_id=user_id, show_id=show.id, num_tickets=num_tickets)
        db.session.add(new_booking)

        # Update the available seats for the show
        show.available_seats -= num_tickets
        db.session.commit()

        return {"message": "Booking created successfully", "booking": new_booking.to_dict()}, 201

api.add_resource(BookingResource, '/api/booking')
'''
'''class ShowUpdaterResource(Resource):
    def put(self, show_id):
        # Get the show object by its ID
        new_show = show.query.get(show_id)

        # If the show is not found, return a 404 error
        if new_show is None:
            return {'message': f"Show with id {show_id} not found."}, 404

        # Update the show object with the new data
        old_reserved_seats = new_show.available_seats
        new_show.name = request.form['name']
        new_show.time = request.form['Time']
        new_show.available_seats = request.form['Available_seats']
        new_show.rating = request.form['Ratings']
        new_show.tags = request.form['Tags']
        new_show.price = request.form['price']
        new_show.Date = request.form['Date']
        new_show.Synopsis = request.form['Synopsis']
        new_show.Description = request.form['Description']
        new_ven = new_show.venue
        new_show.venue_id = new_ven.id

        if int(old_reserved_seats) != int(request.form['Available_seats']):
            difference = int(old_reserved_seats) - int(request.form['Available_seats'])
            new_ven.current_capacity = new_ven.current_capacity + difference

        # Commit the changes to the database
        db.session.commit()

        # Return the updated show object as a JSON object
        return jsonify({"show": new_show.to_dict()})

# Add the API resource for the show updater
api.add_resource(ShowUpdaterResource, '/api/show/update/<int:show_id>')'''
from datetime import datetime
'''
class ShowUpdaterResource(Resource):
    def put(self, show_id):
        # Get the show object by its ID
        new_show = show.query.get(show_id)

        # If the show is not found, return a 404 error
        if new_show is None:
            return {'message': f"Show with id {show_id} not found."}, 404

        # Update the show object with the new data
        old_reserved_seats = new_show.available_seats
        new_show.name = request.form['name']
        new_show.time = request.form['Time']
        new_show.available_seats = request.form['Available_seats']
        new_show.rating = request.form['Ratings']
        new_show.tags = request.form['Tags']
        new_show.price = request.form['price']
        
        date_string = request.form['Date']
        date_object = datetime.strptime(date_string, '%Y-%m-%d').date()
        new_show.Date = date_object
        
        new_show.Synopsis = request.form['Synopsis']
        new_show.Description = request.form['Description']
        new_ven = new_show.venue
        new_show.venue_id = new_ven.id

        if int(old_reserved_seats) != int(request.form['Available_seats']):
            difference = int(old_reserved_seats) - int(request.form['Available_seats'])
            new_ven.current_capacity = new_ven.current_capacity + difference

        # Commit the changes to the database
        db.session.commit()

        # Return the updated show object as a JSON object
        return jsonify({"show": new_show.to_dict()})

# Add the API resource for the show updater
api.add_resource(ShowUpdaterResource, '/api/show/update/<int:show_id>')'''
