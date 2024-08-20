## ReChat

ReChat - RealTime Chat Application built with React & Laravel

### How to Setup

First clone the repo
```
git clone https://github.com/irtiza90/ReChat
cd ReChat
```

#### Installation process:

#### Prerequisites:

- php 8.2+
- node.js (npm)
- composer
- redis server
- [pusher credentials](https://pusher.com/laravel/)

This app was created in **php8.2**, with **laravel 11**, and has not been tested for lower versions.

now installing the dependencies:
```
composer install
npm install

# react dependencies
cd re-chat-client
npm install
```

Get your pusher app credentials then paste then in both .env files (/.env, /re-chat-client/.env)

### Starting the App
(open separate terminals for each command here)
```
php artisan serve
php artisan queue:work redis
redis-server
```
Starting react server
```
cd re-chat-client
npm start
```


### TODO's

[ ] - store messages in temp buffer(client-site), to prevent message loss and retry sending
