## ReChat

ReChat - RealTime Chat Application built with React & FastApi

### How to Setup

First clone the repo
```
git clone https://github.com/irtiza90/ReChat
cd ReChat
```

#### Installation process:

#### Prerequisites:

- python 3.12+
- node.js (npm)

##### Installing the dependencies:
```
py -m venv ./venv
./.venv/Scripts/activate.ps1
py -m pip install -r requirements.txt

# react dependencies
cd rechat-client
npm install
```

### Starting the App
(open separate terminals for each command here)
```
py main.py
```
Starting react server
```
cd rechat-client
npm start
```


### TODO's

[ ] - store messages in temp buffer(client-site), to prevent message loss and retry sending
