-- File for Password Management section of Final Project

-- (Provided) This function generates a specified number of characters for using as a
-- salt in passwords.
DELIMITER !
CREATE FUNCTION make_salt(num_chars INT) RETURNS VARCHAR(20) NOT DETERMINISTIC
BEGIN
    DECLARE salt VARCHAR(20) DEFAULT '';

    -- Don't want to generate more than 20 characters of salt.
    SET num_chars = LEAST(20, num_chars);

    -- Generate the salt!  Characters used are ASCII code 32 (space)
    -- through 126 ('z').
    WHILE num_chars > 0 DO
        SET salt = CONCAT(salt, CHAR(32 + FLOOR(RAND() * 95)));
        SET num_chars = num_chars - 1;
    END WHILE;

    RETURN salt;
END !
DELIMITER ;


-- [Problem 1a]
-- Adds a new user to the user_info table, using the specified password (max
-- of 20 characters). Salts the password with a newly-generated salt value,
-- and then the salt and hash values are both stored in the table.
DELIMITER !
CREATE PROCEDURE sp_add_user(new_username VARCHAR(20), password VARCHAR(20),
                             first_name VARCHAR(30), last_name VARCHAR(30),
                             email VARCHAR(30))
BEGIN
    DECLARE salt CHAR(8);
    DECLARE salted_password CHAR(28);
    DECLARE password_hash BINARY(64);
    -- Generate a new salt
    SELECT make_salt(8) INTO salt;
    
    SET salted_password = CONCAT(salt, password);

    -- use SHA-2 function to generate hash from salted password concatenation
    SELECT SHA2(salted_password, 256) AS password_hash INTO password_hash;
    
    -- Add new record to user_info tables with username, salt, and 
    -- salted password
    INSERT INTO users(username, salt, password_hash, first_name, last_name, email)
        VALUES (new_username, salt, password_hash, first_name, last_name, email);
END !
DELIMITER ;
