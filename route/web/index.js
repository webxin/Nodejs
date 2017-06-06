const express=require("express");
const mysql=require("mysql");
module.exports=function(){
    var db=mysql.createPool({"host":"localhost","user":"root","password":"123456","database":"learn"});
	var router=express.Router();
	router.get("/get_banner",(req,res)=>{
		db.query("SELECT * FROM banner_table",(err,data)=>{
            if(err){
                console.log(err);
                res.status(500).send("database err").end();
            }else{
                res.send(data).end();
            }
        });
	});
    router.get("/get_custom",(req,res)=>{
        db.query("SELECT * FROM custom_evaluation_table",(err,data)=>{
            if(err){
                console.log(err);
                res.status(500).send("database err").end();
            }else{
                 res.send(data).end();
            }
        });
    });
	return router;
}