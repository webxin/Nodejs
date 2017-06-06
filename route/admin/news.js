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
                    
                    db.query(`SELECT * FROM news_table WHERE ID=${id}`,(err,data)=>{
                        if(err){
                            res.status(500).send("database iscorrect").end();
                        }else if(data.length==0){
                            res.status(400).send("no id").end();
                        }else{
                            db.query("SELECT * FROM news_table",(err,banner)=>{
                                if(err){
                                    res.status("500").send("database err").end();
                                }else{
                                    res.render("admin/news.ejs",{banner:banner,mod_data:data[0]});
                                }
                            })
                        }
                    })
                    break;
                case "del":
                    db.query(`DELETE FROM news_table WHERE ID=${id} `,(err,data)=>{
                        if(err){
                            res.status(500).send("database iscorrect").end();
                        }else{
                            res.redirect("/admin/news");
                        }
                    })
                    break;
                default:
                    db.query("SELECT * FROM news_table",(err,data)=>{
                        if(err){
                            res.status("500").send("database err").end();
                        }else{
                            res.render("admin/news.ejs",{banner:data});
                        }
                    })
            }
        })
        router.post("/",(req,res)=>{   //插入内容
            var title=req.body.title;
            var summary=req.body.summary;
            var ico_src=req.body.ico_src;
            var big_pic_src=req.body.big_pic_src;
            var content=req.body.content;
            var mod_id=req.body.mod_id;
            if(mod_id){                         //修改
                db.query(`UPDATE news_table SET title="${title}",summary="${summary}",ico_src="${ico_src}",big_pic_src="${big_pic_src}",content="${content}"
                    WHERE ID=${mod_id}`,(err,data)=>{
                    if(err){
                        res.status(500).send("database err").end();
                    }else{
                        res.redirect("/admin/news")
                    }
                });
            }else{                     //插入
                if(!title||!summary||!ico_src||!big_pic_src||!content){
                    res.status("400").send("arguments iscorrect");
                    console.log("参数有误");
                }else{
                    db.query(`INSERT INTO news_table (title,summary,ico_src,big_pic_src,content)
                     VALUES ("${title}","${summary}","${ico_src}","${big_pic_src}","${content}")`,(err,data)=>{
                        if(err){
                            res.status(500).send("database err").end();
                        }else{
                            res.redirect("/admin/news")
                        }
                    });
                }
            }
            

        })
    return router;
};