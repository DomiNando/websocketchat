/*global ChatController, $*/
'use strict';
var host = 'http://websocket-chat-c9-erreh.c9.io'; //nombre del servidor de Marvin cuando se haga la integracion
var server = host + '/chat';
var options = null;

var chat = new ChatController(server, options);
