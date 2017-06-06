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
                    db.query(`SELECT * FROM contact_table WHERE ID=${id}`,(err,data)=>{
                        if(err){
                            res.status(500).send("database iscorrect").end();
                        }else if(data.length==0){
                            res.status(400).send("no id").end();
                        }else{
                            db.query("SELECT * FROM contact_table",(err,banner)=>{
                                if(err){
                                    res.status("500").send("database err").end();
                                }else{
                                    res.render("admin/contact.ejs",{banner:banner,mod_data:data[0]});
                                }
                            })
                        }
                    })
                    break;
                case "del":
                    db.query(`DELETE FROM contact_table WHERE ID=${id} `,(err,data)=>{
                        if(err){
                            res.status(500).send("database iscorrect").end();
                        }else{
                            res.redirect("/admin/contact");
                        }
                    })
                    break;
                default:
                    db.query("SELECT * FROM contact_table",(err,data)=>{
                        if(err){
                            res.status("500").send("database err").end();
                        }else{
                            res.render("admin/contact.ejs",{banner:data});
                        }
                    })
            }
        })
        router.post("/",(req,res)=>{   //插入内容

            var street=req.body.street;
            var phone=req.body.phone;
            var fax=req.body.fax;
            var email=req.body.email;
            var weibo=req.body.weibo;
            var wx=req.body.wx;
            var mod_id=req.body.mod_id;

            if(mod_id){                         //修改
                db.query(`UPDATE contact_table SET street="${street}",phone="${phone}",fax="${fax}",email="${email}",weibo="${weibo}",wx="${wx}"
                    WHERE ID=${mod_id}`,(err,data)=>{
                    if(err){
                        res.status(500).send("database err").end();
                    }else{
                        res.redirect("/admin/contact")
                    }
                });
            }else{                     //插入
                if(!street||!phone||!fax||!email||!weibo||!wx){
                    res.status("400").send("arguments iscorrect");
                    console.log("参数有误");
                }else{
                    db.query(`INSERT INTO contact_table (street,phone,fax,email,weibo,wx)
                     VALUES ("${street}","${phone}","${fax}","${email}","${weibo}","${wx}")`,(err,data)=>{
                        if(err){
                            res.status(500).send("database err").end();
                        }else{
                            res.redirect("/admin/contact")
                        }
                    });
                }
            }
            

        })
    return router;
};
