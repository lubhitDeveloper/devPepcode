let express = require('express');
let app = express();
let http = require('http').createServer(app);
let io = require('socket.io')(http);

app.use(express.static("public"));

let users=[];

app.get('/', (req, res) => {
  res.redirect("/index.html");
});

io.on('connection', function(socket){
  console.log(`${socket.id} connected`);

  socket.on("join-chat", function(name){
      socket.broadcast.emit("user-joined", name);
      users.push({id:socket.id, name});
  })

  socket.on("chat-send", function(userObj){
      socket.broadcast.emit("recieve-chat", userObj);
  })
  socket.on("disconnect", function(){
      let user= users.filter(function(userObj){
          return userObj.id == socket.id;
      })
      if(user){
        socket.broadcast.emit("leave", user[0].name);
      }

      users= users.filter(function(userObj){
          return userObj.id != socket.id;      
        })
  })

});

http.listen(3000, () => {
  console.log('listening on *:3000');
});