var express = require('express');
var router = express.Router();

//引入crypto模块
var md5=require("crypto");

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

/* 添加用户的路由 */
router.post('/add', function(req, res, next) {
  //2. 后端路由接收前端的数据
  let {pass,username,region}=req.body;

  //对密码进行md5加密
  pass=md5.createHash("md5").update(pass).digest("hex");

  //3. 链接数据库，把数据库写入数据库
  //定义sql语句
  //let sqlStr=`insert into userTable(userName,userPwd,userGroup) values('${username}','${pass}','${region}')`;
  let sqlStr="insert into userTable(userName,userPwd,userGroup) values(?,?,?)"; //占位符
  let sqlParams=[username,pass,region]; //参数数组
  //执行sql语句
  connection.query(sqlStr,sqlParams, function (error, results) {
    if (error) throw error; //出错对象

    if(results.affectedRows>0){
      res.send({"isOk":true,"msg":"账号添加成功!"});
    }
    else{
      res.send({"isOk":false,"msg":"账号添加失败!"});
    }
  });
});

// 获取用户列表的路由
router.get("/list",(req,res)=>{
   //1. 构造sql语句
   let sqlStr="select * from userTable order by u_id DESC";

   //2. 执行sql语句
   connection.query(sqlStr,function (error,userlist) {
     if (error) throw error; //出错后面的代码不执行
     //3. 返回查询的结果到前端（对象数组）
     res.send(userlist);
   });
});

// 删除用户的路由
router.get("/del",(req,res)=>{
   //3. 后端路由接收删除的id 返回结果到前端
   let id=req.query.id;

   //构造sql语句
   let sqlStr="delete from userTable where u_id=?";
   let sqlParams=[id];

   //执行删除sql
   connection.query(sqlStr,sqlParams,(error,result)=>{
     if(error) throw error;
     //"affectedRows":1, 返回受影响的行数，如果大于0就表示成功
     if(result.affectedRows>0){
       res.send({"isOk":true,"msg":"账号删除成功!"});
       //res.redirect("member_list.html");  后端没有分离的做法【不推荐】
     }
     else{
       res.send({"isOk":false,"msg":"账号删除失败!"});
     }
   });
});


// 根据id获取用户数据的路由
router.get("/getUserByID",(req,res)=>{
  //1. 接收用户id
  let id=req.query.id;
  
  //2. 构造sql语句
  let sqlStr="select * from userTable where u_id=?";
  let sqlParams=[id];

  //3. 执行sql语句
  connection.query(sqlStr,sqlParams,function (error,userData) {
    if (error) throw error; //出错后面的代码不执行
    //4. 返回查询的结果到前端（对象数组）
    res.send(userData);
  });
});

//3）接收新的数据并把新的数据update到数据库中
router.post('/save', function(req, res, next) {
  //2. 后端路由接收前端的数据
  let {pass,username,region,u_id,oldPwd}=req.body;
  let newPass=pass; //只是为了名字更醒目

  //对新旧密码进行比较，如果不等就密码已修改，对新的密码进行md5加密
  if(oldPwd!=newPass){
    pass=md5.createHash("md5").update(newPass).digest("hex");
  }

  //3. 链接数据库，把数据库写入数据库
  //定义sql语句;
  let sqlStr="update userTable set userName=?,userPwd=?,userGroup=? where u_id=?"; //占位符
  let sqlParams=[username,pass,region,u_id]; //参数数组
  //执行sql语句
  connection.query(sqlStr,sqlParams, function (error, results) {
    if (error) throw error; //出错对象
    //4. 返回处理的结果到前端
    //根据执行sql语句的结果返回json给前端
    //"affectedRows":1, 返回受影响的行数，如果大于0就表示成功
    if(results.affectedRows>0){
      res.send({"isOk":true,"msg":"账号修改成功!"});
    }
    else{
      res.send({"isOk":false,"msg":"账号修改失败!"});
    }
  });
});

module.exports = router;