var socket = io();

function scrollToBottom(){
  let message = $('#messages');
  let newMessage = message.children('li:last-child');

  let clientHeight = message.prop('clientHeight');
  let scrollTop = message.prop('scrollTop');
  let scrollHeight = message.prop('scrollHeight');
  let newMessageHeight = newMessage.innerHeight();
  let lastMessageHeight = newMessage.prev().innerHeight();

  if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight){
    //console.log('scroll down')
    message.scrollTop(clientHeight)
  }
}




socket.on('connect', function () {
  console.log('Connected to server');
  var params = jQuery.deparam(window.location.search)

  socket.emit('join', params, function(err){
    if(err){
      alert(err);
      window.location.href = '/';
    } else {
      if (location.href.includes('?')) { 
        history.pushState({}, null, location.href.split('.html?')[0]); 
        //window.history.pushState({}, document.title, window.location.pathname);
      }
    }
  });
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

socket.on('updateUserList', function(users){
  console.log(users);
  var ol = $('<ol></ol>');
  users.forEach(function (user) {
    ol.append($('<li></li>').text(user))
  });
  $('#users').html(ol)
})

socket.on('newMessage', function (message) {
  let formattedTime = moment(message.createdAt).format('h:mm a')
  let template = $('#message-template').html();
  let html = Mustache.render(template, {
    text: message.text,
    from: message.from,
    createdAt: formattedTime
  });

  $('#messages').append(html);
  scrollToBottom();
  // console.log('newMessage', message);
  // let formattedTime = moment(message.createdAt).format('h:mm a')
  // var li = jQuery('<li></li>');
  // li.text(`${message.from} ${formattedTime}: ${message.text}`);

  // jQuery('#messages').append(li);
});

socket.on('newLocationMessage', function (message) {
  let formattedTime = moment(message.createdAt).format('h:mm a')
  let template = $('#location-message-template').html();
  let html = Mustache.render(template, {
    url: message.url,
    from: message.from,
    createdAt: formattedTime
  });

  $('#messages').append(html);
  scrollToBottom();
});

jQuery('#message-form').on('submit', function (e) {
  e.preventDefault();

  let messageTextbox = $('[name=message]');

  socket.emit('createMessage', {
    text: messageTextbox.val()
  }, function () {
    messageTextbox.val('')
  });
});

var locationButton = jQuery('#send-location');
locationButton.on('click', function () {
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your browser.');
  }

  locationButton.attr('disabled', 'disabled').text('Sending location...') 

  navigator.geolocation.getCurrentPosition(function (position) {
    locationButton.removeAttr('disabled').text('Send location');
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, function () {
    locationButton.removeAttr('disabled').text('Send location');;
    alert('Unable to fetch location.');
  });
});
