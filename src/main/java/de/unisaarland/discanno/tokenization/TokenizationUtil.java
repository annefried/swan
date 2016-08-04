package de.unisaarland.discanno.tokenization;

import de.unisaarland.discanno.tokenization.model.Line;
import de.unisaarland.discanno.tokenization.model.Token;
import edu.stanford.nlp.ling.CoreLabel;
import edu.stanford.nlp.pipeline.TokenizerAnnotator;
import edu.stanford.nlp.process.Tokenizer;

import java.io.StringReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.regex.Pattern;

public class TokenizationUtil {

    private static final Pattern LINEBREAK_PATTERN = Pattern.compile("\r\n|\r|\n"); // TODO refactor
    private static final String OPTIONS = "ptb3Escaping=false,normalizeParentheses=false,normalizeOtherBrackets=false";
    private static final boolean VERBOSE = false;

    public static List<Line> tokenize(String str, final String language) {
        Token wsToken;
        Token wsToken2;
        String lineInSubstr;
        Tokenizer<CoreLabel> tokenizer = getTokenizer(str, language);

        Line line = new Line();
        ArrayList<Line> lines = new ArrayList<>();
        int docIdx = 0;

        while (tokenizer.hasNext()) {
            CoreLabel label = tokenizer.next();

            while (label.beginPosition() > docIdx) {
                String subStr = str.substring(docIdx, label.beginPosition());
                String[] linesInSubstr = subStr.split("\\r?\\n", -1);
                if (linesInSubstr.length == 1) {
                    if (!subStr.contains("\n")) {
                        wsToken = TokenizationUtil.createToken(docIdx, label.beginPosition(), str.substring(docIdx, label.beginPosition()));
                        line.addTokens(wsToken);
                        docIdx = label.beginPosition();
                    } else {
                        lineInSubstr = linesInSubstr[0];
                        wsToken2 = TokenizationUtil.createToken(docIdx, docIdx + lineInSubstr.length(), lineInSubstr);
                        line.addTokens(wsToken2);
                        lines.add(line);
                        line = new Line();

                        docIdx = docIdx + lineInSubstr.length();
                        if (str.substring(docIdx).startsWith("\r")) {
                            ++docIdx;
                        }
                        if (str.substring(docIdx).startsWith("\n")) {
                            ++docIdx;
                        }
                    }
                } else {
                    for (int i = 0; i < linesInSubstr.length - 1; ++i) {
                        String lineInSubstr2 = linesInSubstr[i];
                        if (lineInSubstr2.length() > 0) {
                            Token wsToken3 = TokenizationUtil.createToken(docIdx, docIdx + lineInSubstr2.length(), lineInSubstr2);
                            line.addTokens(wsToken3);
                            docIdx += lineInSubstr2.length();
                        }
                        if (str.substring(docIdx).startsWith("\r")) {
                            ++docIdx;
                        }
                        if (str.substring(docIdx).startsWith("\n")) {
                            ++docIdx;
                        }

                        lines.add(line);
                        line = new Line();
                    }
                }
            }
            Token token = TokenizationUtil.createToken(label.beginPosition(), label.endPosition(), label.word());
            line.addTokens(token);
            docIdx = label.endPosition();
        }

        if (str.length() > docIdx) {
            String subStr = str.substring(docIdx);
            String[] linesInSubstr = subStr.split("\\r?\\n", -1);
            if (linesInSubstr.length == 1) {
                if (!subStr.contains("\n")) {
                    Token wsToken4 = TokenizationUtil.createToken(docIdx, str.length(), str.substring(docIdx));
                    line.addTokens(wsToken4);
                } else {
                    String lineInSubstr3 = linesInSubstr[0];
                    wsToken = TokenizationUtil.createToken(docIdx, docIdx + lineInSubstr3.length(), lineInSubstr3);
                    line.addTokens(wsToken);
                    lines.add(line);
                    line = new Line();
                }
            } else {
                for (int i = 0; i < linesInSubstr.length - 1; ++i) {
                    lineInSubstr = linesInSubstr[i];
                    if (lineInSubstr.length() > 0) {
                        wsToken2 = TokenizationUtil.createToken(docIdx, docIdx + lineInSubstr.length(), lineInSubstr);
                        line.addTokens(wsToken2);
                        docIdx += lineInSubstr.length();
                    }
                    if (str.substring(docIdx).startsWith("\r")) {
                        ++docIdx;
                    }
                    if (str.substring(docIdx).startsWith("\n")) {
                        ++docIdx;
                    }

                    lines.add(line);
                    line = new Line();
                }
            }
        }

        lines.add(line);
        return lines;
    }
    
    public static HashMap<String, HashMap<Integer, CoreLabel>> getTokenMap(String str, String language) {

        HashMap<Integer, CoreLabel> mapStart = new HashMap<>();
        HashMap<Integer, CoreLabel> mapEnd = new HashMap<>();
        HashMap<String, HashMap<Integer, CoreLabel>> maps = new HashMap<>();
        maps.put("start", mapStart);
        maps.put("end", mapEnd);

        Tokenizer<CoreLabel> tokenizer = getTokenizer(str, language);

        while (tokenizer.hasNext()) {
            CoreLabel label = tokenizer.next();
            mapStart.put(label.beginPosition(), label);
            mapEnd.put(label.endPosition(), label);
        }
        return maps;
    }
    
    private static Token createToken(final int start, final int end, final String text) {
        Token token = new Token();
        token.setStart(start);
        token.setEnd(end);
        token.setText(text);
        return token;
    }

    private static Tokenizer<CoreLabel> getTokenizer(String text, String language) {
        StringReader reader = new StringReader(text);
        TokenizerAnnotator tok = new TokenizerAnnotator(VERBOSE, language, OPTIONS);
        return tok.getTokenizer(reader);
    }

}
