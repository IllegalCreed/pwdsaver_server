var moment = require('moment');
var jwt = require('jsonwebtoken');
var mysql = require('mysql');
var _ = require('lodash');
var mysqlHelper = require('../helper/mysqlHelper.js');

function getPwdList(req, res) {
	var token = req.body.token;
	jwt.verify(token, 'pwdsaver', function (err, decoded) {
		if (err) {
			res.send({ result: false });
			throw error;
		}
		var userId = decoded.userId;

		mysqlHelper.query('SELECT p.id pid, g.id gid ,g.groupname, g.userid, p.key, p.account, p.pwd FROM pwd p RIGHT JOIN `group` g ON p.groupid = g.id WHERE g.userid = ?', [userId], function (error, results, fields) {
			if (error) {
				res.send({ result: false });
				throw error;
			}
			if (results.length > 0) {
				let groupbyGroupid = function (item) {
					return item.gid
				};

				let groupToGroupid = function (value, key) {
					return {
						key: key,
						groupName: value[0].groupname,
						data: value[0].pid ? value : []
					}
				};

				var groupList = _.chain(results)
					.groupBy(groupbyGroupid)
					.map(groupToGroupid)
					.value();
				res.send({ result: true, groupList });
			} else {
				res.send({ result: false });
				return;
			}
		});

	});
}

function addGroup(req, res) {
	var groupName = req.body.groupName;
	var token = req.body.token;
	jwt.verify(token, 'pwdsaver', function (err, decoded) {
		if (err) {
			res.send({ result: false });
			throw error;
		}
		var userId = decoded.userId;

		mysqlHelper.query('INSERT INTO `group` (groupname, userid) VALUES (?, ?)', [groupName, userId], function (error, results, fields) {
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
	});
}

function updateGroup(req, res) {
	var groupId = req.body.groupId;
	var groupName = req.body.groupName;
	var token = req.body.token;
	jwt.verify(token, 'pwdsaver', function (err, decoded) {
		if (err) {
			res.send({ result: false });
			throw error;
		}
		var userId = decoded.userId;

		mysqlHelper.query('UPDATE `group` SET groupname = ? WHERE id = ?', [groupName, groupId], function (error, results, fields) {
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
	});
}

function deleteGroup(req, res) {
	var groupId = req.body.groupId;
	var token = req.body.token;

	jwt.verify(token, 'pwdsaver', function (err, decoded) {
		if (err) {
			res.send({ result: false });
			throw error;
		}
		var userId = decoded.userId;

		var connection = mysql.createConnection(mysqlHelper.connectionParam);
		connection.connect();

		connection.beginTransaction(function (err) {
			if (err) {
				res.send({ result: false });
				throw error;
			}
			connection.query('DELETE FROM `group` WHERE id = ?', groupId, function (error, results, fields) {
				if (error) {
					return connection.rollback(function () {
						res.send({ result: false });
						throw error;
					});
				}

				connection.query('DELETE FROM pwd WHERE groupid = ?', groupId, function (error, results, fields) {
					if (error) {
						return connection.rollback(function () {
							res.send({ result: false });
							throw error;
						});
					}
					connection.commit(function (err) {
						if (err) {
							return connection.rollback(function () {
								res.send({ result: false });
								throw err;
							});
						}
						res.send({ result: true });
					});
				});
			});
		});
	});
}

function addPwd(req, res) {
	var groupId = req.body.groupId;
	var key = req.body.key;
	var account = req.body.account;
	var password = req.body.password;
	var token = req.body.token;
	jwt.verify(token, 'pwdsaver', function (err, decoded) {
		if (err) {
			res.send({ result: false });
			throw error;
		}
		var userId = decoded.userId;

		mysqlHelper.query('INSERT INTO pwd (`key`, account, pwd, groupid) VALUES (?, ?, ?, ?)', [key, account, password, groupId], function (error, results, fields) {
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
	});
}

function updatePwd(req, res) {
	var id = req.body.id;
	var groupId = req.body.groupId;
	var key = req.body.key;
	var account = req.body.account;
	var password = req.body.password;
	var token = req.body.token;
	jwt.verify(token, 'pwdsaver', function (err, decoded) {
		if (err) {
			res.send({ result: false });
			throw error;
		}
		var userId = decoded.userId;

		mysqlHelper.query('UPDATE pwd SET `key` = ?, account = ?, pwd = ?,groupid = ? WHERE id = ?', [key, account, password, groupId, id], function (error, results, fields) {
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
	});
}

function deletePwd(req, res) {
	var id = req.body.id;
	var token = req.body.token;
	jwt.verify(token, 'pwdsaver', function (err, decoded) {
		if (err) {
			res.send({ result: false });
			throw error;
		}
		var userId = decoded.userId;

		mysqlHelper.query('DELETE FROM pwd WHERE id = ?', id, function (error, results, fields) {
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
	});
}

exports.getPwdList = getPwdList;
exports.addGroup = addGroup;
exports.updateGroup = updateGroup;
exports.deleteGroup = deleteGroup;
exports.addPwd = addPwd;
exports.updatePwd = updatePwd;
exports.deletePwd = deletePwd;