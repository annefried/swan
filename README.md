# Welcome to DiscAnno
DiscAnno web-based annotation tool

## Technologies
* **Frontend**:
  * Bootstrap, HTML, CSS
  * AngularJS, JavaScript
  * Jackson JSOG (Voodoodyne) for circular JSON objects
* **Backend**:
  * JavaEE (Java Enterprise Edititon)
    * EclipseLink 2.6.2 JPA provider
    * Jackson (Codehaus) as JSON processor
    * Jackson JSOG (Voodoodyne) for circular JSON objects
  * RESTful services for frontend-backend communication
  * PostgreSQL (9.3 or newer) database
  * GlassFish 4.1 as application server
* **Testing**:
  * JUnit 4.12
  * Mockito 1.9.5
  * h2 as local testing database
  * JaCoCo for report generation

## Get started:

## Git
* Windows: https://desktop.github.com/
* Mac: https://mac.github.com/
* Windows/ Mac/ Linux: https://help.github.com/articles/set-up-git/

## Development environment
* JDK8:
  * Make sure you have installed the Java Development Kit 8 and not an older version or OpenJDK.
* NetBeans 8.1 (JavaEE version) (https://netbeans.org/downloads/):
  * It is recommended to use NetBeans.
  * Note: NetBeans 8.1 comes with GlassFish 4.1
* PostgreSQL 9.3 (http://www.postgresql.org/):
  * Configuration:
    * User: postgres
    * Password: postgres (This is just for mutual development settings)
    * Port: 5432
    * Create a database named "DiscAnno"

>**Important**: If you choose another version than 9.3, then put the corresponding JDBC driver in the glassfish4/glassfish/lib folder: https://jdbc.postgresql.org/download.html. Before you deploy the application. If GlassFish is not able to create a connection to the database before you deploy the WebApp you will probably cause a bug in GlassFish named "invalid resource: cannot find jdbc/DiscAnno__pm"!

* Restart the server (Window → Services → Servers → right click on GlassFish 4.1 → restart)
* If you set up everything properly, just right click on the project and press "run".
* The database will be automatically created. To gain access execute the following statement via psql shell or pgAdmin:
 * INSERT INTO users (id, createdate, email, lastname, password, prename, role)
VALUES (1, 2016-01-22 22:23:08.25, admin@web.de, Doe, -2d8bd2605ef266f054a2b774af60ffdd9534c9edec5cba71, John, admin);
* Now you can login with the email "admin@web.de" and "secret" as the password. With the access you can create new users and change your password. The password is hashed, so just inserting the original password would have not worked.
* pgAdmin 3 can be useful: http://www.pgadmin.org/download/
* JSONView Add-Ons for your browser:
  * Can be very handy to have well formatted JSON
  * Firefox: https://addons.mozilla.org/de/firefox/addon/jsonview/
  * Chrome: https://chrome.google.com/webstore/detail/jsonview/chklaanhfefbnpoihckbnefhakgolnmc
  


