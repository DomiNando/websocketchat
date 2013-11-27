(function () {
  /*global Stapes */
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

      this._db.setItem('emergency-chat', JSON.stringify(data));
    }
  });
})();