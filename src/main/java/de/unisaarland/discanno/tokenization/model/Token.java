/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package de.unisaarland.discanno.tokenization.model;

/**
 *
 * @author Timo Guehring
 */
public class Token {
    
    private int startS;
    
    private int endS;
    
    private String text;

    
    public int getStart() {
        return startS;
    }

    public void setStart(int start) {
        this.startS = start;
    }

    public int getEnd() {
        return endS;
    }

    public void setEnd(int end) {
        this.endS = end;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }
    
}
