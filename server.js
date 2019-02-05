// Imports
const fs = require('fs');
const https = require('https');
const express = require('express');
const socketio = require('socket.io');

// Config
const config = {
  ports: {
    https: 1337
  },
  ssl: {
    key: 'sslcert/key.pem',
    cert: 'sslcert/cert.pem'
  },
  ids: {
    min: 1001,
    max: 9999
  }
}

// Setting up certs
const privateKey  = fs.readFileSync(config.ssl.key, 'utf8');
const certificate = fs.readFileSync(config.ssl.cert, 'utf8');
const credentials = {key: privateKey, cert: certificate};
// Express init
const app = express();
// Server init
const httpsServer = https.createServer(credentials, app);
const io = socketio(httpsServer);

// Other vars stored in memory
let ids = [];

const addNewUserId = function() {
  let id = Math.floor(Math.random() * (config.ids.max - config.ids.min) + config.ids.min);

  // I think this could technically freeze the server up if we run out of ids
  // However, it's just a heroku app and no need to account for infinite scalability
  if(!ids.includes(id)) {
    ids.push(id);
    return id;
  } else {
    return addNewUserId();
  }
}

// Watching for socket requests
io.on('connection', function (socket) {
  // Send id and current active ids to user
  console.log('socket:connection');
  socket.id = addNewUserId();
  socket.emit('connected', {
    id: socket.id,
    users: ids
  });
  // Also send update to everybody else...
  io.emit('users:add', socket.id);

  socket.on('message:new', function (message) {
    console.log('socket:message:new', message);

    io.emit('message:new', {
      text: message, 
      user: socket.id
    });
  });

  socket.on('disconnect', function() {
    console.log('socket:disconnect');
    // Remove the ID...
    ids = ids.filter((id) => (id !== socket.id));

    // Send out remove for clients to update too... 
    // I could just send out a new list each time it changes, kind of like how React manages it's DOM, but adding/removing is more efficient in this case
    io.emit('users:remove', socket.id);
 });
});

// Enabling listening
httpsServer.listen(config.ports.https);
console.log('Listening...');