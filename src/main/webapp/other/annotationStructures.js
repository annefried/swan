/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
'use strict';

var AnnotationMode = {
    Everything: "Everything",
    Nothing: "Nothing"
};

//Represents a whole line in the text
function TextLine(start, end) {
    this.start = start;
    this.end = end;
    this.words = [];
}

//Represents a single text in the text
function TextWord(text, start, end) {
    this.text = text;
    this.start = start;
    this.end = end;
    this.annotatedBy = 0;
    this.lineIndex = 0;
    this.wordIndex = 0;

    this.setIndices = function (lineIndex, wordIndex) {
        this.lineIndex = lineIndex;
        this.wordIndex = wordIndex;
    };
}


var AnnoType = {
    Annotation: "Annotation",
    Target: "Target",
    Link: "Link"
};

//Base class for annotations, targets & links
function AnnotationObject(id, type, labels, text) {
    this.id = id;
    this.text = (text === undefined) ? "" : text;

    //this.activeLabels = {};
    this.selectableLabels = (labels === undefined) ? {} : labels;
    this.type = type;

    //Add a possible label that this object can be labelled with
    this.addSelectableLabel = function (labelSet) {
        if (labelSet !== undefined)
            this.selectableLabels[labelSet.id] = labelSet;
    };

    //Remove a possible label that this object can be labelled with
    this.removeSelectableLabel = function (labelSet) {
        if (labelSet !== undefined)
            delete this.selectableLabels[labelSet.id];
    };

    //Checks if this object has this label
    this.isLabeled = function (labelSet, label) {
        if (this.activeLabels !== undefined && this.selectableLabels[labelSet.id] !== undefined) {
            var labels = this.activeLabels[labelSet.id];

            if (labels !== undefined) {
                for (var i = 0; i < labels.length; i++) {
                    if (labels[i].setID === label.setID && labels[i].tag === label.tag) {
                        return true;
                    }
                }
            }
        }

        return false;
    };

    //Sets a label for this object. If this object already has this label, the label
    //is removed; added otherwise
    this.setLabel = function (labelSet, label) {
        if (labelSet == undefined || label == undefined) {
            throw "annotationStructure: labelSet or label undefined";
        }
        var set = this.selectableLabels[labelSet.id];

        //Check if this object can be labeled with the set
        if (set !== undefined) {

            if (this.activeLabels === undefined)
                this.activeLabels = {};

            if (this.activeLabels[set.id] === undefined)
                this.activeLabels[set.id] = [];

            //Check if the object already has this label
            //and remove it in that case
            var removed = this.removeLabel(labelSet, label);

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
    this.removeLabel = function (labelSet, label) {
        if (this.activeLabels !== undefined && this.selectableLabels[labelSet.id] !== undefined) {
            var labels = this.activeLabels[labelSet.id];

            if (labels !== undefined) {
                for (var i = 0; i < labels.length; i++) {
                    if (labels[i].tag === label.tag && labels[i].setID === label.setID) {
                        this.activeLabels[labelSet.id].splice(i, 1);
                        return true;
                    }
                }
            }
        }

        return false;
    };

    //Shorten the text representation of all the labels depending of the text length
    this.shortenLabels = function (textLength) {
        var t = "";
        var labels = [];

        for (var id in this.activeLabels) {
            var labelSet = this.activeLabels[id];

            for (var i = 0; i < labelSet.length; i++)
                labels.push(labelSet[i]);
        }

        if (labels.length > textLength) {
            for (var a = 0; a < textLength - 2; a++) {
                var letter = labels[a].tag[0];

                t += letter + " ";
            }

            t += "..";
        }
        //All labels can be displayed in some way
        else {
            //Compute space that each label has
            var space = Math.floor(textLength / labels.length);

            for (var j = 0; j < labels.length; j++) {
                var tag = labels[j].tag;

                t += tag.substring(0, space) + " ";
            }

        }

        return t;
    };
}

//Represents a whole annotation
function Annotation(color, id, sType) {
    if (sType === undefined)
        AnnotationObject.call(this, id, AnnoType.Annotation);
    else
        AnnotationObject.call(this, id, AnnoType.Annotation, sType.selectableLabels);

    this.sType = sType;
    this.color = color;
    this.words = [];
    this.notSure = false;

    this.addWord = function (word) {
        word.annotatedBy++;
        this.words.push(word);
        this.text += word.text;
    };

    this.addWordBefore = function (word) {
        word.annotatedBy++;
        var words = [];
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
    this.onDelete = function () {
        for (var i = 0; i < this.words.length; i++)
            this.words[i].annotatedBy--;
    };

    // Removes the last word
    this.removeLastWord = function () {
        if (this.words.length > 1) {
            var word = this.words.pop();
            word.annotatedBy--;
            var start = this.text.lastIndexOf(word.text);
            this.text = this.text.substring(0, start);
        }
        return word;
    };

    this.removeFirstWord = function () {
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
    this.resetWords = function () {
        this.words = [];
        this.text = "";
    };

    this.setSpanType = function (spanType) {
        this.sType = spanType;
        this.selectableLabels = spanType.selectableLabels;
        this.activeLabels = {};
    };

    this.getSpanType = function () {
        return this.sType;
    };

    //Return the text index where this annotation starts
    this.startIndex = function () {
        if (this.words.length > 0)
            return this.words[0].start;
    };

    //Returns the text index where this annotation ends
    this.endIndex = function () {
        if (this.words.length > 0)
            return this.words[this.words.length - 1].end;
    };

    this.toString = function (maxSize) {
        if (this.text.length > maxSize)
            return "'" + this.text.substring(0, maxSize - 1) + " ...'";

        return this.text;
    };

    //Split the text represantion in several lines. The size of each line is
    //capped by maxSize
    this.toStringLines = function (maxSize) {
        return [this.toString(maxSize)];
    };
}

//Represents a (directed) link between two annotations
function AnnotationLink(id, source, target, labels) {
    var t = AnnoType.Link;
    AnnotationObject.call(this, id, t, labels);

    this.source = source;
    this.target = target;

    this.toString = function () {
        var text = "";

        for (var id in this.activeLabels) {
            var label = this.activeLabels[id];
            if (label.length > 0)
                text += label[0].tag + " ";
        }

        return (text === "") ? "click here to add label" : text;
    };

    this.toStringLines = function (maxSize) {
        return ["Source ", this.source.toString(maxSize / 2), " => ", "Target ", this.target.toString(maxSize / 2)];
    };
}

//Represents all annotations as graph with all the annotations as nodes
//and all their relations as links
function AnnotationGraph() {
    this.nodes = [];
    this.links = [];
}

//Represents a color that is associated with a
//specific annotation type
function AnnotationColor(name, num, shades, back, line) {
    this.name = name;
    this.num = num;
    this.fill = function () {
        var mod = this.num % shades.length;
        if (this.num !== 0 && mod === 0) {
            mod = (this.num + 1) % shades.length; // TODO better solution needed
        }
        return shades[mod];
    };
	this.shades = shades;
    this.back = back;
    this.line = (line === undefined) ? back : line;
}

//Represents the label of an annotation
function AnnotationLabel(id, tag, options, setID) {
    this.id = id;
    this.tag = tag;
    this.options = options;
    this.setID = setID;

    this.toString = function (maxSize) {
        if (this.tag.length <= maxSize) {
            return this.tag;
        }

        return this.tag.substring(0, maxSize - 3) + "...";
    };

    this.toStringWithOptionsString = function (maxSize) {
        var text = this.tag;
        // If the label text is already too long
        if (text.length >= maxSize) {
            // If only one option is defined, only take the first character
            if (this.options.length === 1) {
                text = text.substring(0, maxSize - 3) + "..." + "[" + this.options[0][0] + "]";
            }
            // If more options are defined, take the first character of the first option
            // and short the others with "..."
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

//Represents the formatted version of a word in the text
function formTextWord(word, element, x, y, lX, lY, width, height) {
    this.word = word;
    this.element = element;

    //Positions on the screen
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = (height === undefined) ? 0 : height;
    this.maxAnnotations = 0;
    this.annoGrid = {};

    //Coordinates of words in the lines. E.g. 3rd text in 2nd row => lX = 2; lY = 1
    this.lX = lX;
    this.lY = lY;

    this.id = 0.5 * (this.lX + this.lY) * (this.lX + this.lY + 1) + this.lY;

    this.clearAnnotationGrid = function () {
        this.annoGrid = {};
    };
}

//Represents the formatted version of an annotation in the text
function formAnnotation(annotation, isTarget) {
    this.annotation = annotation;
    this.annotationBoxes = [];
    this.isTarget = (isTarget !== undefined) ? isTarget : false;

    this.addBox = function (annotationBox) {
        annotationBox.isTarget = this.isTarget;
        this.annotationBoxes.push(annotationBox);
    };

    this.clearAnnotationGrids = function () {
        for (var i = 0; i < this.annotationBoxes.length; i++)
            this.annotationBoxes[i].clearAnnotationGrids();
    };

    this.startLine = function () {
        if (this.annotationBoxes.length > 0) {
            var annotationBox = this.annotationBoxes[0];

            if (annotationBox.formWords.length > 0) {
                var formWord = annotationBox.formWords[0];
                return formWord.lY;
            }
        }
    };

    this.endLine = function () {
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
function AnnotationBox(annotation) {
    this.annotation = annotation;
    this.height = 0;
    this.formWords = [];
    this.isTarget = false;

    this.addWord = function (word) {
        this.formWords.push(word);
    };

    this.clearAnnotationGrids = function () {
        for (var i = 0; i < this.formWords.length; i++)
            this.formWords[i].clearAnnotationGrid();
    };
}

//Represents the prefix of each line in the formatted text
function linePrefix(prefix, height, line) {
    this.prefix = prefix;
    this.height = height;
    this.line = line;
}
