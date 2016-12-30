/* 
 * Copyright (C) SWAN (Saar Web-based ANotation system) contributors. All rights reserved.
 * Licensed under the GPLv2 License. See LICENSE in the project root for license information.
 */
package de.unisaarland.swan.export.model.uima;

import org.apache.uima.jcas.JCas;
import org.apache.uima.jcas.JCasRegistry;
import org.apache.uima.cas.impl.CASImpl;
import org.apache.uima.cas.impl.FSGenerator;
import org.apache.uima.cas.FeatureStructure;
import org.apache.uima.cas.impl.TypeImpl;
import org.apache.uima.cas.Type;
import org.apache.uima.cas.impl.FeatureImpl;
import org.apache.uima.cas.Feature;
import org.apache.uima.jcas.tcas.Annotation_Type;

/** Annotation of one annotator.
 * Updated by JCasGen Thu Jul 07 15:25:41 CEST 2016
 * @generated */
public class SwanAnnotation_Type extends Annotation_Type {
  /** @generated 
   * @return the generator for this type
   */
  @Override
  protected FSGenerator getFSGenerator() {return fsGenerator;}
  /** @generated */
  private final FSGenerator fsGenerator = 
    new FSGenerator() {
      public FeatureStructure createFS(int addr, CASImpl cas) {
  			 if (SwanAnnotation_Type.this.useExistingInstance) {
  			   // Return eq fs instance if already created
  		     FeatureStructure fs = SwanAnnotation_Type.this.jcas.getJfsFromCaddr(addr);
  		     if (null == fs) {
  		       fs = new SwanAnnotation(addr, SwanAnnotation_Type.this);
  			   SwanAnnotation_Type.this.jcas.putJfsFromCaddr(addr, fs);
  			   return fs;
  		     }
  		     return fs;
        } else return new SwanAnnotation(addr, SwanAnnotation_Type.this);
  	  }
    };
  /** @generated */
  @SuppressWarnings ("hiding")
  public final static int typeIndexID = SwanAnnotation.typeIndexID;
  /** @generated 
     @modifiable */
  @SuppressWarnings ("hiding")
  public final static boolean featOkTst = JCasRegistry.getFeatOkTst("de.unisaarland.swan.export.model.uima.SwanAnnotation");
 
  /** @generated */
  final Feature casFeat_SpanType;
  /** @generated */
  final int     casFeatCode_SpanType;
  /** @generated
   * @param addr low level Feature Structure reference
   * @return the feature value 
   */ 
  public String getSpanType(int addr) {
        if (featOkTst && casFeat_SpanType == null)
      jcas.throwFeatMissing("SpanType", "de.unisaarland.swan.export.model.uima.SwanAnnotation");
    return ll_cas.ll_getStringValue(addr, casFeatCode_SpanType);
  }
  /** @generated
   * @param addr low level Feature Structure reference
   * @param v value to set 
   */    
  public void setSpanType(int addr, String v) {
        if (featOkTst && casFeat_SpanType == null)
      jcas.throwFeatMissing("SpanType", "de.unisaarland.swan.export.model.uima.SwanAnnotation");
    ll_cas.ll_setStringValue(addr, casFeatCode_SpanType, v);}
    
  
 
  /** @generated */
  final Feature casFeat_AnnotatorId;
  /** @generated */
  final int     casFeatCode_AnnotatorId;
  /** @generated
   * @param addr low level Feature Structure reference
   * @return the feature value 
   */ 
  public String getAnnotatorId(int addr) {
        if (featOkTst && casFeat_AnnotatorId == null)
      jcas.throwFeatMissing("AnnotatorId", "de.unisaarland.swan.export.model.uima.SwanAnnotation");
    return ll_cas.ll_getStringValue(addr, casFeatCode_AnnotatorId);
  }
  /** @generated
   * @param addr low level Feature Structure reference
   * @param v value to set 
   */    
  public void setAnnotatorId(int addr, String v) {
        if (featOkTst && casFeat_AnnotatorId == null)
      jcas.throwFeatMissing("AnnotatorId", "de.unisaarland.swan.export.model.uima.SwanAnnotation");
    ll_cas.ll_setStringValue(addr, casFeatCode_AnnotatorId, v);}
    
  
 
  /** @generated */
  final Feature casFeat_Labels;
  /** @generated */
  final int     casFeatCode_Labels;
  /** @generated
   * @param addr low level Feature Structure reference
   * @return the feature value 
   */ 
  public int getLabels(int addr) {
        if (featOkTst && casFeat_Labels == null)
      jcas.throwFeatMissing("Labels", "de.unisaarland.swan.export.model.uima.SwanAnnotation");
    return ll_cas.ll_getRefValue(addr, casFeatCode_Labels);
  }
  /** @generated
   * @param addr low level Feature Structure reference
   * @param v value to set 
   */    
  public void setLabels(int addr, int v) {
        if (featOkTst && casFeat_Labels == null)
      jcas.throwFeatMissing("Labels", "de.unisaarland.swan.export.model.uima.SwanAnnotation");
    ll_cas.ll_setRefValue(addr, casFeatCode_Labels, v);}
    
  
 
  /** @generated */
  final Feature casFeat_Links;
  /** @generated */
  final int     casFeatCode_Links;
  /** @generated
   * @param addr low level Feature Structure reference
   * @return the feature value 
   */ 
  public int getLinks(int addr) {
        if (featOkTst && casFeat_Links == null)
      jcas.throwFeatMissing("Links", "de.unisaarland.swan.export.model.uima.SwanAnnotation");
    return ll_cas.ll_getRefValue(addr, casFeatCode_Links);
  }
  /** @generated
   * @param addr low level Feature Structure reference
   * @param v value to set 
   */    
  public void setLinks(int addr, int v) {
        if (featOkTst && casFeat_Links == null)
      jcas.throwFeatMissing("Links", "de.unisaarland.swan.export.model.uima.SwanAnnotation");
    ll_cas.ll_setRefValue(addr, casFeatCode_Links, v);}
    
  
 
  /** @generated */
  final Feature casFeat_AnnotationId;
  /** @generated */
  final int     casFeatCode_AnnotationId;
  /** @generated
   * @param addr low level Feature Structure reference
   * @return the feature value 
   */ 
  public String getAnnotationId(int addr) {
        if (featOkTst && casFeat_AnnotationId == null)
      jcas.throwFeatMissing("AnnotationId", "de.unisaarland.swan.export.model.uima.SwanAnnotation");
    return ll_cas.ll_getStringValue(addr, casFeatCode_AnnotationId);
  }
  /** @generated
   * @param addr low level Feature Structure reference
   * @param v value to set 
   */    
  public void setAnnotationId(int addr, String v) {
        if (featOkTst && casFeat_AnnotationId == null)
      jcas.throwFeatMissing("AnnotationId", "de.unisaarland.swan.export.model.uima.SwanAnnotation");
    ll_cas.ll_setStringValue(addr, casFeatCode_AnnotationId, v);}
    
  



  /** initialize variables to correspond with Cas Type and Features
	 * @generated
	 * @param jcas JCas
	 * @param casType Type 
	 */
  public SwanAnnotation_Type(JCas jcas, Type casType) {
    super(jcas, casType);
    casImpl.getFSClassRegistry().addGeneratorForType((TypeImpl)this.casType, getFSGenerator());

 
    casFeat_SpanType = jcas.getRequiredFeatureDE(casType, "SpanType", "uima.cas.String", featOkTst);
    casFeatCode_SpanType  = (null == casFeat_SpanType) ? JCas.INVALID_FEATURE_CODE : ((FeatureImpl)casFeat_SpanType).getCode();

 
    casFeat_AnnotatorId = jcas.getRequiredFeatureDE(casType, "AnnotatorId", "uima.cas.String", featOkTst);
    casFeatCode_AnnotatorId  = (null == casFeat_AnnotatorId) ? JCas.INVALID_FEATURE_CODE : ((FeatureImpl)casFeat_AnnotatorId).getCode();

 
    casFeat_Labels = jcas.getRequiredFeatureDE(casType, "Labels", "uima.cas.FSList", featOkTst);
    casFeatCode_Labels  = (null == casFeat_Labels) ? JCas.INVALID_FEATURE_CODE : ((FeatureImpl)casFeat_Labels).getCode();

 
    casFeat_Links = jcas.getRequiredFeatureDE(casType, "Links", "uima.cas.FSList", featOkTst);
    casFeatCode_Links  = (null == casFeat_Links) ? JCas.INVALID_FEATURE_CODE : ((FeatureImpl)casFeat_Links).getCode();

 
    casFeat_AnnotationId = jcas.getRequiredFeatureDE(casType, "AnnotationId", "uima.cas.String", featOkTst);
    casFeatCode_AnnotationId  = (null == casFeat_AnnotationId) ? JCas.INVALID_FEATURE_CODE : ((FeatureImpl)casFeat_AnnotationId).getCode();

  }
}



    