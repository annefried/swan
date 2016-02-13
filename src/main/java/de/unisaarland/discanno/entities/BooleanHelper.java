/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package de.unisaarland.discanno.entities;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * This is a helper class for booleans for the REST services. Booleans cannot be
 * deserialized as a parameter in a HTTP body. So this helper class is used
 * instead.
 *
 * @author Timo Guehring
 */
public class BooleanHelper {
    
    @JsonProperty("value")
    private boolean value;

    
    public boolean isValue() {
        return value;
    }

    public void setValue(boolean value) {
        this.value = value;
    }

}
