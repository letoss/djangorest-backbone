define(function (require) {
    'use strict';
    var Backbone = require('backbone');

    var oldSync = Backbone.sync;
    Backbone.sync = function (method, model, options) {
        options.beforeSend = function (xhr) {
            xhr.setRequestHeader('X-CSRFToken', window.csrf_token);
        };
        return oldSync(method, model, options);
    };

    /**
    * Return data.results if it exists
    * Assigne the pagination attributes to the collection
    */
    Backbone.Collection.prototype.parse = function( data ) {
        this.count = data.count;
        this.next = data.next;
        this.previous = data.previous;
        return data && data.results || data;
    };

    /**
    * Method to retrieve the next page in the pagination and maintain the other filters.
    */
    Backbone.Collection.prototype.getNextPage = function () {
        if (!this.next) {
                return null;
            }
        var filters = this.next.split('?')[1];
        return this.fetch({data: filters});
    };

    /**
    * Method to retrieve the previous page in the pagination and maintain the other filters.
    */
    Backbone.Collection.prototype.getPreviousPage = function () {
        if (!this.previous) {
                return null;
            }
        var filters = this.previous.split('?')[1];
        return this.fetch({data: filters});
    };
});
