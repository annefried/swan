/* 
 * Copyright (C) SWAN (Saar Web-based ANotation system) contributors. All rights reserved.
 * Licensed under the GPLv2 License. See LICENSE in the project root for license information.
 */
package de.unisaarland.swan.tokenization.model;

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
