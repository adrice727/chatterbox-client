
var app = {};

  app.init = function(){

    $(document).ready(function(){
      app.fetch();
      setInterval(function(){ app.fetch();}, 2000);

      $(".button").on('click', function(){ app.send();});
    });
  };

  app.displayMessages = function(messages){

    $(".message_list").empty();

    _.each( messages.results, function(obj) {

      var userName = obj.username;
      var messageText= obj.text;
      var time = $.timeago(obj.createdAt);


      $(".message_list").prepend("<div class='message'></div>");
      $(".message").first().append("<div class='userName'></div>");
      $(".userName").first().text(userName);
      $(".message").first().append("<div class='time'></div>");
      $(".time").first().text(time);
      $(".message").first().append("<div class='message_text'></div>");
      $(".message_text").first().text(messageText);

    });
  };

  app.fetch = function(){

    $.ajax({
      url: 'https://api.parse.com/1/classes/chatterbox',
      type: 'GET',
      data: {
        order: '-createdAt',
        limit: 10 },
      contentType: 'application/json',
      success: function (data) {
        app.displayMessages(data);
      },
      error: function (data) {
        console.error('chatterbox: Failed to fetch messages');
      }
    });
  };

  app.send = function(){

    var user = window.location.search.split("=")[1];
    var text = $(".message_input").val();
    var chatRoom = "chat room";

    var message = {
      'username': user,
      'text': text,
      'roomname': chatRoom
    };


    $.ajax({
      url: 'https://api.parse.com/1/classes/chatterbox',
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        console.error('chatterbox: Failed to send message');
      }
    });
  };


  app.init();
