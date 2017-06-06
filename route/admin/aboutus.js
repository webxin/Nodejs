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
                    
                    db.query(`SELECT * FROM aboutus_table WHERE ID=${id}`,(err,data)=>{
                        if(err){
                            res.status(500).send("database iscorrect").end();
                        }else if(data.length==0){
                            res.status(400).send("no id").end();
                        }else{
                            db.query("SELECT * FROM aboutus_table",(err,banner)=>{
                                if(err){
                                    res.status("500").send("database err").end();
                                }else{
                                    res.render("admin/aboutus.ejs",{banner:banner,mod_data:data[0]});
                                }
                            })
                        }
                    })
                    break;
                case "del":
                    db.query(`DELETE FROM aboutus_table WHERE ID=${id} `,(err,data)=>{
                        if(err){
                            res.status(500).send("database iscorrect").end();
                        }else{
                            res.redirect("/admin/aboutus");
                        }
                    })
                    break;
                default:
                    db.query("SELECT * FROM aboutus_table",(err,data)=>{
                        if(err){
                            res.status("500").send("database err").end();
                        }else{
                            res.render("admin/aboutus.ejs",{banner:data});
                        }
                    })
            }
        })
        router.post("/",(req,res)=>{   //插入内容
            var title=req.body.title;
            var content=req.body.content;
            var pic_src=req.body.pic_src;
            var href=req.body.href;
            var mod_id=req.body.mod_id;
            if(mod_id){                         //修改
                db.query(`UPDATE aboutus_table SET title="${title}",content="${content}",pic_src="${pic_src}",href="${href}" 
                    WHERE ID=${mod_id}`,(err,data)=>{
                    if(err){
                        res.status(500).send("database err").end();
                    }else{
                        res.redirect("/admin/aboutus")
                    }
                });
            }else{                     //插入
                if(!title||!content||!pic_src||!href){
                    res.status("400").send("arguments iscorrect");
                    console.log("参数有误");
                }else{
                    db.query(`INSERT INTO aboutus_table (title,content,pic_src,href)
                     VALUES ("${title}","${content}","${pic_src}","${href}")`,(err,data)=>{
                        if(err){
                            res.status(500).send("database err").end();
                        }else{
                            res.redirect("/admin/aboutus")
                        }
                    });
                }
            }
            

        })
    return router;
};