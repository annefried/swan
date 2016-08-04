/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
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
