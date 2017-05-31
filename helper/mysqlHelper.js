var mysql = require('mysql');

var connectionParam = {
	host: 'rm-2ze67y67mo7mvlz84o.mysql.rds.aliyuncs.com',
	user: 'root',
	password: 'zxZX01021989',
	database: 'pwdsaver'
}

function query(sql, param, callback) {
	var connection = mysql.createConnection(connectionParam);
	connection.connect();

	connection.query(sql, param, callback);

	connection.end();
}

exports.connectionParam = connectionParam;
exports.query = query;