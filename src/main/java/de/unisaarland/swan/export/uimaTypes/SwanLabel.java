

/* First created by JCasGen Thu Jul 07 14:33:30 CEST 2016 */
package de.unisaarland.swan.export.uimaTypes;

import org.apache.uima.jcas.JCas; 
import org.apache.uima.jcas.JCasRegistry;
import org.apache.uima.jcas.cas.TOP_Type;

import org.apache.uima.jcas.tcas.Annotation;


/** defines a label: name of label + name of LabelSet to which the labels belongs
 * Updated by JCasGen Thu Jul 07 15:25:41 CEST 2016
 * XML source: /local/workspace/sitent/DiscAnnoUima/typesystem/SwanTypesystem.xml
 * @generated */
public class SwanLabel extends Annotation {
  /** @generated
   * @ordered 
   */
  @SuppressWarnings ("hiding")
  public final static int typeIndexID = JCasRegistry.register(SwanLabel.class);
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
  protected SwanLabel() {/* intentionally empty block */}
    
  /** Internal - constructor used by generator 
   * @generated
   * @param addr low level Feature Structure reference
   * @param type the type of this Feature Structure 
   */
  public SwanLabel(int addr, TOP_Type type) {
    super(addr, type);
    readObject();
  }
  
  /** @generated
   * @param jcas JCas to which this Feature Structure belongs 
   */
  public SwanLabel(JCas jcas) {
    super(jcas);
    readObject();   
  } 

  /** @generated
   * @param jcas JCas to which this Feature Structure belongs
   * @param begin offset to the begin spot in the SofA
   * @param end offset to the end spot in the SofA 
  */  
  public SwanLabel(JCas jcas, int begin, int end) {
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
  //* Feature: Name

  /** getter for Name - gets name of label
   * @generated
   * @return value of the feature 
   */
  public String getName() {
    if (SwanLabel_Type.featOkTst && ((SwanLabel_Type)jcasType).casFeat_Name == null)
      jcasType.jcas.throwFeatMissing("Name", "de.unisaarland.swan.export.uimaTypes.SwanLabel");
    return jcasType.ll_cas.ll_getStringValue(addr, ((SwanLabel_Type)jcasType).casFeatCode_Name);}
    
  /** setter for Name - sets name of label 
   * @generated
   * @param v value to set into the feature 
   */
  public void setName(String v) {
    if (SwanLabel_Type.featOkTst && ((SwanLabel_Type)jcasType).casFeat_Name == null)
      jcasType.jcas.throwFeatMissing("Name", "de.unisaarland.swan.export.uimaTypes.SwanLabel");
    jcasType.ll_cas.ll_setStringValue(addr, ((SwanLabel_Type)jcasType).casFeatCode_Name, v);}    
   
    
  //*--------------*
  //* Feature: LabelSet

  /** getter for LabelSet - gets LabelSet to which the label belongs.
   * @generated
   * @return value of the feature 
   */
  public String getLabelSet() {
    if (SwanLabel_Type.featOkTst && ((SwanLabel_Type)jcasType).casFeat_LabelSet == null)
      jcasType.jcas.throwFeatMissing("LabelSet", "de.unisaarland.swan.export.uimaTypes.SwanLabel");
    return jcasType.ll_cas.ll_getStringValue(addr, ((SwanLabel_Type)jcasType).casFeatCode_LabelSet);}
    
  /** setter for LabelSet - sets LabelSet to which the label belongs. 
   * @generated
   * @param v value to set into the feature 
   */
  public void setLabelSet(String v) {
    if (SwanLabel_Type.featOkTst && ((SwanLabel_Type)jcasType).casFeat_LabelSet == null)
      jcasType.jcas.throwFeatMissing("LabelSet", "de.unisaarland.swan.export.uimaTypes.SwanLabel");
    jcasType.ll_cas.ll_setStringValue(addr, ((SwanLabel_Type)jcasType).casFeatCode_LabelSet, v);}    
  }

    