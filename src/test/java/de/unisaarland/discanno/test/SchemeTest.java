/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package de.unisaarland.discanno.test;

import de.unisaarland.discanno.business.Service;
import de.unisaarland.discanno.entities.Label;
import de.unisaarland.discanno.entities.LabelSet;
import de.unisaarland.discanno.entities.LinkSet;
import de.unisaarland.discanno.entities.Scheme;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import javax.ejb.CreateException;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;
import org.junit.Before;
import org.junit.Test;

/**
 *
 * @author Timo Guehring
 */
public class SchemeTest extends BaseTest {
    
    Service service = new Service();
    
    @Before
    public void configService() {
        super.configureService(service);
    }

    
    @Test
    public void testCreate() throws CreateException {
        
        Scheme scheme = TestDataProvider.getScheme1();
        service.process(scheme);
        persistAndFlush(scheme);
        
        Scheme retScheme = em.find(Scheme.class, scheme.getId());
        
        assertNotNull(retScheme);
        assertTrue(retScheme.getName().equals("Scheme1"));
        assertTrue(scheme.getLabelSets().size()
                        == retScheme.getLabelSets().size());
        assertTrue(retScheme.getLabelSets().size() == 3);
        assertTrue(scheme.getLinkSets().size()
                        == retScheme.getLinkSets().size());
        assertTrue(retScheme.getLinkSets().size() == 1);
        assertTrue(retScheme.getProjects().isEmpty());
        assertTrue(retScheme.getTargetTypes().size()
                    == scheme.getTargetTypes().size());
        assertTrue(retScheme.getTargetTypes().size() == 3);
        
        // Check LabelSets
        LabelSet ls1 = null;
        LabelSet ls2 = null;
        LabelSet ls3 = null;
        for (LabelSet ls : retScheme.getLabelSets()) {
            if (ls.getName().equals("LabelSet1")) {
                ls1 = ls;
            } else if (ls.getName().equals("LabelSet2")) {
                ls2 = ls;
            } else if (ls.getName().equals("LabelSet3")) {
                ls3 = ls;
            } else {
                fail("Wrong LabelSet");
            }
        }
        
        // LabelSet1
        assertNotNull(ls1);
        assertTrue(ls1.isExclusive());
        assertTrue(ls1.getLabels().size() == 4);
        assertTrue(ls1.getAppliesToTargetTypes().size() == 2);
        
        Set<String> labels = convertLabelsToString(ls1.getLabels());
        Set<String> origLabels = new HashSet<>();
        origLabels.add("STATE");
        origLabels.add("EVENT");
        origLabels.add("GENERIC");
        origLabels.add("OTHER");
        
        assertTrue(origLabels.containsAll(labels));
        
        Label labelOther = getLabelByString(ls1.getLabels(), "OTHER");
        assertTrue(labelOther.getLabelSet().size() == 3);
        
        // LabelSet2
        assertNotNull(ls2);
        assertTrue(ls2.isExclusive());
        assertTrue(ls2.getLabels().size() == 6);
        assertTrue(ls2.getAppliesToTargetTypes().size() == 1);
        
        // LabelSet3
        assertNotNull(ls3);
        assertFalse(ls3.isExclusive());
        assertTrue(ls3.getLabels().size() == 4);
        assertTrue(ls3.getAppliesToTargetTypes().size() == 1);
        
        // LinkSet
        LinkSet linkSet = retScheme.getLinkSets().get(0);
        assertNotNull(linkSet);
        assertFalse(linkSet.isAllowUnlabeledLinks());
        assertTrue(linkSet.getStartType().getTargetType().equals("verb"));
        assertTrue(linkSet.getEndType().getTargetType().equals("verb"));
        assertTrue(linkSet.getLinkLabels().size() == 3);
    }
    
    @Test(expected = CreateException.class)
    public void testBrokenScheme() throws CreateException {
        Scheme scheme = TestDataProvider.getSchemeWithNoTargetTypes();
        service.process(scheme);
    }
    
    private Set convertLabelsToString(List<Label> labels) {
        Set<String> set = new HashSet<>();
        for (Label l : labels) {
            set.add(l.getLabelId());
        }
        return set;
    }
    
    private Label getLabelByString(List<Label> list, String name) {
        for (Label l : list) {
            if (l.getLabelId().equals(name)) {
                return l;
            }
        }
        
        throw new IllegalArgumentException("Label not found");
    }
    
}
