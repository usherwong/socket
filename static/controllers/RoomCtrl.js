sApp.controller('RoomCtrl',function($scope,socket){
	$scope.messages = [];
	socket.emit('getAllMessages');
	socket.on('allMessages',function(messages){//debug
		$scope.messages = messages;
	})
	socket.on('messageAdded',function(message){
		$scope.messages.push(message);
	})
})
