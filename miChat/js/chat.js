/*global ChatController, $, jQuery*/

// this is incase jQuery hasn't used thed $ or jQuery doesn't exist.
(function () {
  if(!$) {
  $ = jQuery || function(handler) {
    document.onload = function() { pageLoad(handler) };
  };

  var pageLoad = function (handler) {
    if (document.readyState === 'complete' && hanlder) {
      handler();
    }
  }
}
})();

$(function() {
  'use strict';
  var server = 'http://eaa.ece.uprm.edu:3500/chat';
  var options = null;

  var chat = new ChatController(server, options);
});