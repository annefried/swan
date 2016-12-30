/*
 * Copyright (C) SWAN (Saar Web-based ANotation system) contributors. All rights reserved.
 * Licensed under the GPLv2 License. See LICENSE in the project root for license information.
 */
'use strict';

/**
 * Created by Timo Guehring on 05.07.16.
 */
angular
    .module('app')
    .service('UtilityService', function () {
        return  {
            /**
             * Deletes the id properties of a given list containing objects with id
             * properties.
             *
             * @param objects
             */
            deleteIdProperties: function (objects) {
                for (var i = 0; i < objects.length; i++) {
                    this.deleteIdProperty(objects[i]);
                }
            },

            /**
             * Deletes the id and @id property of a given object.
             *
             * @param obj
             */
            deleteIdProperty: function (obj) {
                delete obj.id;
                delete obj['@id'];
            },

            /**
             * Return a list containing only the name attributes of the passed objects.
             *
             * @param objects
             * @returns {Array}
             */
            getSimplifiedObjectList: function (objects) {
                var simpObjects = [];
                for (var i = 0; i < objects.length; i++) {
                    simpObjects.push(objects[i].name);
                }
                return simpObjects;
            }
        }
    });
