var express = require('express');
var router = express.Router();
var userapi = require('./api/user.js');
var pwdapi = require('./api/pwd.js');

router.get('/', function (req, res) {
	res.send({ welcome: 'welcome to pwdsaver server!' })
})

router.post('/user/regist',userapi.regist);
router.post('/user/login',userapi.login);

router.post('/pwd/pwdList/get',pwdapi.getPwdList);
router.post('/pwd/group/add',pwdapi.addGroup);
router.post('/pwd/group/update',pwdapi.updateGroup);
router.post('/pwd/group/delete',pwdapi.deleteGroup);
router.post('/pwd/pwd/add',pwdapi.addPwd);
router.post('/pwd/pwd/update',pwdapi.updatePwd);
router.post('/pwd/pwd/delete',pwdapi.deletePwd);

module.exports = router;