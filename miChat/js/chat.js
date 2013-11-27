/*global ChatController, $, jQuery*/
var chat;

$(function() {
  'use strict';
  var server = 'http://eaa.ece.uprm.edu:3500/chat';
  var options = null;

  chat = new ChatController(server, options);
});