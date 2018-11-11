//1 引入mysql模块
var mysql= require('mysql');

//2 链接数据库
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'smms'
});

//3 打开数据库链接
connection.connect();

//暴露模块
module.exports=connection;