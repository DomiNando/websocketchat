/*global ChatController, $, jQuery*/
var chat;

//Creates a new chatControlled and appends the server to it
$(function() {
  'use strict';
  var server = 'http://eaa.ece.uprm.edu:3500/chat';
  var options = null;

  chat = new ChatController(server, options);
});