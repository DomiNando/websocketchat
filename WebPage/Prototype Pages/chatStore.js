/*global Stapes */
'use strict';

var ChatStore = Stapes.subclass({
    constructor: function() {
        if (!localStorage in window) {
            console.log("We can't save this in your browser!!");
            console.log('Probably IE.');
        }
    },

    load: function () {
        var result = window.localStorage['emergency-chat'];

        return result ? JSON.parse(result) : {};
    },

    save: function(data) {
         while (data.length > 10) {
            data.splice(0,1);
        }

         window.localStorage['emergency-chat'] = JSON.stringify(data);
    }
});