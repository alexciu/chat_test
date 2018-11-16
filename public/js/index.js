
var socket = io();

socket.on('connect', function() {
    console.log('Conected to server.')
})

socket.on('disconnect', function() {
    console.log('Disconnected from server.')
})

socket.on('newMessage', function(newMessage) {
    console.log(`New message from ${newMessage.from}: ${newMessage.text} - ${newMessage.createAt}`)

    let li = $('<li></li>');
    li.text(`${newMessage.from}: ${newMessage.text} - ${newMessage.createAt}`);
    $('#messages').append(li);
})

$(document).ready(function(){

    $('#message-form').on('submit', function(e){
        e.preventDefault();

        socket.emit('createMessage', {
            from: 'User',
            text: $('[name=message]').val()
        }, function(){

        })
    }) 

})