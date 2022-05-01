## **Cyclos**
-------------------------------------------------------------------------------

**Cyclos is an online and mobile payment system.**

- The Cyclos license information is published in the license folder in the distribution archive, as well as the licenses for libraries and icons used in Cyclos.

- To run Cyclos, a license key is needed. STRO offers free, social and commercial licenses. The licenses can be requested through the license management servers, at https://license.cyclos.org

---

Requirements
-------------------------------------------------------------------------------
* Java 11 or higher (either Oracle (tm) or OpenJDK are fine)
* Tomcat 8.5 or higher (or other Servlet 3.1+ compliant application server)
* PostgreSQL 9.6 or higher (however, it is recommended to use the latest release)
* PostGIS 2.1 or higher (however, it is recommended to use the latest release)

--- 

Installation
-------------------------------------------------------------------------------
* After all requirements are installed, you can proceed to the Cyclosweb application installation.

* The cyclos-x.x.x/web folder in the distribution archive contains all files which should be deployed on the application server. For example, in Tomcat, it can be copied into <tomcat>/webapps/cyclos (make sure to not have still a web folder inside it, but all files inside the web folder directly into the deploy folder). In this example, the application will be available at <Tomcat Server URL>/cyclos. For Cyclos to be on the root URL on the server, you will need to remove all folders in <tomcat>/webapps, and then copy the web folder to <tomcat>/webapps/ROOT.  

* On the web/WEB-INF/classes file you'll find the cyclos-release.properties. The first thing to do is to copy it with the name cyclos.properties. The original name is not shipped, so in future installations, you can just override the entire folder, and your customizations won't be overwritten.

In the cyclos.properties file, you can customize several settings, but pay special attention to the following:
* cyclos.datasource.jdbcUrl: PostgreSQL server location
* cyclos.datasource.user: Database username
* cyclos.datasource.password: Database password

---
  
Be aware that Cyclos is server-side software. End-users (customers) will be able to access Cyclos directly with a web browser or mobile phone. If you have any problems when installing Cyclos using this manual, you can ask for help at our forum.

Cyclos can be installed on a tomcat server or inside a docker container.
  
---
  
## Install Cyclos using Tomcat System requirements 
  * Operation system: Any OS that can run the Java VM like Windows, Linux, FreeBSD or Mac; 
  * Make sure you have at least 1GB of memory available for Cyclos; 
  * Java Runtime Environment (JRE), Java 11 is required; 
  * Web server: Apache Tomcat 8.5 or 9.0. Tomcat 10+ implements Jakarta EE 10, which is not compatible; 
  * Database server: PostgreSQL 9.6 or higher;

Install Java You can check if you have Java installed at this site: http://java.com/en/download/installed.jsp If you don't have Java 11 installed then install it.

Install PostgreSQL (database)

Setup cyclos4 database (common steps for Windows and Linux) 
  * Create a database user and password. This password and username you will have to enter in the cyclos.properties file in step 5. Type in the PostgreSQL command line: CREATE USER cyclos WITH ENCRYPTED PASSWORD 'cyclos-password'; 
  * Create the database cyclos4, type in the PostgreSQL command line: CREATE DATABASE cyclos4 ENCODING 'UTF-8' TEMPLATE template0 OWNER cyclos; 
  * Create the PostGIS and unaccent extensions on the database, type in the PostgreSQL command line: \c cyclos4 create extension cube; create extension earthdistance; create extension postgis; create extension unaccent; 
  * Exit the PostgreSQL command line by entering "\q" (and pressing enter).

Install Tomcat (web server)
  * Download Tomcat (8.5 or greater) at http://tomcat.apache.org/ 
  * Extract the zipped tomcat file into a folder . 
  * Start tomcat: /bin/startup.bat (Windows) or /bin/startup.sh (Linux). You might have to give the startup script file execute permissions. 
  * Open a browser and go to http://localhost:8080/ and check if tomcat is working. 
  * The default memory heap size of Tomcat is very low, we recommend increasing it (see adjustments).

Install Cyclos Make sure Tomcat is working on port 8080 of the local machine (if you don't run Tomcat as root/admin make sure that the user has to write access to the webapps directory) 
  * Download the latest version of Cyclos from the license server. To download Cyclos from the license server you first have to register on the license server. Registering at the license server allows you to use the free version of Cyclos. Please write down the loginname and the password you chose when registering for the license server (it will be needed later on). 
  * Unzip the cyclos-version.zip into a temporary directory. 
  * Browse to the temporary directory and copy the directory web (including its contents) into the webapps directory (/webapps) of the tomcat installation. 
  * Rename this web directory to cyclos. This name will define how users access Cyclos. For example, if you run the tomcat server on www.domain.com the URL would be http://www.domain.com/cyclos. Of course it is also possible to run Cyclos directly under the domain name. This can be done by extracting Cyclos in the (/ROOT) directory (remove all files on it first), or putting an Apache web server in front of the Tomcat serer. 
  * In the folder /webapps/cyclos/WEB-INF/classes you'll find the file cyclosrelease.properties. The first thing to do is to copy this file and give it the name cyclos.properties. The original name is not shipped, so in future installations you can just override the entire folder, and your customizations won't be overwritten.   * In the cyclos.properties file you can set the database configuration, here you have to specify the username and password, by default we use 'cyclos4' as database name and 'cyclos' as username and password. For production, it is recommended to change the password *. cyclos.datasource.jdbcUrl = jdbc:postgresql://localhost/cyclos4 cyclos.datasource.user = cyclos cyclos.datasource.password = cyclos

---
  
## **Startup Cyclos**
  * (Re)start tomcat: • Stop trough /bin/stop.bat (Windows) or /bin/stop.sh (Linux). 
  * Start trough /bin/startup.bat (Windows) or /bin/ startup.sh (Linux). 
  * Windows: you can use the Tomcat monitor (available after tomcat installaton) 
  * When tomcat is started and Cyclos initialized browse to the web directory defined in step 5 (for the default this would be http://localhost:8080/cyclos). 
  
Be aware starting up Cyclos for the first time might take quite some time, because the database need to be initialized.

On a slow computer, this could take up to 3 minutes! • Upon the first start of Cyclos you will be asked to fill in the license information. • After submitting the correct information, the initialization process will finish, and you will automatically log in as a (global) administrator.

---
  
## STEPS TO RUN DIRECTLY THROUGH THE LINK (FOR CUSTOMERS)
  1. Go to URL: https://demo.cyclos.org/ui/users/registration 
  2. Register on the page, after registering you will receive a verification email, verify your email id by clicking the here option in your email. 
  3. You will be redirected to the login page https://demo.cyclos.org/ui/login 
  4. You will be logged in and you can try and experience the features made as per customer-centric requirements,
