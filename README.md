## Creating virtual envirnoment Linux Pakackage
```
sudo apt-get install python3-venv
```

## Creating envirnoment
```
python3 -m venv venv
```

## Activating envirnoment 
```
source venv/bin/activate
```

## install requirements packages
```
pip3 install -r requirements.txt 
```
# Migrations
```
1. python manage.py makemigrations apis
2. python manage.py migrate --run-syncdb 
3. python manage.py makemigrations 
5. python manage.py migrate 
```

# Start the application
```
python manage.py runserver
```

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

## Browse APIs in Web
1. http://127.0.0.1:8000/api/auth/register/
2. http://127.0.0.1:8000/api/clr/create
3. http://127.0.0.1:8000/api/shipment/create
4. http://127.0.0.1:8000/api/container/create
5. http://127.0.0.1:8000/api/tracker/create


curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - 
sudo apt install -y nodejs

sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d tracker.lachinshipping.com -d www.tracker.lachinshipping.com



sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab


## build
docker build -t tracker .

## run
docker run -p 8000:8000 tracker

CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--certfile", "fullchain.pem", "--keyfile", "privkey.pem", "apis.wsgi:application"]


<!-- openssl genrsa > privkey.pem
openssl req -new -x509 -key privkey.pem > fullchain.pem -->

# updat record on subdomain
A	tracker	ip

# network Firewall Policies
Allow	All	TCP	8000 backend tcp

# install node
sudo apt update
sudo apt install -y curl software-properties-common
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# copy db
docker cp 8c27dac8231f:/code/db.sqlite3 .


sudo docker run -it ubuntu bash
