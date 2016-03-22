# Welcome to DiscAnno
DiscAnno web-based annotation tool.
![AnnoTool1](https://cloud.githubusercontent.com/assets/7132775/13761225/943137e0-ea37-11e5-832e-e129b086f7fa.jpg)
![AnnoTool2](https://cloud.githubusercontent.com/assets/7132775/13761479/2c65b9cc-ea39-11e5-94e1-b401535a552e.png)

Manage your projects:
![ProjectsExplorer](https://cloud.githubusercontent.com/assets/7132775/13761517/6ae1a760-ea39-11e5-87b2-142d678464c8.png)

Manage your schemes:
![Schemes1](https://cloud.githubusercontent.com/assets/7132775/13761592/dcfb44e6-ea39-11e5-8942-80c7c599d8b5.png)
or easily create a new one:
![Schemes2](https://cloud.githubusercontent.com/assets/7132775/13761593/dd23bc0a-ea39-11e5-95e1-fe99c3943630.png)

## Technologies
* **Frontend**:
  * Bootstrap, HTML, CSS
  * AngularJS, JavaScript
  * D3 for data visualization
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
Please check out the [contributing](https://github.com/annefried/discanno/blob/master/CONTRIBUTING.md) guidelines.

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
    * Create a database named "discanno"
    * If your postgres admin user is different from postgres, grant permission to postgres user on discanno database:
    ````grant all privileges on database discanno to postgres;````


>**Important**: If you choose another version than 9.3, then put the corresponding JDBC driver in the glassfish4/glassfish/lib folder: https://jdbc.postgresql.org/download.html. Before you deploy the application. If GlassFish is not able to create a connection to the database before you deploy the WebApp you will probably cause a bug in GlassFish named "invalid resource: cannot find jdbc/DiscAnno__pm"!

* Restart the server (Window → Services → Servers → right click on GlassFish 4.1 → restart)
* If you set up everything properly, just right click on the project and press "run".
* The database will be automatically created. To gain access execute the following statement via psql shell or pgAdmin:
````
INSERT INTO users (id, createdate, email, lastname, prename, password, role) VALUES (0, localtimestamp, 'admin@discanno.de',
'DiscAnno', 'Admin', '-2d8bd2605ef266f054a2b774af60ffdd9534c9edec5cba71', 'admin');
````
* Now you can login with the email "admin@discanno.de" and "secret" as the password. With the access you can create new users and change your password. The password is hashed, so just inserting the original password would have not worked.
* pgAdmin 3 can be useful: http://www.pgadmin.org/download/
* JSONView Add-Ons for your browser:
  * Can be very handy to have well formatted JSON
  * Firefox: https://addons.mozilla.org/de/firefox/addon/jsonview/
  * Chrome: https://chrome.google.com/webstore/detail/jsonview/chklaanhfefbnpoihckbnefhakgolnmc
  


