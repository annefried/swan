package de.unisaarland.swan.tokenization;

import edu.stanford.nlp.process.Tokenizer;
import edu.stanford.nlp.process.CoreLabelTokenFactory;
import edu.stanford.nlp.ling.CoreLabel;

import java.util.List;
import java.util.ArrayList;

/**
 * Created by stefan on 08.08.16.
 */
public class CharacterwiseTokenizer implements Tokenizer<CoreLabel> {

    private String text;
    private int index;
    private CoreLabelTokenFactory factory;

    public CharacterwiseTokenizer(String txt, CoreLabelTokenFactory fact) {
        this.text = txt;
        this.index = 0;
        this.factory = fact;
    }

    public List<CoreLabel> tokenize() {
        ArrayList<CoreLabel> res = new ArrayList<>();

        int i = 0;
        while (i < text.length()) {
            int codePoint = text.codePointAt(i);
            int width = Character.charCount(codePoint);

            CoreLabel tok = factory.makeToken(text.substring(i, i+width), i, i+width);
            res.add(tok);
            i = i + width;
        }

        return res;
    }

    public boolean hasNext() {
        return index < text.length();
    }

    public CoreLabel next() {
        int codePoint = text.codePointAt(index);
        int width = Character.charCount(codePoint);

        String curText = text.substring(index, index+width);
        CoreLabel tok = factory.makeToken(curText, index, width);

        index = index + width;
        return tok;
    }

    public CoreLabel peek() {
        int codePoint = text.codePointAt(index);
        int width = Character.charCount(codePoint);

        String curText = text.substring(index, index+width);
        CoreLabel tok = factory.makeToken(curText, index, width);

        return tok;
    }

    public void remove() {
        // TODO (not necessary atm)
    }

}
