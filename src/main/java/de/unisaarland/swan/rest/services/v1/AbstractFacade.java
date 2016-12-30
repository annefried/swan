/* 
 * Copyright (C) SWAN (Saar Web-based ANotation system) contributors. All rights reserved.
 * Licensed under the GPLv2 License. See LICENSE in the project root for license information.
 */
package de.unisaarland.swan.rest.services.v1;

import de.unisaarland.swan.entities.BaseEntity;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.Context;

/**
 *
 * @author Timo Guehring
 * @param <T>
 */
public abstract class AbstractFacade<T extends BaseEntity> {

    @Context
    HttpServletRequest request;
    
    protected String getSessionID() {
        return request.getSession(true).getId();
    }
    
    // TODO @Janna
//    protected URI getLoginURI(){
//       return this.getUriInfo().getAbsolutePath().resolve(AbstractFacade.LOGIN_URL);
//    }
    
}
