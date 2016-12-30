/* 
 * Copyright (C) SWAN (Saar Web-based ANotation system) contributors. All rights reserved.
 * Licensed under the GPLv2 License. See LICENSE in the project root for license information.
 */
package de.unisaarland.swan;

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
