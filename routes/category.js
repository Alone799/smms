var express = require('express');
var router = express.Router();

//引入数据库链接模块
var connection=require("./mysqlConn");

/* 添加商品分类的路由 */
router.post('/add', function(req, res, next) {
  //后端路由接收前端的数据
  let {cg_fatherID,cg_name,cg_isLocked}=req.body;

  //链接数据库，把数据库写入数据库
  //定义sql语句
  let sqlStr="insert into categoryGoods(cg_fatherID,cg_name,cg_isLocked) values(?,?,?)"; //占位符
  let sqlParams=[cg_fatherID,cg_name,cg_isLocked]; //参数数组
  //执行sql语句
  connection.query(sqlStr,sqlParams, function (error, results) {
    if (error) throw error; //出错对象
    //4. 返回处理的结果到前端
    //根据执行sql语句的结果返回json给前端
    //"affectedRows":1, 返回受影响的行数，如果大于0就表示成功
    if(results.affectedRows>0){
      res.send({"isOk":true,"msg":"分类添加成功!"});
    }
    else{
      res.send({"isOk":false,"msg":"分类添加失败!"});
    }
  });
});

// 获取商品分类列表的路由
router.get("/list",(req,res)=>{
   //构造sql
   let sqlStr="select * from categoryGoods order by cg_id DESC";

   //执行sql
   connection.query(sqlStr,(err,categoryList)=>{
      if(err) throw err;
      res.send(categoryList);
   });
});

// 删除商品分类的路由
router.get("/del",(req,res)=>{
   res.send("删除分类");
});

//3）接收新的数据并把新的数据update到数据库中
router.post('/save', function(req, res, next) {
   res.send("保存分类");
});

module.exports = router;
