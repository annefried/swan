/* 
 * Copyright (C) SWAN (Saar Web-based ANotation system) contributors. All rights reserved.
 * Licensed under the GPLv2 License. See LICENSE in the project root for license information.
 */
package de.unisaarland.swan.entities;

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
