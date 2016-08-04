
/* First created by JCasGen Thu Jul 07 14:33:30 CEST 2016 */
package de.unisaarland.swan.export.uimaTypes;

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

/** defines a label: name of label + name of LabelSet to which the labels belongs
 * Updated by JCasGen Thu Jul 07 15:25:41 CEST 2016
 * @generated */
public class SwanLabel_Type extends Annotation_Type {
  /** @generated 
   * @return the generator for this type
   */
  @Override
  protected FSGenerator getFSGenerator() {return fsGenerator;}
  /** @generated */
  private final FSGenerator fsGenerator = 
    new FSGenerator() {
      public FeatureStructure createFS(int addr, CASImpl cas) {
  			 if (SwanLabel_Type.this.useExistingInstance) {
  			   // Return eq fs instance if already created
  		     FeatureStructure fs = SwanLabel_Type.this.jcas.getJfsFromCaddr(addr);
  		     if (null == fs) {
  		       fs = new SwanLabel(addr, SwanLabel_Type.this);
  			   SwanLabel_Type.this.jcas.putJfsFromCaddr(addr, fs);
  			   return fs;
  		     }
  		     return fs;
        } else return new SwanLabel(addr, SwanLabel_Type.this);
  	  }
    };
  /** @generated */
  @SuppressWarnings ("hiding")
  public final static int typeIndexID = SwanLabel.typeIndexID;
  /** @generated 
     @modifiable */
  @SuppressWarnings ("hiding")
  public final static boolean featOkTst = JCasRegistry.getFeatOkTst("de.unisaarland.swan.export.uimaTypes.SwanLabel");
 
  /** @generated */
  final Feature casFeat_Name;
  /** @generated */
  final int     casFeatCode_Name;
  /** @generated
   * @param addr low level Feature Structure reference
   * @return the feature value 
   */ 
  public String getName(int addr) {
        if (featOkTst && casFeat_Name == null)
      jcas.throwFeatMissing("Name", "de.unisaarland.swan.export.uimaTypes.SwanLabel");
    return ll_cas.ll_getStringValue(addr, casFeatCode_Name);
  }
  /** @generated
   * @param addr low level Feature Structure reference
   * @param v value to set 
   */    
  public void setName(int addr, String v) {
        if (featOkTst && casFeat_Name == null)
      jcas.throwFeatMissing("Name", "de.unisaarland.swan.export.uimaTypes.SwanLabel");
    ll_cas.ll_setStringValue(addr, casFeatCode_Name, v);}
    
  
 
  /** @generated */
  final Feature casFeat_LabelSet;
  /** @generated */
  final int     casFeatCode_LabelSet;
  /** @generated
   * @param addr low level Feature Structure reference
   * @return the feature value 
   */ 
  public String getLabelSet(int addr) {
        if (featOkTst && casFeat_LabelSet == null)
      jcas.throwFeatMissing("LabelSet", "de.unisaarland.swan.export.uimaTypes.SwanLabel");
    return ll_cas.ll_getStringValue(addr, casFeatCode_LabelSet);
  }
  /** @generated
   * @param addr low level Feature Structure reference
   * @param v value to set 
   */    
  public void setLabelSet(int addr, String v) {
        if (featOkTst && casFeat_LabelSet == null)
      jcas.throwFeatMissing("LabelSet", "de.unisaarland.swan.export.uimaTypes.SwanLabel");
    ll_cas.ll_setStringValue(addr, casFeatCode_LabelSet, v);}
    
  



  /** initialize variables to correspond with Cas Type and Features
	 * @generated
	 * @param jcas JCas
	 * @param casType Type 
	 */
  public SwanLabel_Type(JCas jcas, Type casType) {
    super(jcas, casType);
    casImpl.getFSClassRegistry().addGeneratorForType((TypeImpl)this.casType, getFSGenerator());

 
    casFeat_Name = jcas.getRequiredFeatureDE(casType, "Name", "uima.cas.String", featOkTst);
    casFeatCode_Name  = (null == casFeat_Name) ? JCas.INVALID_FEATURE_CODE : ((FeatureImpl)casFeat_Name).getCode();

 
    casFeat_LabelSet = jcas.getRequiredFeatureDE(casType, "LabelSet", "uima.cas.String", featOkTst);
    casFeatCode_LabelSet  = (null == casFeat_LabelSet) ? JCas.INVALID_FEATURE_CODE : ((FeatureImpl)casFeat_LabelSet).getCode();

  }
}



    