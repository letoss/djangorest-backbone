define(function (require) {
    'use strict';
    var Backbone = require('backbone');
    var _ = require('underscore');

    Backbone.DRF = {
        idAttribute: 'id'
    };

    Backbone.DRF.Model = Backbone.Model.extend({
        idAttribute: Backbone.DRF.idAttribute,

        url: function () {
            // Models should define urlRoot. if that is not the case,
            // this method will try to get the base URL from the collection.
            var url = _.result(this, 'urlRoot') ||
                (this.collection && _.result(this.collection, 'url' ));

            url = addSlash(url) + this.id;

            return addSlash(url);
        }
    });

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

        getNextPage: function (options) {
            /**
            *  Method to retrieve the next page in the pagination
            *  and maintain the other filters.
            */
            if (!this.next) {
                return null;
            }

            var opts = options || {};
            var filters = this.next.split('?')[1];
            opts.data = filters;
            return this.fetch(opts);
        },

        getPreviousPage: function (options) {
            /**
            *  Method to retrieve the previous page in the
            *  pagination and maintain the other filters.
            */
            if (!this.previous) {
                return null;
            }
            var opts = options || {};
            var filters = this.previous.split('?')[1];
            opts.data = filters;
            return this.fetch(opts);
        }
    });

    var addSlash = function (str) {
        return str + ((str.length > 0 && str.charAt(str.length - 1) === '/') ? '' : '/');
    };
});
