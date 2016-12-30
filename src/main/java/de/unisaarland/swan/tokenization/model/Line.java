/* 
 * Copyright (C) SWAN (Saar Web-based ANotation system) contributors. All rights reserved.
 * Licensed under the GPLv2 License. See LICENSE in the project root for license information.
 */
package de.unisaarland.swan.tokenization.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.ArrayList;
import java.util.List;

/**
 *
 * @author Timo Guehring
 */
public class Line {

    @JsonIgnore
    private int lineLength;

    private List<Token> tokens = new ArrayList<>();

    @JsonProperty
    public int getLineLength() {
        int length = 0;
        for (Token t : tokens) {
			length += t.getEnd() - t.getStart();
        }

        return length;
    }

    public List<Token> getTokens() {
        return tokens;
    }

    public void setTokens(List<Token> tokens) {
        this.tokens = tokens;
    }

    public void addTokens(Token token) {
        this.tokens.add(token);
    }

}
