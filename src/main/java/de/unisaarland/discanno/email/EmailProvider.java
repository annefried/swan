/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package de.unisaarland.discanno.email;

import de.unisaarland.discanno.dao.ProjectDAO;
import de.unisaarland.discanno.entities.Document;
import de.unisaarland.discanno.entities.Project;
import de.unisaarland.discanno.entities.State;
import de.unisaarland.discanno.entities.Users;
import java.util.Date;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.annotation.Resource;
import javax.ejb.EJB;
import javax.ejb.Schedule;
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
 * --property mail-smtp-auth=true:mail-smtp-starttls-enable=true:mail-smtp-port=587:mail-smtp-password=Coli1234 
 * mail/JavaMail
 *
 * @author Timo Guehring
 */
@Stateless(name = "ejbs/EmailServiceEJB")
public class EmailProvider {
    
    // TODO change this
    private static final String TARGET_EMAIL_ADRESS = "timo.guehring@googlemail.com";
    
    @Resource(name = "mail/JavaMail")
    private Session mailSession;
    
    @EJB
    private ProjectDAO projectDAO;
    
    /**
     * Sends a progress email to the TARGET_EMAIL_ADRESS on Sunday at 00:00.
     */
    @Schedule(dayOfWeek="Sun", hour="0")
    public void sendProgressNotification() {

        try {
            InternetAddress emailAddr = new InternetAddress(TARGET_EMAIL_ADRESS);
            
            Message message = new MimeMessage(mailSession);
            message.setRecipients(Message.RecipientType.TO,
                    InternetAddress.parse(emailAddr.toString(), false));
            message.setSubject("DiscAnno: Weekly Progress");
            message.setText(getEmailReport());
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
    private String getEmailReport() {
        
        String text = "";
        List<Project> projects = projectDAO.findAll();
        
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
    
}
