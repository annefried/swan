package de.unisaarland.swan.tokenization;

import de.unisaarland.swan.tokenization.model.Line;
import de.unisaarland.swan.tokenization.model.Token;
import edu.stanford.nlp.ling.CoreLabel;
import edu.stanford.nlp.pipeline.TokenizerAnnotator;
import edu.stanford.nlp.process.Tokenizer;
import edu.stanford.nlp.process.CoreLabelTokenFactory;

import java.io.StringReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.regex.Pattern;

public class TokenizationUtil {

    private static final Pattern LINEBREAK_PATTERN = Pattern.compile("\r\n|\r|\n"); // TODO refactor
    private static final String OPTIONS = "ptb3Escaping=false,normalizeParentheses=false,normalizeOtherBrackets=false";
    private static final boolean VERBOSE = false;

    private static Tokenizer<CoreLabel> tokenizer;
    private static int docIdx; // Index of the first character in the input string which has not yet been processed
    private static Line currentLine;
    private static ArrayList<Line> lines;

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

    public static List<Line> tokenize(String str, final String language) {
        if (language.equals("Characterwise")) {
            return tokenizeCharacterwise(str);
        } else {
            return tokenizePTB(str, language);
        }
    }

    private static List<Line> tokenizeCharacterwise(String str) {
        Tokenizer<CoreLabel> tokenizer = getTokenizer(str, "Characterwise");
        Line line = new Line();
        ArrayList<Line> lines = new ArrayList<>();

        while (tokenizer.hasNext()) {
            CoreLabel label = tokenizer.next();
            if (label.value().equals("\n"))  {
                lines.add(line);
                line = new Line();
            } else {
                Token token = TokenizationUtil.createToken(label.beginPosition(), label.endPosition(), label.word());
                line.addTokens(token);
            }
        }
        lines.add(line);
        return lines;
    }

    private static List<Line> tokenizePTB(String str, final String language) {
        tokenizer = getTokenizer(str, language);
        lines = new ArrayList<>();
        currentLine = new Line();
        docIdx = 0;

        while (tokenizer.hasNext()) {
            readNextLabel(str);
        }

        if (str.length() > docIdx) { // In case there is still text after the last label
            finalizeText(str);
        }

        lines.add(currentLine);
        return lines;
    }

    private static void readNextLabel(String str) {
        CoreLabel label = tokenizer.next();

        if (label.beginPosition() > docIdx) {
            processGap(str, label);
        }
        assert label.beginPosition() <= docIdx;

        addTokenToCurrentLine(label.beginPosition(), label.endPosition(), label.word());
    }

    private static void processGap(String str, CoreLabel label) {
        String subStr = str.substring(docIdx, label.beginPosition());
        String[] linesInSubstr = subStr.split("\r?\n", -1);
        if (linesInSubstr.length == 1) {
            addTokenToCurrentLine(docIdx, label.beginPosition(), str.substring(docIdx, label.beginPosition()));
        } else {
            addLines(str, linesInSubstr);
        }
    }

    private static void finalizeText(String str) {
        String subStr = str.substring(docIdx);
        String[] linesInSubstr = subStr.split("\\r?\\n", -1);

        if (linesInSubstr.length == 1) {
            addTokenToCurrentLine(docIdx, str.length(), str.substring(docIdx));
        } else {
            addLines(str, linesInSubstr);
        }
    }

    private static void addLines(String str, String[] lines) {
        for (int i = 0; i < lines.length; i++) {
            String line = lines[i];
            if (line.length() > 0) {
                addTokenToCurrentLine(docIdx, docIdx + line.length(), line);
            }
            if (str.substring(docIdx).startsWith("\r")) {
                docIdx++;
            }
            if (str.substring(docIdx).startsWith("\n")) {
                docIdx++;
            }
            if (i < lines.length - 1)
            {
                TokenizationUtil.lines.add(currentLine);
                currentLine = new Line();
            }
        }
    }

    private static void addTokenToCurrentLine(int startPos, int endPos, String text) {
        Token token = TokenizationUtil.createToken(startPos, endPos, text);
        currentLine.addTokens(token);
        docIdx = endPos;
    }

    private static Token createToken(final int start, final int end, final String text) {
        Token token = new Token();
        token.setStart(start);
        token.setEnd(end);
        token.setText(text);
        return token;
    }

    private static Tokenizer<CoreLabel> getTokenizer(String text, String language) {
        if (language.equals("Characterwise")) {
            return new CharacterwiseTokenizer(text, new CoreLabelTokenFactory());
        } else {
            StringReader reader = new StringReader(text);
            TokenizerAnnotator tok = new TokenizerAnnotator(VERBOSE, language, OPTIONS);
            return tok.getTokenizer(reader);
        }
    }

}
