var moment = require('moment');
var jwt = require('jsonwebtoken');
var secureHelper = require('../helper/secureHelper.js');
var mysqlHelper = require('../helper/mysqlHelper.js');

function regist(req, res) {
	var username = req.body.username;
	var password = req.body.password;

	secureHelper.hashPassword(password, (err, combined) => {
		mysqlHelper.query('INSERT INTO user (username, password) VALUES (?, ?)', [username, combined], function (error, results, fields) {
			if (error) {
				res.send({ result: false });
				throw error;
			}
			if (results.affectedRows > 0) {
				res.send({ result: true });
				return;
			} else {
				res.send({ result: false });
				return;
			}
		})
	})
}

function login(req, res) {
	var username = req.body.username;
	var password = req.body.password;

	mysqlHelper.query('SELECT * FROM user WHERE username = ?', [username], function (error, results, fields) {
		if (error) {
			res.send({ result: false });
			throw error;
		}
		if (results.length > 0) {
			secureHelper.verifyPassword(password, results[0].password, (err, result) => {
				if (result) {
					var token = jwt.sign({
						userId: results[0].id
					}, 'pwdsaver', { expiresIn: '7d' });
					res.send({ result: true, token });
					return
				} else {
					res.send({ result: false });
					return;
				}
			})
		} else {
			res.send({ result: false });
			return;
		}
	});
}

exports.regist = regist;
exports.login = login;