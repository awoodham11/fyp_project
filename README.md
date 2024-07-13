To get the code running you must have the following installed:

In general:
Python 3.10.10, 
Node v18.14.2, 
PostgreSQL 14.2, 
pipenv version 2023.2.18,
npm 9.4.0

In frontend folder install:
@babel/plugin-proposal-private-property-in-object@7.21.11
@babel/preset-env@7.24.3
@fortawesome/fontawesome-svg-core@6.5.0
@fortawesome/free-regular-svg-icons@6.5.0
@fortawesome/free-solid-svg-icons@6.5.0
@fortawesome/react-fontawesome@0.2.0
@react-google-maps/api@2.19.3
@testing-library/jest-dom@6.4.2
@testing-library/react@14.2.2
@testing-library/user-event@13.5.0
axios@1.6.2
babel-jest@29.7.0
jest@29.7.0
jwt-decode@4.0.0
leaflet@1.9.4
moment@2.30.1
react-bootstrap@2.9.1
react-burger-menu@3.0.9
react-dom@18.2.0
react-leaflet@4.2.1
react-router-dom@6.19.0
react-scripts@5.0.1
react-test-renderer@18.2.0
react-toastify@9.1.3
react@18.2.0
tailwindcss@3.4.1
universal-cookie@6.1.1
use-history@1.4.1
web-vitals@2.1.4

In backend folder and in pipenv shell install:
asgiref==3.6.0
certifi==2022.12.7
distlib==0.3.6
Django==4.1.7
djangorestframework==3.14.0
filelock==3.9.0
pipenv==2023.2.18
platformdirs==3.0.0
python-dotenv==1.0.0
pytz==2022.7.1
six==1.16.0
sqlparse==0.4.3
virtualenv==20.20.0
virtualenv-clone==0.5.7

You must import the following in Django:
psycopg2-binary, 
django-cors-headers, 
djangorestframework, 
requests, 
Pillow, (can use "pip install" command to install these)

To access the psql shell in linux enter the following commands:
sudo su postgres,
psql

To access the psql shell in windows enter the following commands:
psql -U postgres

To create the postgres Database you must be in the folder 'axw169', the postgres server must be running and you must be in the psql shell as the user postgres and you must enter the following commands:

CREATE ROLE fyp_dev2 WITH CREATEDB LOGIN PASSWORD 'password'; 
CREATE DATABASE fyp_usersdb2 WITH OWNER fyp_dev2;


To access the database directly in postgres you enter the following command: 
psql -h localhost -p 5432 -U fyp_dev2 fyp_usersdb2;

To set up the PostgreSQL Database with Django, you must have the following setting in the Django settings.py file:
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': "fyp_usersdb2",  
        'USER': "fyp_dev2", 
        'PASSWORD': "password", 
        'HOST': "localhost", 
        'PORT': "5432", 
    }
}


To start the Django server, you must be in a linux environment and be in the folder 'axw169', you must then run the following commands:

cd backend, 
pipenv shell, 
sudo service postgresql start (may not need to do this in windows as server automatically runs), 
python manage.py runserver

You must run 'python manage.py migrate' and 'python manage.py makemigrations' before the first run of the system. Should do this just before entering command 'python manage.py runserver'

To start the react server, you must be in the folder 'axw169', you must run the following commands:

cd frontend, 
npm start

The Google Maps API key can be found here: AIzaSyA398smOp0rx5hhahTvaM3S0S6fNZQnR6Y







