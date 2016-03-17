/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package de.unisaarland.discanno.tokenization.model;

import java.util.ArrayList;
import java.util.List;

/**
 *
 * @author Timo Guehring
 */
public class Line {
    
    private List<Token> tokens = new ArrayList<>();


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
