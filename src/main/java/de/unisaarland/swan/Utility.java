/* 
 * Copyright (C) SWAN (Saar Web-based ANotation system) contributors. All rights reserved.
 * Licensed under the GPLv2 License. See LICENSE in the project root for license information.
 */
package de.unisaarland.swan;

import de.unisaarland.swan.entities.BaseEntity;
import de.unisaarland.swan.rest.services.v1.LoginFacadeREST;
import java.math.BigInteger;
import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;
import java.sql.Timestamp;
import java.util.Calendar;
import java.util.Date;
import java.util.Iterator;
import java.util.Random;
import java.util.Set;
import java.util.concurrent.CopyOnWriteArraySet;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;

/**
 * This is a Utility helper class for simple operations.
 *
 * @author Timo Guehring
 */
public class Utility {
    
    private static final int KEY_LENGTH = 192; // bits
    private static final int PBKDF2_ITERATIONS = 1000;
    private static final String SALT = "django";
    
    /**
     * Hashes a given String and is used to hash a password securely.
     *
     * Read more about secure password hashing:
     * https://security.stackexchange.com/questions/211/how-to-securely-hash-passwords
     *
     * @param password
     * @return hashed password
     */
    public static String hashPassword(String password) {

        if (password == null) {
            throw new IllegalArgumentException("Utility: password was null");
        }
        
        char[] passwordChars = password.toCharArray();
        byte[] saltBytes = SALT.getBytes();

        PBEKeySpec spec = new PBEKeySpec(
                passwordChars,
                saltBytes,
                PBKDF2_ITERATIONS,
                KEY_LENGTH
        );

        SecretKeyFactory key;

        try {
            key = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA1");
            byte[] hashedPassword = key.generateSecret(spec).getEncoded();
            return String.format("%x", new BigInteger(hashedPassword));
        } catch (NoSuchAlgorithmException | InvalidKeySpecException ex) {
            Logger.getLogger(LoginFacadeREST.class.getName()).log(Level.SEVERE, null, ex);
        }

        throw new RuntimeException("Utility: Something went wrong while hashing");
    }
    
    public static <E> CopyOnWriteArraySet<E> convertSet(Set<E> set) {
        CopyOnWriteArraySet<E> copySet = new CopyOnWriteArraySet<>();
        for (E e : set) {
            copySet.add(e);
        }
        return copySet;
    }
    
    public static Timestamp getCurrentTime() {
        Calendar calendar = Calendar.getInstance();
        Date now = calendar.getTime();
        return new Timestamp(now.getTime());
    }
    
    /**
     * This is a helper method to remove an object from a set.
     * 
     * @param <Entity>
     * @param set
     * @param id
     */
    public static <Entity extends BaseEntity> void removeObjectFromSet(Set<Entity> set, Long id) {
        
        Iterator<Entity> it = set.iterator();
        
        while (it.hasNext()) {
            Entity u = it.next();
            if (u.getId().equals(id)) {
                it.remove();
                return;
            }
        }
        
        throw new IllegalArgumentException("Utility: No object with id " + id + " in set was found");
    }
    
    public static String getRandomString(int length) {
        Random r = new Random();
        char min = 48;
        char max = 122;
        String ranStr = "";
        for (int i = 0; i < length; i++) {
            char c = (char)(r.nextInt(max - min + 1) + min);
            ranStr += c;
        }
        
        return ranStr;
    }
    
}
