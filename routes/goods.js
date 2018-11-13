var express = require('express');
var router = express.Router();

//引入数据库链接模块
var connection=require("./mysqlConn");

/* 添加商品的路由 */
router.post('/add', function(req, res, next) {
  //后端路由接收前端的数据
  let {cg_id,barcode,goodsname,goodsprice,marketprice,saleprice,stockNum,weigth,unit,promotion,discount,goodsDetails}=req.body;

  //链接数据库，把数据库写入数据库
  //定义sql语句
  let sqlStr="insert into goodsTable(cg_id,barcode,goodsname,goodsprice,marketprice,saleprice,stockNum,weigth,unit,promotion,discount,goodsDetails) values(?,?,?,?,?,?,?,?,?,?,?,?)"; //占位符
  let sqlParams=[cg_id,barcode,goodsname,goodsprice,marketprice,saleprice,stockNum,weigth,unit,promotion,discount,goodsDetails]; //参数数组
  //执行sql语句
  connection.query(sqlStr,sqlParams, function (error, results) {
    if (error) throw error; //出错对象
    //返回处理的结果到前端
    //"affectedRows":1, 返回受影响的行数，如果大于0就表示成功
    if(results.affectedRows>0){
      res.send({"isOk":true,"msg":"商品信息添加成功!"});
    }
    else{
      res.send({"isOk":false,"msg":"商品信息失败!"});
    }
  });
});

// 获取商品列表的路由
router.get("/list",(req,res)=>{
   //构造sql
   let sqlStr="select t1.*,t2.cg_name from goodsTable as t1 left join categorygoods as t2 on t1.cg_id=t2.cg_id";

   //执行sql
   connection.query(sqlStr,(err,categoryList)=>{
      if(err) throw err;
      res.send(categoryList);
   });
});

// 获取商品的分页+查询数据信息【分页+查询的合并】
router.get("/listPagerSearch",(req,res)=>{
  //接收页码\每页大小\关键词\分类id
  let {currentPage,pageSize,keywords,category}=req.query;
  
  //构造sql
  let sqlStr="select t1.*,t2.cg_name from goodsTable as t1 left join categorygoods as t2 on t1.cg_id=t2.cg_id where 1=1";

  //全表
  //执行全表sql查询：获取总的记录条数
  connection.query(sqlStr,(err,goodsList)=>{
     if(err) throw err;
     let total=goodsList.length; //总条数

    //查询
    //关键词
    if(keywords.length>0){
      sqlStr+=` and (t1.barcode like '%${keywords}%' or t1.goodsname like '%${keywords}%')`;
    }

    //分类
    if(category.length>0){
      sqlStr+=` and cg_id=${category}`;
    }

    //执行查询的sql结果
    if(keywords.length>0 || category.length>0){
      connection.query(sqlStr,(err,searchList)=>{
          if(err) throw err;
          
          //修改原来的总记录为查询后的记录数
          total=searchList.length;
      });
    }
    


     //分页
     //定义分页参数数组
     let skip=(currentPage - 1)*pageSize; //跳过的条数
     let sqlParams=[skip,parseInt(pageSize)];
     sqlStr+=" limit ?,?";

     //执行查询当前页码应该显示的分页数据
     connection.query(sqlStr,sqlParams,(err,goodsPager)=>{
        if(err) throw err;
        res.send({"total":total,"datalist":goodsPager});
     });
  });
});

// 删除用户的路由
router.get("/del",(req,res)=>{
  //后端路由接收删除的id 返回结果到前端
  let id=req.query.id;

  //构造sql语句
  let sqlStr="delete from goodstable where cg_id=?";
  let sqlParams=[id];

  //执行删除sql
  connection.query(sqlStr,sqlParams,(error,result)=>{
    if(error) throw error;
    //"affectedRows":1, 返回受影响的行数，如果大于0就表示成功
    if(result.affectedRows>0){
      res.send({"isOk":true,"msg":"账号删除成功!"});
      
    }
    else{
      res.send({"isOk":false,"msg":"账号删除失败!"});
    }
  });
});

module.exports = router;
