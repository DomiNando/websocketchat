var setCookie = function(c_name, value, exdays) {
  var exdate = new Date();
  exdate.setDate(exdate.getDate() + exdays);
  var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" +
    exdate.toUTCString());
  document.cookie = c_name + "=" + c_value;
}

var getCookie = function(c_name) {
  var c_value = document.cookie;
  var c_start = c_value.indexOf(" " + c_name + "=");
  if (c_start == -1) {
    c_start = c_value.indexOf(c_name + "=");
  }
  if (c_start == -1) {
    c_value = null;
  } else {
    c_start = c_value.indexOf("=", c_start) + 1;
    var c_end = c_value.indexOf(";", c_start);
    if (c_end == -1) {
      c_end = c_value.length;
    }
    c_value = unescape(c_value.substring(c_start, c_end));
  }
  return c_value;
}

var cookie_set = function(cookie_name) {
  var cookie = getCookie(cookie_name);
  if (cookie != null && cookie != '') {
    return true;
  } else {
    return false;
  }
}

$(function () {
  'use strict';
  var window_options = 'menubar=no, locaiton=yes, resizable=no,  scrollbars=yes, status=no, toolbar=no, width=360, height= 640, toolbar=no';

  if (!cookie_set('chatWindow')) {
    setCookie('chatWindow', '', 365);
    var chatWindow = window.open('../Pages/chat.html', 'EmergencyChatPage',
    window_options);
    console.log('new cookie set');
  } else {
    console.log('nothing set');
  }
});