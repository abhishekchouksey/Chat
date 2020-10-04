$(function(){
  var FADE_TIME = 150; // ms
  var TYPING_TIMER_LENGTH = 400; // ms
  var COLORS = [
    '#e21400', '#91580f', '#f8a700', '#f78b00',
    '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
    '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
  ];

    // Initialize variables
    var $window = $(window);
    var $usernameInput = $('.usernamefield'); // Input for username
    var $messages = $('.messages'); // Messages area
    var $inputMessage = $('.inputMessage'); // Input message input box
  
    var $loginPage = $('.login.page'); // The login page
    var $chatPage = $('.chat.page'); // The chatroom page
  
    // Prompt for setting a username
    var username;
    var connected = false;
    var typing = false;
    var lastTypingTime;
    var $currentInput = $usernameInput.focus();

  var socket = io();

  var username;
  var connected = false;
  var lastTypingTime;
  var $currentInput = $('.usernamefield').focus();

  // outline functions
  const setUserName = ()=>{
    username = $('.usernamefield').val().trim();
    if(username){
      $(".login.page").fadeOut();
      $('.chat.page').show();
      $(".login.page").off('click');
      $currentInput = $('.inputMessage').focus();
    }

    socket.emit('add user', username);
  }

  const sendMessage = () =>{
    var message = $inputMessage.val();
    if(message && connected){
        $inputMessage.val('');
        addChatMessage({username: username, message : message});
        socket.emit('new message', message);
    }
  }

  const addChatMessage = (data, options) =>{
    
    options = options || {};

    var userNameDiv = $('<span class="username" />' ).text(data.username).css('color', getUsernameColor(data.username));
    var messageBodyDiv = $('<span class="messageBody" />' ).text(data.message);
    var messageDiv = $('<li class="message"/>').data('username', data.username).append(userNameDiv, messageBodyDiv);

    addMessageElement(messageDiv, options);

  }

  // Gets the color of a username through our hash function
  function getUsernameColor (username) {
    // Compute hash code
    var hash = 7;
    for (var i = 0; i < username.length; i++) {
       hash = username.charCodeAt(i) + (hash << 5) - hash;
    }
    // Calculate color
    var index = Math.abs(hash % COLORS.length);
    return COLORS[index];
  }

  function addMessageElement(element, options){
    var $el = $(element);
    if(!options){ 
      options = {}
    }

    if(options.prepend){
      $messages.prepend($el);
    }else{
      $messages.append($el);
    }
  }



  // events emiited by server

  socket.on('login', (data)=> {
    connected = true;
    console.log(data);
  })

  socket.on('user joined', (data)=> {
    console.log(data);
  })
  socket.on('new message', (data)=>{
    console.log(data);
    addChatMessage(data);
  });

  $(window).keydown(function(e){
    if (!(e.ctrlKey || e.metaKey || e.altKey)) {
      $currentInput.focus();
    }
    if(e.which === 13){
      if(username){
        sendMessage();
        // socket.emit('stop typing');
      }else{
        setUserName();
      }
    }

  });

})();