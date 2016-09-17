/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
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
