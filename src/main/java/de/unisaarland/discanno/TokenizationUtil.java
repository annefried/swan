/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package de.unisaarland.discanno;

import de.unisaarland.discanno.entities.Document;
import de.unisaarland.discanno.entities.Line;
import de.unisaarland.discanno.entities.Token;
import edu.stanford.nlp.ling.CoreLabel;
import edu.stanford.nlp.process.CoreLabelTokenFactory;
import edu.stanford.nlp.process.PTBTokenizer;
import java.io.StringReader;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 *
 * @author Timo Guehring
 */
public class TokenizationUtil {
    
    private static Pattern pattern = Pattern.compile("\r\n|\r|\n");
    
    public static List<Line> tokenize(final Document doc) {
        
        final String str = doc.getText();
        StringReader reader = new StringReader(str);
        PTBTokenizer<CoreLabel> ptbt = new PTBTokenizer<>(reader, new CoreLabelTokenFactory(), "");
        
        Line line = new Line();
        line.setNumber(0);
        line.setDocument(doc);
        
        List<Line> lines = new ArrayList<>();
        lines.add(line);
        Token lastToken = createToken(0, 0, "");
        
        while (ptbt.hasNext()) {
            CoreLabel label = ptbt.next();
            Token token = createToken(label.beginPosition(), label.endPosition(), label.word());
            
            int newLineCount = lineAppeared(token, lastToken, str);
            while (newLineCount > 0) {
                line = new Line();
                line.setNumber(lines.size());
                line.setDocument(doc);
                lines.add(line);
                newLineCount--;
            }
            
            token.setLine(line);
            lastToken = token;
            line.addTokens(token);
        }
        
        return lines;
    }
    
    private static Token createToken(int start, int end, String text) {
        Token token = new Token();
        token.setStart(start);
        token.setEnd(end);
        token.setText(text);
        return token;
    }
    
    private static int lineAppeared(Token newToken, Token lastToken, String str) {
        String subStr = str.substring(lastToken.getEnd(), newToken.getStart());
        Matcher m = pattern.matcher(subStr);
        
        int i = 0;
        for (; m.find(); i++);
        
        return i;
    }
    
}
