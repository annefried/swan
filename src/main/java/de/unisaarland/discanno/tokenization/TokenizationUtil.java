/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package de.unisaarland.discanno.tokenization;

import de.unisaarland.discanno.tokenization.model.Line;
import de.unisaarland.discanno.tokenization.model.Token;
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
    
    public static List<Line> tokenize(final String str) {
        
        StringReader reader = new StringReader(str);
        
        // The passed options prevent tokenizing '(' into '-LRB-' etc.
        // http://nlp.stanford.edu/nlp/javadoc/javanlp/edu/stanford/nlp/process/PTBTokenizer.html
        PTBTokenizer<CoreLabel> ptbt = new PTBTokenizer<>(
                                        reader,
                                        new CoreLabelTokenFactory(),
                                        "ptb3Escaping=false,normalizeParentheses=false,normalizeOtherBrackets=false");

        Line line = new Line();
        
        List<Line> lines = new ArrayList<>();
        lines.add(line);
        Token lastToken = createToken(0, 0, "");
        
        while (ptbt.hasNext()) {
            CoreLabel label = ptbt.next();
            Token token = createToken(label.beginPosition(), label.endPosition(), label.word());
            
            String subStr = str.substring(lastToken.getEnd(), token.getStart());
            
            int newLineCount = lineAppeared(subStr);
            if (newLineCount == 1) {
                line = new Line();
                lines.add(line);
            } else if (newLineCount > 1) {
                List<Line> newLines = processSubString(line, subStr);
                lines.addAll(newLines);
                line = lines.get(lines.size() - 1); // set current line to the last one
            } else if (!subStr.equals("")) { // not equal first line
                Token wsToken = createToken(lastToken.getEnd(), token.getStart(), subStr);
                line.addTokens(wsToken);
            }
            
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
    
    /**
     * PTBTokenizer ignores all whitespaces. (Maybe there is an option to
     * tokenize whitespaces as well? Could not find anything). Therefore the
     * tokenization of whitespaces has to be manually done. processSubString
     * checks the given substring on new lines, if so create a new line, if not
     * create a token and add it to the current line.
     * 
     * @param currLine
     * @param str
     * @return 
     */
    private static List<Line> processSubString(Line currLine, String str) {
        
        List<Line> lines = new ArrayList<>();
        Matcher m = pattern.matcher(str);
        
        for (int i = 1; i <= str.length(); i++) {
            int start = i - 1;
            m.region(start, i);
            if (m.find()) {
                currLine = new Line();
                lines.add(currLine);
            } else {
                Token wsToken = createToken(start, i, str.substring(start, i));
                currLine.addTokens(wsToken);
            }
        }
        
        return lines;
    }
    
    /**
     * Returns the number of new lines.
     * 
     * @param subStr
     * @return 
     */
    private static int lineAppeared(String subStr) {
        Matcher m = pattern.matcher(subStr);
        
        int i = 0;
        for (; m.find(); i++);
        
        return i;
    }
    
}
