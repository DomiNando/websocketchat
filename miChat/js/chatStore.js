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

<<<<<<< HEAD
//Loads the chat information in the localStorage
=======
>>>>>>> 41a1d980455d1e35ddd4448ac6a9c659bbd21e8d
  load: function () {
    var result = this._db.getItem('emergency-chat');

    return result ? JSON.parse(result) : {};
  },

<<<<<<< HEAD
//Saves the message stack to the localStorage, always eliminating the 11th message +
=======
>>>>>>> 41a1d980455d1e35ddd4448ac6a9c659bbd21e8d
  save: function(data) {
    while (data.length > 10) {
      data.splice(0,1);
    }

    this.set(data);
  },

<<<<<<< HEAD
//Clears the chat data in the localStorage
=======
>>>>>>> 41a1d980455d1e35ddd4448ac6a9c659bbd21e8d
  clear: function() {
    this.set('{}');
  },

<<<<<<< HEAD
//Sets the chat data in the localStorage to the data parameter
=======
>>>>>>> 41a1d980455d1e35ddd4448ac6a9c659bbd21e8d
  set: function(data) {

    if (typeof data !== 'string' || typeof data === 'object') {
      data = JSON.stringify(data) || data.toString();
    }

    this._db.setItem('emergency-chat', data);
  }
});