/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
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
