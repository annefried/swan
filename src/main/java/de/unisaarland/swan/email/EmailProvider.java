/* 
 * Copyright (C) SWAN (Saar Web-based ANotation system) contributors. All rights reserved.
 * Licensed under the GPLv2 License. See LICENSE in the project root for license information.
 */
package de.unisaarland.swan.email;

import de.unisaarland.swan.dao.UsersDAO;
import de.unisaarland.swan.entities.Document;
import de.unisaarland.swan.entities.Project;
import de.unisaarland.swan.entities.State;
import de.unisaarland.swan.entities.Users;
import java.util.Date;
import java.util.List;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.annotation.Resource;
import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

/**
 * The EmailProvider is responsible for sending email progress reports.
 * 
 * To create the Mail resource in glassfish-resources.xml did not work as well
 * creating the resource in the glassfish admin panel. Instead use this command
 * in asadmin:
 * 
 * create-javamail-resource --mailhost smtp.gmail.com --mailuser colisaarland@gmail.com
 * --fromaddress colisaarland@gmail.com 
 * --property mail-smtp-auth=true:mail-smtp-starttls-enable=true:mail-smtp-port=587:mail-smtp-password=<password> 
 * mail/JavaMail
 *
 * @author Timo Guehring
 */
@Stateless(name = "ejbs/EmailServiceEJB")
public class EmailProvider {
    
    @Resource(name = "mail/JavaMail")
    private Session mailSession;
    
    @EJB
    private UsersDAO usersDAO;
    
    
    /**
     * Sends a progress email to all admings/ project manager on Sunday at 00:00
     * which are watching projects. Only users which are watching projects are
     * receiving notification.
     */
//    @Schedule(dayOfWeek="Sun", hour="0")
    public void sendProgressNotification() {
        List<Users> users = usersDAO.findAll();

        for (Users u : users) {
            if (!u.getWatchingProjects().isEmpty()) {
                sendProgressNotification(u);
            }
        }
    }
    
    private void sendProgressNotification(Users u) {
        sendEmail(u.getEmail(),
                    getEmailReport(u.getWatchingProjects()),
                    "Swan: Weekly Progress");
    }
    
    private void sendEmail(String email, String text, String subject) {
        
        try {
            InternetAddress emailAddr = new InternetAddress(email);
            
            Message message = new MimeMessage(mailSession);
            message.setRecipients(Message.RecipientType.TO,
                    InternetAddress.parse(emailAddr.toString(), false));
            message.setSubject(subject);
            message.setText(text);
            message.setHeader("X-Mailer", "My Mailer");
            
            Date timeStamp = new Date();
            message.setSentDate(timeStamp);
            
            Transport.send(message);
        } catch (MessagingException ex) {
            Logger.getLogger(EmailProvider.class.getName()).log(Level.SEVERE, null, ex);
        }
        
    }
    
    /**
     * Generates an EMail report with the projects and states of the documents
     * and users, including the completetion state.
     * 
     * @return String containing the text for the email
     */
    private String getEmailReport(Set<Project> projects) {
        
        String text = "";
        
        for (Project p : projects) {
            text += "Project " + p.getName() + ":\n";
            
            int total = 0;
            int completed = 0;
            for (Document d : p.getDocuments()) {
                
                for (State s : d.getStates()) {
                    total++;
                    
                    Users u = s.getUser();
                    text += d.getName() + "\t\t";
                    text += u.getPrename() + " " + u.getLastname() + ":\t";
                    if (s.isCompleted()) {
                        text += "completed\n";
                        completed++;
                    } else {
                        text += "not completed\n";
                    }
                }
                
                text += "In total " + completed + "/" + total
                        + " Document-User combinations are finished\n\n";
            }
            
        }
        
        return text;
    }
    
    public void sendPasswordResetNotification(Users user, String pwd) {
        String text = "Your password was reset. Your new password is:\n"
                + "User name: " + user.getPrename() + " " + user.getLastname() + "\n"
                + "New Password: " + pwd + "\n\n"
                + "Please change your password.";
        sendEmail(user.getEmail(), text, "Swan: Password reset");
    }
    
}
