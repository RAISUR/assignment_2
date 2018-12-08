var http = require('http');
var express = require('express');
var app = express();
var server = http.Server(app);
var bodyParser = require('body-parser');
var mongoose = require("mongoose");
var io = require('socket.io')(server);


var db_url = "mongodb://"+process.env.IP+":27017";

mongoose.connect(db_url+"/chats");
mongoose.connection.on('error', function(error){
  console.log('Could not connect to MongoDB');
});

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


app.get('/', function(request,response){
    response.render('index.ejs', {
        title: "Home"
    });
});


io.on('connection', function(socket){
  console.log('A user connected');
  socket.on('chat message', function(msg){
    //console.log(msg);
    io.emit('chat message', msg);
  });
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

require('./routes/user-routes.js')(app);
require('./routes/chatroom-routes.js')(app);


server.listen(process.env.PORT, process.env.IP, function(){
    console.log('Server running');
});