/* 
 * Copyright (C) SWAN (Saar Web-based ANotation system) contributors. All rights reserved.
 * Licensed under the GPLv2 License. See LICENSE in the project root for license information.
 */
package de.unisaarland.swan.export.model.uima;

import org.apache.uima.jcas.JCas; 
import org.apache.uima.jcas.JCasRegistry;
import org.apache.uima.jcas.cas.TOP_Type;

import org.apache.uima.jcas.cas.FSList;
import org.apache.uima.jcas.tcas.Annotation;


/** Annotation of one annotator.
 * Updated by JCasGen Thu Jul 07 15:25:41 CEST 2016
 * XML source: /local/workspace/sitent/DiscAnnoUima/typesystem/SwanTypesystem.xml
 * @generated */
public class SwanAnnotation extends Annotation {
  /** @generated
   * @ordered 
   */
  @SuppressWarnings ("hiding")
  public final static int typeIndexID = JCasRegistry.register(SwanAnnotation.class);
  /** @generated
   * @ordered 
   */
  @SuppressWarnings ("hiding")
  public final static int type = typeIndexID;
  /** @generated
   * @return index of the type  
   */
  @Override
  public              int getTypeIndexID() {return typeIndexID;}
 
  /** Never called.  Disable default constructor
   * @generated */
  protected SwanAnnotation() {/* intentionally empty block */}
    
  /** Internal - constructor used by generator 
   * @generated
   * @param addr low level Feature Structure reference
   * @param type the type of this Feature Structure 
   */
  public SwanAnnotation(int addr, TOP_Type type) {
    super(addr, type);
    readObject();
  }
  
  /** @generated
   * @param jcas JCas to which this Feature Structure belongs 
   */
  public SwanAnnotation(JCas jcas) {
    super(jcas);
    readObject();   
  } 

  /** @generated
   * @param jcas JCas to which this Feature Structure belongs
   * @param begin offset to the begin spot in the SofA
   * @param end offset to the end spot in the SofA 
  */  
  public SwanAnnotation(JCas jcas, int begin, int end) {
    super(jcas);
    setBegin(begin);
    setEnd(end);
    readObject();
  }   

  /** 
   * <!-- begin-user-doc -->
   * Write your own initialization here
   * <!-- end-user-doc -->
   *
   * @generated modifiable 
   */
  private void readObject() {/*default - does nothing empty block */}
     
 
    
  //*--------------*
  //* Feature: SpanType

  /** getter for SpanType - gets SpanType of the annotation
   * @generated
   * @return value of the feature 
   */
  public String getSpanType() {
    if (SwanAnnotation_Type.featOkTst && ((SwanAnnotation_Type)jcasType).casFeat_SpanType == null)
      jcasType.jcas.throwFeatMissing("SpanType", "de.unisaarland.swan.export.model.uima.SwanAnnotation");
    return jcasType.ll_cas.ll_getStringValue(addr, ((SwanAnnotation_Type)jcasType).casFeatCode_SpanType);}
    
  /** setter for SpanType - sets SpanType of the annotation 
   * @generated
   * @param v value to set into the feature 
   */
  public void setSpanType(String v) {
    if (SwanAnnotation_Type.featOkTst && ((SwanAnnotation_Type)jcasType).casFeat_SpanType == null)
      jcasType.jcas.throwFeatMissing("SpanType", "de.unisaarland.swan.export.model.uima.SwanAnnotation");
    jcasType.ll_cas.ll_setStringValue(addr, ((SwanAnnotation_Type)jcasType).casFeatCode_SpanType, v);}    
   
    
  //*--------------*
  //* Feature: AnnotatorId

  /** getter for AnnotatorId - gets ID of the annotator who created this annotation.
   * @generated
   * @return value of the feature 
   */
  public String getAnnotatorId() {
    if (SwanAnnotation_Type.featOkTst && ((SwanAnnotation_Type)jcasType).casFeat_AnnotatorId == null)
      jcasType.jcas.throwFeatMissing("AnnotatorId", "de.unisaarland.swan.export.model.uima.SwanAnnotation");
    return jcasType.ll_cas.ll_getStringValue(addr, ((SwanAnnotation_Type)jcasType).casFeatCode_AnnotatorId);}
    
  /** setter for AnnotatorId - sets ID of the annotator who created this annotation. 
   * @generated
   * @param v value to set into the feature 
   */
  public void setAnnotatorId(String v) {
    if (SwanAnnotation_Type.featOkTst && ((SwanAnnotation_Type)jcasType).casFeat_AnnotatorId == null)
      jcasType.jcas.throwFeatMissing("AnnotatorId", "de.unisaarland.swan.export.model.uima.SwanAnnotation");
    jcasType.ll_cas.ll_setStringValue(addr, ((SwanAnnotation_Type)jcasType).casFeatCode_AnnotatorId, v);}    
   
    
  //*--------------*
  //* Feature: Labels

  /** getter for Labels - gets Set of labels assigned to this annotation by the annotator.
   * @generated
   * @return value of the feature 
   */
  public FSList getLabels() {
    if (SwanAnnotation_Type.featOkTst && ((SwanAnnotation_Type)jcasType).casFeat_Labels == null)
      jcasType.jcas.throwFeatMissing("Labels", "de.unisaarland.swan.export.model.uima.SwanAnnotation");
    return (FSList)(jcasType.ll_cas.ll_getFSForRef(jcasType.ll_cas.ll_getRefValue(addr, ((SwanAnnotation_Type)jcasType).casFeatCode_Labels)));}
    
  /** setter for Labels - sets Set of labels assigned to this annotation by the annotator. 
   * @generated
   * @param v value to set into the feature 
   */
  public void setLabels(FSList v) {
    if (SwanAnnotation_Type.featOkTst && ((SwanAnnotation_Type)jcasType).casFeat_Labels == null)
      jcasType.jcas.throwFeatMissing("Labels", "de.unisaarland.swan.export.model.uima.SwanAnnotation");
    jcasType.ll_cas.ll_setRefValue(addr, ((SwanAnnotation_Type)jcasType).casFeatCode_Labels, jcasType.ll_cas.ll_getFSRef(v));}    
   
    
  //*--------------*
  //* Feature: Links

  /** getter for Links - gets Links starting at this SwanAnnotation.
   * @generated
   * @return value of the feature 
   */
  public FSList getLinks() {
    if (SwanAnnotation_Type.featOkTst && ((SwanAnnotation_Type)jcasType).casFeat_Links == null)
      jcasType.jcas.throwFeatMissing("Links", "de.unisaarland.swan.export.model.uima.SwanAnnotation");
    return (FSList)(jcasType.ll_cas.ll_getFSForRef(jcasType.ll_cas.ll_getRefValue(addr, ((SwanAnnotation_Type)jcasType).casFeatCode_Links)));}
    
  /** setter for Links - sets Links starting at this SwanAnnotation. 
   * @generated
   * @param v value to set into the feature 
   */
  public void setLinks(FSList v) {
    if (SwanAnnotation_Type.featOkTst && ((SwanAnnotation_Type)jcasType).casFeat_Links == null)
      jcasType.jcas.throwFeatMissing("Links", "de.unisaarland.swan.export.model.uima.SwanAnnotation");
    jcasType.ll_cas.ll_setRefValue(addr, ((SwanAnnotation_Type)jcasType).casFeatCode_Links, jcasType.ll_cas.ll_getFSRef(v));}    
   
    
  //*--------------*
  //* Feature: AnnotationId

  /** getter for AnnotationId - gets Id of the annotation (in database, used for assigning links between annotations).
   * @generated
   * @return value of the feature 
   */
  public String getAnnotationId() {
    if (SwanAnnotation_Type.featOkTst && ((SwanAnnotation_Type)jcasType).casFeat_AnnotationId == null)
      jcasType.jcas.throwFeatMissing("AnnotationId", "de.unisaarland.swan.export.model.uima.SwanAnnotation");
    return jcasType.ll_cas.ll_getStringValue(addr, ((SwanAnnotation_Type)jcasType).casFeatCode_AnnotationId);}
    
  /** setter for AnnotationId - sets Id of the annotation (in database, used for assigning links between annotations). 
   * @generated
   * @param v value to set into the feature 
   */
  public void setAnnotationId(String v) {
    if (SwanAnnotation_Type.featOkTst && ((SwanAnnotation_Type)jcasType).casFeat_AnnotationId == null)
      jcasType.jcas.throwFeatMissing("AnnotationId", "de.unisaarland.swan.export.model.uima.SwanAnnotation");
    jcasType.ll_cas.ll_setStringValue(addr, ((SwanAnnotation_Type)jcasType).casFeatCode_AnnotationId, v);}    
  }

    