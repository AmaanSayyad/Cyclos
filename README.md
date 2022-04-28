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
