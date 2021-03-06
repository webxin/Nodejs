const express=require("express");
const mysql=require("mysql");
module.exports=function(){
    var db=mysql.createPool({"host":"localhost","user":"root","password":"123456","database":"learner"});
    var router=express.Router();
        router.get("/",(req,res)=>{
            var act=req.query.act;
            var id=req.query.id;
            switch(act){
                case "mod":
                    
                    db.query(`SELECT * FROM msg_table WHERE ID=${id}`,(err,data)=>{
                        if(err){
                            res.status(500).send("database iscorrect").end();
                        }else if(data.length==0){
                            res.status(400).send("no id").end();
                        }else{
                            db.query("SELECT * FROM msg_table",(err,banner)=>{
                                if(err){
                                    res.status("500").send("database err").end();
                                }else{
                                    res.render("admin/msg.ejs",{banner:banner,mod_data:data[0]});
                                }
                            })
                        }
                    })
                    break;
                case "del":
                    db.query(`DELETE FROM msg_table WHERE ID=${id} `,(err,data)=>{
                        if(err){
                            res.status(500).send("database iscorrect").end();
                        }else{
                            res.redirect("/admin/msg");
                        }
                    })
                    break;
                default:
                    db.query("SELECT * FROM msg_table",(err,data)=>{
                        if(err){
                            res.status("500").send("database err").end();
                        }else{
                            res.render("admin/msg.ejs",{banner:data});
                        }
                    })
            }
        })
        router.post("/",(req,res)=>{   //插入内容
            var name=req.body.name;
            var email=req.body.email;
            var phone=req.body.phone;
            var subject=req.body.subject;
            var mod_id=req.body.mod_id;
            if(mod_id){                         //修改
                db.query(`UPDATE msg_table SET name="${name}",email="${email}",phone="${phone}",subject="${subject}"  
                    WHERE ID=${mod_id}`,(err,data)=>{
                    if(err){
                        res.status(500).send("database err").end();
                    }else{
                        res.redirect("/admin/msg")
                    }
                });
            }else{                     //插入
                if(!name||!email||!phone||!subject){
                    res.status("400").send("arguments iscorrect");
                    console.log("参数有误");
                }else{
                    db.query(`INSERT INTO msg_table (name,email,phone,subject)
                     VALUES ("${name}","${email}","${phone}","${subject}")`,(err,data)=>{
                        if(err){
                            console.log(err);
                            res.status(500).send("database err").end();
                        }else{
                            res.redirect("/admin/msg")
                        }
                    });
                }
            }
            

        })
    return router;
};