/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
'use strict';

function replaceAll(str, find, replace) {
    return str.split(find).join(replace);
}

/**
 *
 * @param {type} xml The XML to be parsed
 * @param {type} tab A boolean if tabs should be used
 * @returns {String} The parsed JSON as String
 */
function xml2json(xml, tab) {
    var X = {
        toObj: function (xml) {
            var o = {};
            if (xml.nodeType == 1) {   // element node ...
                if (xml.attributes.length)   // element with attributes ...
                    for (var i = 0; i < xml.attributes.length; i++)
                        o[xml.attributes[i].nodeName] = (xml.attributes[i].nodeValue || "").toString();
                if (xml.firstChild) { // element has child nodes ..
                    var textChild = 0, cdataChild = 0, hasElementChild = false;
                    for (var n = xml.firstChild; n; n = n.nextSibling) {
                        if (n.nodeType == 1)
                            hasElementChild = true;
                        else if (n.nodeType == 3 && n.nodeValue.match(/[^ \f\n\r\t\v]/))
                            textChild++; // non-whitespace text
                        else if (n.nodeType == 4)
                            cdataChild++; // cdata section node
                    }
                    if (hasElementChild) {
                        if (textChild < 2 && cdataChild < 2) { // structured element with evtl. a single text or/and cdata node ...
                            X.removeWhite(xml);
                            for (var n = xml.firstChild; n; n = n.nextSibling) {
                                if (n.nodeType == 3)  // text node
                                    o["#text"] = X.escape(n.nodeValue);
                                else if (n.nodeType == 4)  // cdata node
                                    o["#cdata"] = X.escape(n.nodeValue);
                                else if (o[n.nodeName]) {  // multiple occurence of element ...
                                    if (o[n.nodeName] instanceof Array)
                                        o[n.nodeName][o[n.nodeName].length] = X.toObj(n);
                                    else
                                        o[n.nodeName] = [o[n.nodeName], X.toObj(n)];
                                } else  // first occurence of element ...
                                    o[n.nodeName] = X.toObj(n);
                            }
                        } else { // mixed content
                            if (!xml.attributes.length)
                                o = X.escape(X.innerXml(xml));
                            else
                                o["#text"] = X.escape(X.innerXml(xml));
                        }
                    } else if (textChild) { // pure text
                        if (!xml.attributes.length)
                            o = X.escape(X.innerXml(xml));
                        else
                            o["#text"] = X.escape(X.innerXml(xml));
                    } else if (cdataChild) { // cdata
                        if (cdataChild > 1)
                            o = X.escape(X.innerXml(xml));
                        else
                            for (var n = xml.firstChild; n; n = n.nextSibling)
                                o["#cdata"] = X.escape(n.nodeValue);
                    }
                }
                if (!xml.attributes.length && !xml.firstChild)
                    o = null;
            } else if (xml.nodeType == 9) { // document.node
                o = X.toObj(xml.documentElement);
            } else
                alert("unhandled node type: " + xml.nodeType);
            return o;
        },
        toJson: function (o, name, ind) {
            if (name !== "root"
                    && name !== "visElement"
                    && name !== "label"
                    && name !== "spanType"
                    && name !== "labelSet"
                    && name !== "linkType"
                    && name !== "option")

                var json = name ? ("\"" + name + "\"") : "";
            else {
                name = undefined;
                var json = "";
            }
            if (o instanceof Array) {
                for (var i = 0, n = o.length; i < n; i++) {
                    o[i] = X.toJson(o[i], "", ind + "\t");
                }
                json += (name ? ":[" : "") + (o.length > 0 ? ("\n" + ind + "\t" + o.join(",\n" + ind + "\t") + "\n" + ind) : o.join("")) + (name ? "]" : "");
            } else if (o === null) {
                json += (name && ":") + "[]";
            } else if (typeof (o) === "object") {
                var arr = [];
                for (var m in o) {
                    arr[arr.length] = X.toJson(o[m], m, ind + "\t");
                }
                if (name === undefined) {
                    json += ind + "\t" + arr.join(",\n" + ind + "\t") + "\n";
                } else if (name === "labels"
                            || name === "visElements"
                            || name === "linkLabels"
                            || name === "appliesToSpanTypes"
                            || name === "linkTypes"
                            || name === "spanTypes"
                            || name === "labelSets") {

                    json += ":[{" + ("\n" + ind + "\t" + ((arr.length === 1) ? arr[0] : arr.join("},{\n" + ind + "\t")) + "\n" + ind) + "}]";
                } else if (name === "options") {
                    json += ":[" + ("\n" + ind + "\t" + ((arr.length === 1) ? arr[0] : arr.join("},{\n" + ind + "\t")) + "\n" + ind) + "]";
                } else if (name === "startSpanType"
                            || name === "endSpanType") {

                    if (arr.length !== 1) {
                        throw "xml2json: startSpanType or endSpanType attribute not valid.";
                    }
                    json += ": {" + ("\n" + ind + "\t" + arr[0]  + "\n" + ind) + "}";
                } else if (name !== "labels"
                            && name !== "visElements"
                            && name !== "linkLabels"
                            && name !== "appliesToSpanTypes"
                            && name !== "linkTypes"
                            && name !== "spanTypes"
                            && name !== "labelSets"
                            && name !== "options") {

                    json += (name ? ":" : "{") + ("\n" + ind + "\t" + arr.join(",\n" + ind + "\t") + "\n" + ind) + (name ? "" : "}");
                } else {

                    json += (name ? ":" : "{") + ("[\n" + ind + "\t" + arr.join(",\n" + ind + "\t") + "]\n" + ind) + (name ? "" : "}");
                }
            } else if (typeof (o) === "string") {
                if (name === undefined) {
                    json += "\"" + o.toString() + "\"";
                } else {
                    json += (name && ":") + "\"" + o.toString() + "\"";
                }
            } else {
                json += (name && ":") + o.toString();
            }
            
            return json;
        },
        innerXml: function (node) {
            var s = "";
            if ("innerHTML" in node)
                s = node.innerHTML;
            else {
                var asXml = function (n) {
                    var s = "";
                    if (n.nodeType == 1) {
                        s += "<" + n.nodeName;
                        for (var i = 0; i < n.attributes.length; i++)
                            s += " " + n.attributes[i].nodeName + "=\"" + (n.attributes[i].nodeValue || "").toString() + "\"";
                        if (n.firstChild) {
                            s += ">";
                            for (var c = n.firstChild; c; c = c.nextSibling)
                                s += asXml(c);
                            s += "</" + n.nodeName + ">";
                        } else
                            s += "/>";
                    } else if (n.nodeType == 3)
                        s += n.nodeValue;
                    else if (n.nodeType == 4)
                        s += "<![CDATA[" + n.nodeValue + "]]>";
                    return s;
                };
                for (var c = node.firstChild; c; c = c.nextSibling)
                    s += asXml(c);
            }
            return s;
        },
        escape: function (txt) {
            return txt.replace(/[\\]/g, "\\\\")
                    .replace(/[\"]/g, '\\"')
                    .replace(/[\n]/g, '\\n')
                    .replace(/[\r]/g, '\\r');
        },
        removeWhite: function (e) {
            e.normalize();
            for (var n = e.firstChild; n; ) {
                if (n.nodeType == 3) {  // text node
                    if (!n.nodeValue.match(/[^ \f\n\r\t\v]/)) { // pure whitespace text node
                        var nxt = n.nextSibling;
                        e.removeChild(n);
                        n = nxt;
                    } else
                        n = n.nextSibling;
                } else if (n.nodeType == 1) {  // element node
                    X.removeWhite(n);
                    n = n.nextSibling;
                } else                      // any other node
                    n = n.nextSibling;
            }
            return e;
        }
    };
    if (xml.nodeType == 9) // document node
        xml = xml.documentElement;
    var json = X.toJson(X.toObj(X.removeWhite(xml)), xml.nodeName, "\t");

    json = "{\n" + tab + (tab ? json.replace(/\t/g, tab) : json.replace(/\t|\n/g, "")) + "\n}";
    json = replaceAll(json, "[{{", "[{");
    json = replaceAll(json, "}}]", "}]");

    return json;
}