var express = require('express')
var app = express();
var port = process.env.PORT || 3000;
var Controllers = require('./controllers');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');

app.use(bodyParser())
app.use(cookieParser())
app.use(session({
	secret: 'technode',
	cookie:{
		maxAge: 60 * 1000 * 60
	}
}))

app.use(express.static(__dirname + '/static'))

var io = require('socket.io').listen(app.listen(port))

var messages = [];

io.sockets.on('connection',function(socket){
	socket.on('getAllMessages',function(){
		socket.emit('allMessages',messages);
	});
	socket.on('createMessage',function(message){
		messages.push(message);
		io.sockets.emit('messageAdded',message)
	});
})

app.get('/api/validate',function(req,res){
	_userId = req.session._userId;
	if(_userId){
		Controllers.User.findUserById(_userId,function(err,user){
			if(err){
				res.json(401,{msg: err});
			}else{
				res.json(user)
			}
		})
	}else{
		res.json(401,null)
	}
})

app.post('/api/login',function(req,res){
	email = req.body.email;
	if(email){
		Controllers.User.findByEmailOrCreate(email,function(err,user){
			if(err){
				res.json(500,{msg: err});
			}else{
				req.session._userId = user._id;
				res.json(user);
			}
		})
	}else{
		res.json(403)
	}
})

app.get('/api/logout',function(req,res){
	req.session._userId = null;
	res.json(401)
})

app.use(function(req,res){
	res.sendfile('./static/index.html')
})

console.log('TechNode is on port ' + port + '!')