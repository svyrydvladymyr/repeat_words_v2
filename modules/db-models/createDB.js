const tables = {
    users: `CREATE TABLE users (id INT AUTO_INCREMENT PRIMARY KEY,
        userid VARCHAR(100) NOT NULL UNIQUE,
        ava VARCHAR(255) DEFAULT '', 
        name VARCHAR(80) NOT NULL, 
        surname VARCHAR(80) NOT NULL,
        email VARCHAR(120) DEFAULT '',
        provider VARCHAR(40) DEFAULT '',
        token VARCHAR(20) DEFAULT '',
        permission VARCHAR(10) DEFAULT 'user',
        registered DATETIME
        )`,
    settings: `CREATE TABLE settings (id INT AUTO_INCREMENT PRIMARY KEY,
        userid VARCHAR(100) NOT NULL UNIQUE,
        birthday DATE,
        gender VARCHAR(11) DEFAULT '',
        emailverified VARCHAR(10) DEFAULT 'false',   
        emailverifiedlink VARCHAR(300) DEFAULT '',     
        localization VARCHAR(20) DEFAULT 'en-US',
        language VARCHAR(20) DEFAULT 'none',
        voice VARCHAR(60) DEFAULT 'Google UK English Female',                   
        speed VARCHAR(40) DEFAULT '1', 
        pitch VARCHAR(40) DEFAULT '1',            
        color VARCHAR(20) DEFAULT 'blue'
        )`,
    words: `CREATE TABLE words (id INT AUTO_INCREMENT PRIMARY KEY,
        wordid VARCHAR(20) NOT NULL UNIQUE,
        word VARCHAR(150) NOT NULL
        )`,
    wordsettings: `CREATE TABLE wordsettings (id INT AUTO_INCREMENT PRIMARY KEY,
        wordid VARCHAR(20) NOT NULL,
        translation VARCHAR(100) NOT NULL,
        lang VARCHAR(10) NOT NULL,
        created_by VARCHAR(100) NOT NULL,
        created_date DATETIME
        )`,
    lists: `CREATE TABLE lists (id INT AUTO_INCREMENT PRIMARY KEY,
        listid VARCHAR(20) NOT NULL UNIQUE,
        list VARCHAR(150) NOT NULL,
        list_type VARCHAR(100) NOT NULL,
        list_permission VARCHAR(10),
        created_by VARCHAR(100) NOT NULL,
        updated_date DATETIME,
        created_date DATETIME
        )`,
    wordinlist: `CREATE TABLE wordinlist (id INT AUTO_INCREMENT PRIMARY KEY,
        listid VARCHAR(20) NOT NULL,
        wordid VARCHAR(20) NOT NULL
        )`,
    useractions : `CREATE TABLE useractions (id INT AUTO_INCREMENT PRIMARY KEY,
        userid VARCHAR(100) NOT NULL
        )`
};

const rule = {
    admin: `UPDATE users SET permission='1' WHERE email='svyrydvladymyr@gmail.com'`
};


class CreteTables {
    constructor(con){ this.con = con }
    query(type, name) {
        this.con.query( {tables, rule }[type][name],
            function (error, result) {
                error
                    ? console.log(`ERROR: ${error.sqlMessage}`)
                    : console.log(`${type.charAt(0).toUpperCase() + type.slice(1)} '${name}' created!`);
            }
        );
    }
    table(name) { this.query('tables', name) };
    rule(name) { this.query('rule', name) };
};

module.exports = new CreteTables(require('./connectDB').con);