const mysql = require('mysql')

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'md_club'
})

connection.connect(function(err) {
    if (err) throw err;
});

module.exports = connection;