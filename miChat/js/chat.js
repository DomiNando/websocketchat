/*global ChatController, $*/
$('document').ready(function() {
  'use strict';
  var server = 'http://eaa.ece.uprm.edu:3500/chat';
  var options = null;

  var chat = new ChatController(server, options);
});