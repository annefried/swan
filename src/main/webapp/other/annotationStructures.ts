/*
 * Copyright (C) SWAN (Saar Web-based ANotation system) contributors. All rights reserved.
 * Licensed under the GPLv2 License. See LICENSE in the project root for license information.
 */
'use strict';

class AnnotationMode {
    static Everything: string = "Everything";
    static Nothing: string = "Nothing";
};

//Represents a whole line in the text
class TextLine {
    start: number;
    end: number;
    words: Array<TextWord>;

    constructor(start: number, end: number) {
        this.start = start;
        this.end = end;
        this.words = [];
    }
}

//Represents a single text in the text
class TextWord {
    text: string;
    start: number;
    end: number;
    annotatedBy: number;
    lineIndex: number;
    wordIndex: number;

    constructor(text: string, start: number, end: number) {
        this.text = text;
        this.start = start;
        this.end = end;
        this.annotatedBy = 0;
        this.lineIndex = 0;
        this.wordIndex = 0;
    }

    public setIndices(lineIndex: number, wordIndex: number) {
        this.lineIndex = lineIndex;
        this.wordIndex = wordIndex;
    };
}

class AnnoType {
    static Annotation: string = "Annotation";
    static Target: string = "Target";
    static Link: string = "Link";
};

//Base class for annotations, targets & links
class AnnotationObject {
    id: number;
    type: AnnoType;
    text: string;
    selectableLabels: { [id: number]: AnnotationLabelSet };
    activeLabels: { [id: number]: Array<AnnotationLabel>};

    constructor(id: number, type: AnnoType, labels: { [id: number]: AnnotationLabelSet } = {}, text: string = "") {
        this.id = id;
        this.type = type;
        this.selectableLabels = labels;
        this.text = text;
        this.activeLabels = {};
    }

    //Add a possible label that this object can be labelled with
    public addSelectableLabel(labelSet: AnnotationLabelSet) {
        if (labelSet !== undefined)
            this.selectableLabels[labelSet.id] = labelSet
    };

    //Remove a possible label that this object can be labelled with
    public removeSelectableLabel(labelSet: AnnotationLabelSet) {
        if (labelSet !== undefined) {
            delete this.selectableLabels[labelSet.id];
        }
    };

    //Checks if this object has this label
    public isLabeled(labelSet: AnnotationLabelSet, label: AnnotationLabel) {
        if (this.selectableLabels[labelSet.id] !== undefined) {
            var labels: Array<AnnotationLabel> = this.activeLabels[labelSet.id];

            if (labels !== undefined) {
                for (var i = 0; i < labels.length; i++) {
                    if (labels[i].setID === label.setID && labels[i].name === label.name) {
                        return true;
                    }
                }
            }
        }
        return false;
    };

    //Sets a label for this object. If this object already has this label, the label
    //is removed; added otherwise
    public setLabel(labelSet: AnnotationLabelSet, label: AnnotationLabel) {
        if (labelSet == undefined || label == undefined) {
            throw "annotationStructure: labelSet or label undefined";
        }
        var set: AnnotationLabelSet = this.selectableLabels[labelSet.id];

        //Check if this object can be labeled with the set
        if (set !== undefined) {

            if (this.activeLabels[set.id] === undefined)
                this.activeLabels[set.id] = [];

            //Check if the object already has this label
            //and remove it in that case
            var removed: boolean = this.removeLabel(labelSet, label);

            if (set.exclusive) {
                this.activeLabels[set.id] = [];
                if (!removed) {
                    this.activeLabels[set.id].push(label);
                } else {
                    delete this.activeLabels[set.id];
                }
            } else {
                if (!removed) {
                    this.activeLabels[set.id].push(label);
                } else {
                    if (this.activeLabels[set.id].length === 0)
                        delete this.activeLabels[set.id];
                }

            }
        }
    };

    //Removes a label from this objects
    public removeLabel(labelSet: AnnotationLabelSet, label: AnnotationLabel): boolean {
        if (this.selectableLabels[labelSet.id] !== undefined) {
            var labels: Array<AnnotationLabel> = this.activeLabels[labelSet.id];

            if (labels !== undefined) {
                for (var i = 0; i < labels.length; i++) {
                    if (labels[i].name === label.name && labels[i].setID === label.setID) {
                        this.activeLabels[labelSet.id].splice(i, 1);
                        return true;
                    }
                }
            }
        }

        return false;
    };

    //Shorten and return the text representation of all the labels depending of the text length
    public shortenLabels(textLength: number): string {
        var t = "";
        var labels: Array<AnnotationLabel> = [];

        for (var id in this.activeLabels) {
            var labelSet: Array<AnnotationLabel> = this.activeLabels[id];

            for (var i = 0; i < labelSet.length; i++)
                labels.push(labelSet[i]);
        }

        if (labels.length > textLength) {
            for (var a = 0; a < textLength - 2; a++) {
                var letter = labels[a].name[0];

                t += letter + " ";
            }

            t += "..";
        }
        //All labels can be displayed in some way
        else {
            //Compute space that each label has
            var space = Math.floor(textLength / labels.length);

            for (var j = 0; j < labels.length; j++) {
                var name = labels[j].name;

                t += name.substring(0, space) + " ";
            }

        }

        return t;
    };

}

//Represents a whole annotation
class Annotation extends AnnotationObject{
    sType: AnnotationSpanType;
    color: AnnotationColor;
    words: Array<TextWord>;
    notSure: boolean;

    constructor(color: AnnotationColor, id: number, sType: AnnotationSpanType = null) {
        if (sType === null) {
            super(id, AnnoType.Annotation);
        } else {
            super(id, AnnoType.Annotation, sType.selectableLabels);
        }
        this.text = "";
        this.sType = sType;
        this.color = color;
        this.words = [];
        this.notSure = false;
    }

    public addWord(word: TextWord) {
        word.annotatedBy++;
        this.words.push(word);
        this.text += word.text;
    };

    public addWordBefore(word: TextWord) {
        word.annotatedBy++;
        var words: Array<TextWord> = [];
        this.text = "";
        words.push(word);
        this.text += word.text;
        for (var i = 0; i < this.words.length; i++) {
            words.push(this.words[i]);
            this.text += this.words[i].text;
        }
        this.words = words;
    };


    //Should be called when the annotation is being removed
    public onDelete() {
        for (var i = 0; i < this.words.length; i++)
            this.words[i].annotatedBy--;
    };

    //Removes the last word
    public removeLastWord(): TextWord {
        if (this.words.length > 1) {
            var word = this.words.pop();
            word.annotatedBy--;
            var start = this.text.lastIndexOf(word.text);
            this.text = this.text.substring(0, start);
        }
        return word;
    };

    public removeFirstWord(): TextWord {
        if (this.words.length > 1) {
            var word = this.words[0];
            var words = [];
            for (var i = 1; i < this.words.length; i++) {
                words.push(this.words[i]);
            }
            this.words = words;
            this.text = this.text.substring(word.text.length, this.text.length);
        }
        return word;
    };

    //Remove all words from this annotation
    public resetWords() {
        this.words = [];
        this.text = "";
    };

    public setSpanType(spanType: AnnotationSpanType) {
        this.sType = spanType;
        this.selectableLabels = spanType.selectableLabels;
        this.activeLabels = {};
    };

    public getSpanType(): AnnotationSpanType {
        return this.sType;
    };

    //Return the text index where this annotation starts
    public startIndex(): number {
        if (this.words.length > 0)
            return this.words[0].start;
    };

    //Returns the text index where this annotation ends
    public endIndex(): number {
        if (this.words.length > 0)
            return this.words[this.words.length - 1].end;
    };

    public toString(maxSize: number): string {
        if (this.text.length > maxSize)
            return "'" + this.text.substring(0, maxSize - 1) + " ...'";

        return this.text;
    };

    //Split the text represantion in several lines. The size of each line is
    //capped by maxSize
    public toStringLines(maxSize: number): Array<string> {
        return [this.toString(maxSize)];
    };
}

//Represents a (directed) link between two annotations
class AnnotationLink extends AnnotationObject {
    source: Annotation;
    target: Annotation;

    constructor(id: number, source: Annotation, target: Annotation, labels: { [id: number]: AnnotationLabelSet }) {
        super(id, AnnoType.Link, labels);
        this.source = source;
        this.target = target;
    }

    public toString(): string {
        var text = "";

        for (var id in this.activeLabels) {
            var label = this.activeLabels[id];
            if (label.length > 0)
                text += label[0].name + " ";
        }

        return (text === "") ? "click here to add label" : text;
    };

    public toStringLines(maxSize: number): Array<string> {
        return ["Source ", this.source.toString(maxSize / 2), " => ", "Target ", this.target.toString(maxSize / 2)];
    };
}

//Represents all annotations as graph with all the annotations as nodes
//and all their relations as links
class AnnotationGraph {
    nodes: Array<Annotation>;
    links: Array<AnnotationLink>;

    constructor() {
        this.nodes = [];
        this.links = [];
    }
}

//Represents a color that is associated with a
//specific annotation type
class AnnotationColor {
    name: string;
    num: number;
    shades: Array<string>;
    back: string;
    line: string;

    constructor(name: string, num: number, shades: Array<string>, back: string, line: string) {
        this.name = name;
        this.num = num;
        this.shades = shades;
        this.back = back;
        this.line = (line === undefined) ? back : line;
    }

    public fill(): string {
        var mod = this.num % this.shades.length;
        if (this.num !== 0 && mod === 0) {
            mod = (this.num + 1) % this.shades.length; //TODO better solution needed
        }
        return this.shades[mod];
    };
}

//Represents the label of an annotation (also for linkLabels)
class AnnotationLabel {
    id: number;
    name: string;
    options;
    setID: number;
    
    constructor(id: number, name: string, options, setID: number) {
        this.id = id;
        this.name = name;
        this.options = options;
        this.setID = setID;
    }

    public toString(maxSize: number): string {
        if (this.name.length <= maxSize) {
            return this.name;
        }

        return this.name.substring(0, maxSize - 3) + "...";
    };

    public toStringWithOptionsString(maxSize: number): string {
        var text = this.name;
        //If the label text is already too long
        if (text.length >= maxSize) {
            //If only one option is defined, only take the first character
            if (this.options.length === 1) {
                text = text.substring(0, maxSize - 3) + "..." + "[" + this.options[0][0] + "]";
            }
            //If more options are defined, take the first character of the first option
            //and short the others with "..."
            else {
                text = text.substring(0, maxSize - 3) + "..." + "[" + this.options[0][0] + ",...]";
            }
        } else {
            if (this.options.length > 0) {
                var optText = this.options.toString();
                if (text.length + optText.length >= maxSize) {
                    text += "[" + optText;
                    text = text.substring(0, maxSize - 3) + "...]";
                } else {
                    text += "[" + optText + "]";
                }
            }
        }

        return text;
    };
}

//Represents a LabelSet or LinkType
class AnnotationLabelSet {
    id: number;
    name: string;
    exclusive: boolean;
    labels: Array<AnnotationLabel>;

    constructor(id: number, name: string, exclusive: boolean, labels: Array<AnnotationLabel> = []) {
        this.id = id;
        this.name = name;
        this.exclusive = exclusive;
        this.labels = labels;
    }

    public addLabel(label: AnnotationLabel) {
        if (label === undefined) throw "LabelSet: label undefined";
        this.labels.push(label);
    };
}

//Represents a SpanType
class AnnotationSpanType {
    id: number;
    name: string;
    selectableLabels: { [id: number]: AnnotationLabelSet } = {};

    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }

    public addSelectableLabel(labelSet: AnnotationLabelSet) {
        if (labelSet !== undefined)
            this.selectableLabels[labelSet.id] = labelSet;
    };
}

//Represents the formatted version of a word in the text
class formTextWord {
    word: TextWord;
    element; //TODO typing
    
    //Positions on the screen
    x: number;
    y: number;
    width: number;
    height: number;
    maxAnnotations: number;
    annoGrid: {};

    //Coordinates of words in the lines. E.g. 3rd text in 2nd row => lX = 2; lY = 1
    lX: number;
    lY: number;

    id: number;

    constructor(word: TextWord, element, x: number, y: number, lX: number, lY: number, width: number, height: number) {
        this.word = word;
        this.element = element;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = (height === undefined) ? 0 : height;
        this.maxAnnotations = 0;
        this.annoGrid = {};
        this.lX = lX;
        this.lY = lY;
        this.id = 0.5 * (this.lX + this.lY) * (this.lX + this.lY + 1) + this.lY;
    }

    public clearAnnotationGrid() {
        this.annoGrid = {};
    };
}

//Represents the formatted version of an annotation in the text
class formAnnotation {
    annotation: Annotation;
    annotationBoxes: Array<AnnotationBox>;
    isTarget: boolean;

    constructor(annotation: Annotation, isTarget: boolean) {
        this.annotation = annotation;
        this.annotationBoxes = [];
        this.isTarget = (isTarget !== undefined) ? isTarget : false;
    }

    public addBox(annotationBox: AnnotationBox) {
        annotationBox.isTarget = this.isTarget;
        this.annotationBoxes.push(annotationBox);
    };

    public clearAnnotationGrids() {
        for (var i = 0; i < this.annotationBoxes.length; i++)
            this.annotationBoxes[i].clearAnnotationGrids();
    };

    public startLine(): number {
        if (this.annotationBoxes.length > 0) {
            var annotationBox = this.annotationBoxes[0];

            if (annotationBox.formWords.length > 0) {
                var formWord = annotationBox.formWords[0];
                return formWord.lY;
            }
        }
    };

    public endLine(): number {
        if (this.annotationBoxes.length > 0) {
            var annotationBox = this.annotationBoxes[this.annotationBoxes.length - 1];

            if (annotationBox.formWords.length > 0) {
                var formWord = annotationBox.formWords[0];
                return formWord.lY;
            }
        }
    };
}

//Represents the part of a formatted annotation of one line on the screen
class AnnotationBox {
    annotation: Annotation;
    height: number;
    formWords;
    isTarget: boolean;
    
    constructor(annotation) {
        this.annotation = annotation;
        this.height = 0;
        this.formWords = [];
        this.isTarget = false;
    }

    public addWord(word) {
        this.formWords.push(word);
    };

    public clearAnnotationGrids() {
        for (var i = 0; i < this.formWords.length; i++)
            this.formWords[i].clearAnnotationGrid();
    };
}

//Represents the prefix of each line in the formatted text
class linePrefix {
    prefix;
    height;
    line;

    constructor(prefix, height, line) {
        this.prefix = prefix;
        this.height = height;
        this.line = line;
    }
}
