/*global ChatController, $, jQuery*/
var chat;

<<<<<<< HEAD
//Creates a new chatControlled and appends the server to it
=======
>>>>>>> 41a1d980455d1e35ddd4448ac6a9c659bbd21e8d
$(function() {
  'use strict';
  var server = 'http://eaa.ece.uprm.edu:3500/chat';
  var options = null;

  chat = new ChatController(server, options);
});