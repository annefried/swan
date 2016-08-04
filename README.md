# Welcome to SWAN
SWAN is a web-based system for natural language annotation.
Its key features are:
* support of discourse annotation (i.e., annotation of complete texts) by allowing to scroll through the entire document
* focus on usability for limited tag sets (quick selection)
* a graph visualization box showing the discourse structure of the document
* performs fast with large documents

Check out the [GitHub Wiki](https://github.com/annefried/swan/wiki) for more information on functionality and setup!

Want to try it out?
Find our web demo [here](http://swan.coli.uni-saarland.de).


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
  * Frontend:
    * Karma
    * Jasmine
  * Backend:
    * JUnit 4.12
    * Mockito 1.9.5
    * h2 as local testing database
    * JaCoCo for report generation

## Contact
We are happy to hear from you!
If you love SWAN, send us an email.
If you find some bugs or if you have suggestions for improvements, please open an issue on this GitHub site!

SWAN was developed by:
* Timo Gühring (Saarland University, Department of Computer Science)
* Nicklas Linz (German Research Center for Artificial Intelligence (DFKI GmbH), nicklas.linz@dfki.de)
* Rafael Theis (Saarland University, Department of Computer Science)
* Annemarie Friedrich (Saarland University, Department of Computational Linguistics, afried@coli.uni-saarland.de)
* Julia Dembowski (Saarland University, Department of Computational Linguistics)
* Stefan Grünewald (Saarland University, Department of Computational Linguistics)
* Janna Herrmann (Saarland University, Department of Computer Science)


