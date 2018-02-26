define(function (require) {
    'use strict';
    var Backbone = require('backbone');

    Backbone.DRF = {};

    Backbone.DRF.Collection = Backbone.Collection.extend({
        parse: function (data) {
            /**
            *  Return data.results if it exists
            *  Assigne the pagination attributes to the collection
            */
            this.count = data.count;
            this.next = data.next;
            this.previous = data.previous;
            return data && data.results || data;
        },

        getNextPage: function () {
            /**
            *  Method to retrieve the next page in the pagination
            *  and maintain the other filters.
            */
            if (this.next) {
                var successful = function () {
                    return true;
                };
                var filters = this.next.split('?')[1];
                Backbone.listenTo(this, 'sync', successful);
                this.fetch({data: filters});
            }
        },

        getPreviousPage: function () {
            /**
            *  Method to retrieve the previous page in the
            *  pagination and maintain the other filters.
            */
            if (this.previous) {
                var successful = function () {
                    return true;
                };
                var filters = this.next.split('?')[1];
                Backbone.listenTo(this, 'sync', successful);
                this.fetch({data: filters});
            }
        }
    });
});
