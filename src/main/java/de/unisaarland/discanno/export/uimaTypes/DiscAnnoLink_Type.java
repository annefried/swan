
/* First created by JCasGen Mon Mar 21 16:29:37 CET 2016 */
package de.unisaarland.discanno.export.uimaTypes;

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

/** Link between two annotations.
 * Updated by JCasGen Mon Mar 21 16:42:19 CET 2016
 * @generated */
public class DiscAnnoLink_Type extends Annotation_Type {
  /** @generated 
   * @return the generator for this type
   */
  @Override
  protected FSGenerator getFSGenerator() {return fsGenerator;}
  /** @generated */
  private final FSGenerator fsGenerator = 
    new FSGenerator() {
      public FeatureStructure createFS(int addr, CASImpl cas) {
  			 if (DiscAnnoLink_Type.this.useExistingInstance) {
  			   // Return eq fs instance if already created
  		     FeatureStructure fs = DiscAnnoLink_Type.this.jcas.getJfsFromCaddr(addr);
  		     if (null == fs) {
  		       fs = new DiscAnnoLink(addr, DiscAnnoLink_Type.this);
  			   DiscAnnoLink_Type.this.jcas.putJfsFromCaddr(addr, fs);
  			   return fs;
  		     }
  		     return fs;
        } else return new DiscAnnoLink(addr, DiscAnnoLink_Type.this);
  	  }
    };
  /** @generated */
  @SuppressWarnings ("hiding")
  public final static int typeIndexID = DiscAnnoLink.typeIndexID;
  /** @generated 
     @modifiable */
  @SuppressWarnings ("hiding")
  public final static boolean featOkTst = JCasRegistry.getFeatOkTst("de.unisaarland.discanno.export.uimaTypes.DiscAnnoLink");
 
  /** @generated */
  final Feature casFeat_linkBegin;
  /** @generated */
  final int     casFeatCode_linkBegin;
  /** @generated
   * @param addr low level Feature Structure reference
   * @return the feature value 
   */ 
  public int getLinkBegin(int addr) {
        if (featOkTst && casFeat_linkBegin == null)
      jcas.throwFeatMissing("linkBegin", "de.unisaarland.discanno.export.uimaTypes.DiscAnnoLink");
    return ll_cas.ll_getRefValue(addr, casFeatCode_linkBegin);
  }
  /** @generated
   * @param addr low level Feature Structure reference
   * @param v value to set 
   */    
  public void setLinkBegin(int addr, int v) {
        if (featOkTst && casFeat_linkBegin == null)
      jcas.throwFeatMissing("linkBegin", "de.unisaarland.discanno.export.uimaTypes.DiscAnnoLink");
    ll_cas.ll_setRefValue(addr, casFeatCode_linkBegin, v);}
    
  
 
  /** @generated */
  final Feature casFeat_linkEnd;
  /** @generated */
  final int     casFeatCode_linkEnd;
  /** @generated
   * @param addr low level Feature Structure reference
   * @return the feature value 
   */ 
  public int getLinkEnd(int addr) {
        if (featOkTst && casFeat_linkEnd == null)
      jcas.throwFeatMissing("linkEnd", "de.unisaarland.discanno.export.uimaTypes.DiscAnnoLink");
    return ll_cas.ll_getRefValue(addr, casFeatCode_linkEnd);
  }
  /** @generated
   * @param addr low level Feature Structure reference
   * @param v value to set 
   */    
  public void setLinkEnd(int addr, int v) {
        if (featOkTst && casFeat_linkEnd == null)
      jcas.throwFeatMissing("linkEnd", "de.unisaarland.discanno.export.uimaTypes.DiscAnnoLink");
    ll_cas.ll_setRefValue(addr, casFeatCode_linkEnd, v);}
    
  
 
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
      jcas.throwFeatMissing("Labels", "de.unisaarland.discanno.export.uimaTypes.DiscAnnoLink");
    return ll_cas.ll_getRefValue(addr, casFeatCode_Labels);
  }
  /** @generated
   * @param addr low level Feature Structure reference
   * @param v value to set 
   */    
  public void setLabels(int addr, int v) {
        if (featOkTst && casFeat_Labels == null)
      jcas.throwFeatMissing("Labels", "de.unisaarland.discanno.export.uimaTypes.DiscAnnoLink");
    ll_cas.ll_setRefValue(addr, casFeatCode_Labels, v);}
    
  
 
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
      jcas.throwFeatMissing("AnnotatorId", "de.unisaarland.discanno.export.uimaTypes.DiscAnnoLink");
    return ll_cas.ll_getStringValue(addr, casFeatCode_AnnotatorId);
  }
  /** @generated
   * @param addr low level Feature Structure reference
   * @param v value to set 
   */    
  public void setAnnotatorId(int addr, String v) {
        if (featOkTst && casFeat_AnnotatorId == null)
      jcas.throwFeatMissing("AnnotatorId", "de.unisaarland.discanno.export.uimaTypes.DiscAnnoLink");
    ll_cas.ll_setStringValue(addr, casFeatCode_AnnotatorId, v);}
    
  



  /** initialize variables to correspond with Cas Type and Features
	 * @generated
	 * @param jcas JCas
	 * @param casType Type 
	 */
  public DiscAnnoLink_Type(JCas jcas, Type casType) {
    super(jcas, casType);
    casImpl.getFSClassRegistry().addGeneratorForType((TypeImpl)this.casType, getFSGenerator());

 
    casFeat_linkBegin = jcas.getRequiredFeatureDE(casType, "linkBegin", "de.unisaarland.discanno.export.uimaTypes.DiscAnnotation", featOkTst);
    casFeatCode_linkBegin  = (null == casFeat_linkBegin) ? JCas.INVALID_FEATURE_CODE : ((FeatureImpl)casFeat_linkBegin).getCode();

 
    casFeat_linkEnd = jcas.getRequiredFeatureDE(casType, "linkEnd", "de.unisaarland.discanno.export.uimaTypes.DiscAnnotation", featOkTst);
    casFeatCode_linkEnd  = (null == casFeat_linkEnd) ? JCas.INVALID_FEATURE_CODE : ((FeatureImpl)casFeat_linkEnd).getCode();

 
    casFeat_Labels = jcas.getRequiredFeatureDE(casType, "Labels", "uima.cas.FSList", featOkTst);
    casFeatCode_Labels  = (null == casFeat_Labels) ? JCas.INVALID_FEATURE_CODE : ((FeatureImpl)casFeat_Labels).getCode();

 
    casFeat_AnnotatorId = jcas.getRequiredFeatureDE(casType, "AnnotatorId", "uima.cas.String", featOkTst);
    casFeatCode_AnnotatorId  = (null == casFeat_AnnotatorId) ? JCas.INVALID_FEATURE_CODE : ((FeatureImpl)casFeat_AnnotatorId).getCode();

  }
}



    