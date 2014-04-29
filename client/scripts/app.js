
var app = {};
  app.roomNames = [];

  app.friends = {};

  app.currentRoom = 'room';

  app.addRoom = function(roomName){

    $(".room_input").val("");

    app.currentRoom=roomName;

    if(app.roomNames.indexOf(roomName) === -1){
      app.roomNames.push(roomName);
    }

    console.log(app.roomNames, app.currentRoom);
  };

  app.init = function(){

    $(document).ready(function(){
      app.fetch();
      setInterval(function(){ app.fetch();}, 2000);

      $("body").on('click', '.chatButton', function(e){
        e.preventDefault();
        // e.stopPropagation();
        var user = window.location.search.split("=")[1];
        var text = $(".message_input").val();


        if (text !==""){

          var message = {
            'username': user,
            'text': text,
            'roomName': app.currentRoom
          };
          app.send(message);

        } else {
          alert("Please enter a message");
        }


      });

      $(".message_input").on('keypress', function(e){
        if(e.keyCode === 13){
          e.preventDefault();
          var user = window.location.search.split("=")[1];
          var text = $(".message_input").val();
          var chatRoom = "chat room";

          if (text !==""){

            var message = {
              'username': user,
              'text': text,
              'roomName': app.currentRoom
            };
            app.send(message);

          } else {
            alert("Please enter a message");
          }
        }
      });


      $("body").on('click', ".roomButton", function(e){
        e.preventDefault();
        // e.stopPropagation();
        // debugger;

        var room = $(".room_input").val();

        if (room !==""){
          app.addRoom(room);
        } else {
          alert("Please enter a room name");
        }

      });

      $(".room_input").keypress(function(e){
        if(e.keyCode === 13){
          e.preventDefault();
          var room = $(".room_input").val();
          if (room !==""){
            app.addRoom(room);
          } else {
            alert("Please enter a room name");
          }
        }
      });


      $("body").on("click", ".userName", function(){
        console.log($(this));
        var name = $(this).text();
        console.log(app.friends, name);
        app.friends[name] = true;
      })

    });
  };

  app.addMessage = function(obj){

      var userName = obj.username;
      var messageText= obj.text;
      // var time = $.timeago(obj.createdAt);
      var time = obj.createdAt;


      $("#chats").prepend("<div class='message'></div>");
      $(".message").first().append("<div class='userName'></div>");
      $(".userName").first().text(userName);


      $(".message").first().append("<div class='time'></div>");
      $(".time").first().text(time);
      $(".message").first().append("<div class='message_text'></div>");
      $(".message_text").first().text(messageText);

      if (app.friends[userName]){
        $(".message_text").first().addClass("friend");
      }
  };

  app.clearMessages = function() {
    $("#chats").empty();
  };

  app.fetch = function(){

    $.ajax({
      url: app.server,
      type: 'GET',
      data: {
        order: '-createdAt',
        limit: 10 },
      contentType: 'application/json',
      success: function (data) {
        app.clearMessages();
        if (app.currentRoom === 'room'){
          _.each(data.results, function(obj){
            app.addMessage(obj);
          });
        } else {
          _.each(data.results, function(obj){
            if (obj.roomName === app.currentRoom){
              app.addMessage(obj);
            }
          });
        }
      },

      error: function (data) {
        console.error('chatterbox: Failed to fetch messages');
      }
    });
  };

  app.send = function(message){

    $(".message_input").val("");


    $.ajax({
      url: app.server,
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

  app.server = 'https://api.parse.com/1/classes/chatterbox';


  app.init();
