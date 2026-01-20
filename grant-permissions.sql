DROP USER 'appadmin'@'localhost';
CREATE USER 'appadmin'@'localhost' IDENTIFIED BY 'adminpw';
/* 
 Code snippet taken from:
    https://stackoverflow.com/questions/50093144/mysql-8-0-client-does-not-support-authentication-protocol-requested-by-server/50131831#50131831
 Need this line for permissions issues with node packages in mysql 8, see readme.txt for more details
 */
ALTER USER 'appadmin'@'localhost' IDENTIFIED WITH mysql_native_password BY 'adminpw';

GRANT ALL PRIVILEGES ON productsdb.* TO 'appadmin'@'localhost';
FLUSH PRIVILEGES;
