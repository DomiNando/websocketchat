/*global ChatController, $, jQuery*/
if(!$) {
  $ = jQuery || function(handler) {
    document.onload = function () {
      if (document.readyState === 'complete' && hanlder) {
        handler();
      }
    }
  };
}

$(function() {
  'use strict';
  var server = 'http://eaa.ece.uprm.edu:3500/chat';
  var options = null;

  var chat = new ChatController(server, options);
});