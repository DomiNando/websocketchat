/*global Stapes, $ */
'use strict';

var ChatStore = Stapes.subclass({
  constructor: function() {
    if (!localStorage in window) {
      console.log("We can't save this in your browser!!");
      console.log('Probably IE.');
    }
    this._db = window.localStorage;
  },

  load: function () {
    var result = this._db.getItem('emergency-chat');

    return result ? JSON.parse(result) : {};
  },

  save: function(data) {
    while (data.length > 10) {
      data.splice(0,1);
    }

    this.set(data);
  },

  clear: function() {
    this.set('{}');
  },

  set: function(data) {

    if (typeof data !== 'string' || typeof data === 'object') {
      data = JSON.stringify(data) || data.toString();
    }

    this._db.setItem('emergency-chat', data);
  }
});