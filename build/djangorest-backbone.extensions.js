define(function (require) {
    'use strict';
    var Backbone = require('backbone');
    var _ = require('underscore');

    Backbone.DRF = {
        idAttribute: 'id'
    };

    Backbone.DRF.Model = Backbone.Model.extend({
        idAttribute: Backbone.DRF.idAttribute,

        genericRelationField: '',
        genericRelationMapping: {},

        parse: function (data, options) {
            /**
             * Check if there is a generic related field defined. If that's
             * the case, insert the related field ID as a new model attribute.
             */
            if (!_.isEmpty(this.genericRelationField)) {
                var relatedField = data[this.genericRelationField];
                if (!_.isUndefined(relatedField)) {
                    relatedField = addSlash(relatedField);
                    var keyAndValue = getKeyAndValue(relatedField);

                    // Check if there is a mapping defined at model level.
                    // Use the one defined there if it's defined. Use the last
                    // part of the URL path otherwise.
                    var fieldName = !_.isEmpty(this.genericRelationMapping)
                        ? this.genericRelationMapping[keyAndValue.key]
                        : keyAndValue.key;
                    // value = id.
                    data[fieldName] = keyAndValue.value;
                }
            }
            return Backbone.Model.prototype.parse.call(this, data, options);
        },

        save: function (data, options) {
            if (!_.isEmpty(this.genericRelationField)) {
                // Remove from the model fields the inserted field.
                var relatedField = this.get(this.genericRelationField);
                relatedField = addSlash(relatedField);

                var keyAndValue = getKeyAndValue(relatedField);

                var fieldName = !_.isEmpty(this.genericRelationMapping)
                    ? this.genericRelationMapping[keyAndValue.key]
                    : keyAndValue.key;

                delete this.attributes[fieldName];
            }

            return Backbone.Model.prototype.save.call(this, data, options);
        },

        url: function () {
            // Models should define urlRoot. if that is not the case,
            // this method will try to get the base URL from the collection.
            var url = _.result(this, 'urlRoot') ||
                (this.collection && _.result(this.collection, 'url' ));

            if (!this.isNew()) {
                url = addSlash(url) + this.id;
            }

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

    var getKeyAndValue = function (url) {
        var values = url.split('/');
        // Pop the last item since it's an empty string.
        values.pop();
        // The last value is the URL ID.
        var value = values.pop();
        // The last part of the URL path.
        var key = values.pop();
        return {
            key: key,
            value: value,

        };
    };
});
