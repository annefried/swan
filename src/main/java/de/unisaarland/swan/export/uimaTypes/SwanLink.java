

/* First created by JCasGen Thu Jul 07 14:33:30 CEST 2016 */
package de.unisaarland.swan.export.uimaTypes;

import org.apache.uima.jcas.JCas; 
import org.apache.uima.jcas.JCasRegistry;
import org.apache.uima.jcas.cas.TOP_Type;

import org.apache.uima.jcas.cas.FSList;
import org.apache.uima.jcas.tcas.Annotation;


/** Link between two annotations.
 * Updated by JCasGen Thu Jul 07 15:25:41 CEST 2016
 * XML source: /local/workspace/sitent/DiscAnnoUima/typesystem/SwanTypesystem.xml
 * @generated */
public class SwanLink extends Annotation {
  /** @generated
   * @ordered 
   */
  @SuppressWarnings ("hiding")
  public final static int typeIndexID = JCasRegistry.register(SwanLink.class);
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
  protected SwanLink() {/* intentionally empty block */}
    
  /** Internal - constructor used by generator 
   * @generated
   * @param addr low level Feature Structure reference
   * @param type the type of this Feature Structure 
   */
  public SwanLink(int addr, TOP_Type type) {
    super(addr, type);
    readObject();
  }
  
  /** @generated
   * @param jcas JCas to which this Feature Structure belongs 
   */
  public SwanLink(JCas jcas) {
    super(jcas);
    readObject();   
  } 

  /** @generated
   * @param jcas JCas to which this Feature Structure belongs
   * @param begin offset to the begin spot in the SofA
   * @param end offset to the end spot in the SofA 
  */  
  public SwanLink(JCas jcas, int begin, int end) {
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
  //* Feature: linkBegin

  /** getter for linkBegin - gets SwanAnnotation at which the link starts.
   * @generated
   * @return value of the feature 
   */
  public SwanAnnotation getLinkBegin() {
    if (SwanLink_Type.featOkTst && ((SwanLink_Type)jcasType).casFeat_linkBegin == null)
      jcasType.jcas.throwFeatMissing("linkBegin", "de.unisaarland.swan.export.uimaTypes.SwanLink");
    return (SwanAnnotation)(jcasType.ll_cas.ll_getFSForRef(jcasType.ll_cas.ll_getRefValue(addr, ((SwanLink_Type)jcasType).casFeatCode_linkBegin)));}
    
  /** setter for linkBegin - sets SwanAnnotation at which the link starts. 
   * @generated
   * @param v value to set into the feature 
   */
  public void setLinkBegin(SwanAnnotation v) {
    if (SwanLink_Type.featOkTst && ((SwanLink_Type)jcasType).casFeat_linkBegin == null)
      jcasType.jcas.throwFeatMissing("linkBegin", "de.unisaarland.swan.export.uimaTypes.SwanLink");
    jcasType.ll_cas.ll_setRefValue(addr, ((SwanLink_Type)jcasType).casFeatCode_linkBegin, jcasType.ll_cas.ll_getFSRef(v));}    
   
    
  //*--------------*
  //* Feature: linkEnd

  /** getter for linkEnd - gets SwanAnnotation at which the link ends.
   * @generated
   * @return value of the feature 
   */
  public SwanAnnotation getLinkEnd() {
    if (SwanLink_Type.featOkTst && ((SwanLink_Type)jcasType).casFeat_linkEnd == null)
      jcasType.jcas.throwFeatMissing("linkEnd", "de.unisaarland.swan.export.uimaTypes.SwanLink");
    return (SwanAnnotation)(jcasType.ll_cas.ll_getFSForRef(jcasType.ll_cas.ll_getRefValue(addr, ((SwanLink_Type)jcasType).casFeatCode_linkEnd)));}
    
  /** setter for linkEnd - sets SwanAnnotation at which the link ends. 
   * @generated
   * @param v value to set into the feature 
   */
  public void setLinkEnd(SwanAnnotation v) {
    if (SwanLink_Type.featOkTst && ((SwanLink_Type)jcasType).casFeat_linkEnd == null)
      jcasType.jcas.throwFeatMissing("linkEnd", "de.unisaarland.swan.export.uimaTypes.SwanLink");
    jcasType.ll_cas.ll_setRefValue(addr, ((SwanLink_Type)jcasType).casFeatCode_linkEnd, jcasType.ll_cas.ll_getFSRef(v));}    
   
    
  //*--------------*
  //* Feature: Labels

  /** getter for Labels - gets labels assigned to the link.
   * @generated
   * @return value of the feature 
   */
  public FSList getLabels() {
    if (SwanLink_Type.featOkTst && ((SwanLink_Type)jcasType).casFeat_Labels == null)
      jcasType.jcas.throwFeatMissing("Labels", "de.unisaarland.swan.export.uimaTypes.SwanLink");
    return (FSList)(jcasType.ll_cas.ll_getFSForRef(jcasType.ll_cas.ll_getRefValue(addr, ((SwanLink_Type)jcasType).casFeatCode_Labels)));}
    
  /** setter for Labels - sets labels assigned to the link. 
   * @generated
   * @param v value to set into the feature 
   */
  public void setLabels(FSList v) {
    if (SwanLink_Type.featOkTst && ((SwanLink_Type)jcasType).casFeat_Labels == null)
      jcasType.jcas.throwFeatMissing("Labels", "de.unisaarland.swan.export.uimaTypes.SwanLink");
    jcasType.ll_cas.ll_setRefValue(addr, ((SwanLink_Type)jcasType).casFeatCode_Labels, jcasType.ll_cas.ll_getFSRef(v));}    
   
    
  //*--------------*
  //* Feature: AnnotatorId

  /** getter for AnnotatorId - gets Id of annotator who created this link.
   * @generated
   * @return value of the feature 
   */
  public String getAnnotatorId() {
    if (SwanLink_Type.featOkTst && ((SwanLink_Type)jcasType).casFeat_AnnotatorId == null)
      jcasType.jcas.throwFeatMissing("AnnotatorId", "de.unisaarland.swan.export.uimaTypes.SwanLink");
    return jcasType.ll_cas.ll_getStringValue(addr, ((SwanLink_Type)jcasType).casFeatCode_AnnotatorId);}
    
  /** setter for AnnotatorId - sets Id of annotator who created this link. 
   * @generated
   * @param v value to set into the feature 
   */
  public void setAnnotatorId(String v) {
    if (SwanLink_Type.featOkTst && ((SwanLink_Type)jcasType).casFeat_AnnotatorId == null)
      jcasType.jcas.throwFeatMissing("AnnotatorId", "de.unisaarland.swan.export.uimaTypes.SwanLink");
    jcasType.ll_cas.ll_setStringValue(addr, ((SwanLink_Type)jcasType).casFeatCode_AnnotatorId, v);}    
  }

    