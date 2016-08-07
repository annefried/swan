/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package de.unisaarland.swan.rest.services.v1;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import de.unisaarland.swan.LoginUtil;
import de.unisaarland.swan.Utility;
import de.unisaarland.swan.dao.UsersDAO;
import de.unisaarland.swan.entities.Users;
import de.unisaarland.swan.rest.view.View;

import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.ws.rs.FormParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

/**
 * The REST service responsible for users.
 *
 * @author Timo Guehring
 */
@Stateless
@Path("/usermanagment")
public class LoginFacadeREST extends AbstractFacade<Users> {
   
    // Needed to write JSON with specific properties e.g. views
    private static final ObjectMapper MAPPER = new ObjectMapper();

    @EJB
    UsersDAO usersDAO;
    

    /**
     * Logs in a user and tests whether this user exists with the email and
     * password combination. If the user is logged in successfully he has
     * access depending on his role (admin/ project manager/ user) to the other
     * functionalities via REST requests.
     *
     * @param email
     * @param password
     * @return
     */
    @POST
    @Path("/login")
    @Produces({MediaType.APPLICATION_JSON})
    public Response login(@FormParam("email") String email, @FormParam("password") String password) {
        
        Users user = usersDAO.getUserByEmailPwd(email, Utility.hashPassword(password));
        
        if (user != null) {
            
            try {
                user.setSession(getSessionID());
                usersDAO.merge(user);
            
                return Response.ok(MAPPER.writerWithView(View.Login.class)
                                            .withRootName("user")
                                            .writeValueAsString(user))
                                .build();
            } catch (JsonProcessingException ex) {
                return Response.ok(user.getId()).build();
            }
        } else {
            return Response.status(Response.Status.FORBIDDEN).build();
        }
    }
    
    /**
     * Log out the current user.
     *
     * @return
     */
    @POST
    @Path("/logout")
    @Produces({MediaType.APPLICATION_JSON})
    public Response logout() {
        try {
            Users user = usersDAO.checkLogin(getSessionID());
            LoginUtil.check(user);
            user.setSession(null);
            usersDAO.merge(user);
            return Response.ok("Logout successful.").build();
        } catch(SecurityException e){
            return Response.status(Response.Status.CONFLICT).build();
        }
    }
    
    @POST
    @Path("/current")
    @Produces({MediaType.APPLICATION_JSON})
    public Response current() {
        return usersDAO.create(usersDAO.checkLogin(getSessionID()));
    }

}
