/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package de.unisaarland.discanno;

import java.util.Date;
import java.sql.Timestamp;
import javax.xml.bind.annotation.adapters.XmlAdapter;

/**
 * This is used for the XML @XmlJavaTypeAdapter annotation for timestamps.
 *
 * @author Timo Guehring
 */
public class TimestampAdapter extends XmlAdapter<Date, Timestamp> {
    
    @Override
    public Date marshal(Timestamp v) {
        return new Date(v.getTime());
    }
    
    @Override
    public Timestamp unmarshal(Date v) {
        return new Timestamp(v.getTime());
    }
    
}
