## Creating envirnoment
python -m venv venv
## activating envirnoment 
source venv/bin/activate

## install requirements packages
pip install -r requirements.tx

# Migrations
1. python manage.py makemigrations apis
2. python manage.py migrate --run-syncdb
3. python manage.py makemigrations
5. python manage.py migrate


## Routes

- api/auth/register/ [name='user-registration']
- api/auth/login/ [name='user-login']
- api/auth/logout/ [name='user-logout']
- api/clr/create [name='add-clr']
- api/clr/update [name='update-clr']
- api/shipment/create [name='shipment']
- api/container/create [name='container']
- api/tracker/create [name='tracker']
- api/uses [name='users']
admin/

## browse APIs in web
1. http://127.0.0.1:8000/api/auth/register/
2. http://127.0.0.1:8000/api/clr/create
3. http://127.0.0.1:8000/api/shipment/create
4. http://127.0.0.1:8000/api/container/create
5. http://127.0.0.1:8000/api/tracker/create

