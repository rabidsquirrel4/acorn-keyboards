Ran using mysql 8.0.33 for Ubuntu Linux.
Ubuntu instructions
-------------------
Please start a mysql server by running the following command:

    sudo mysql

Or run whatever command allows you to run mysql as the root user.

Then, run the following lines in mysql:

    SET GLOBAL log_bin_trust_function_creators = 1;
    source grant-permissions.sql
    source setup.sql
    source setup-passwords.sql
    source load-data.sql

Note: Currently mysql 8.0 uses caching_sha2_password by default to authenticate
    users, since this is more secure. Unfortunately, the mysqljs node package 
    and therefore also the promise-mysql package do not support the new default
    user authentication method. Thus, you have to downgrade the authetication 
    method for the user that will be used in mysql.createConnection before 
    running our API server. 

    I got this information from the following stack overflow post:
    https://stackoverflow.com/questions/50093144/mysql-8-0-client-does-not-support-authentication-protocol-requested-by-server/50131831#50131831

Then, run:
    npm install
to install all node modules. 
You should now be able to run the server:
    node app.js

Then go to:
    localhost:8000
to see the website. Happy scrolling!

To close node app:
