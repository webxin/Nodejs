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
                    
                    db.query(`SELECT * FROM blog_table WHERE ID=${id}`,(err,data)=>{
                        if(err){
                            res.status(500).send("database iscorrect").end();
                        }else if(data.length==0){
                            res.status(400).send("no id").end();
                        }else{
                            db.query("SELECT * FROM blog_table",(err,banner)=>{
                                if(err){
                                    res.status("500").send("database err").end();
                                }else{
                                    res.render("admin/blog.ejs",{banner:banner,mod_data:data[0]});
                                }
                            })
                        }
                    })
                    break;
                case "del":
                    db.query(`DELETE FROM blog_table WHERE ID=${id} `,(err,data)=>{
                        if(err){
                            res.status(500).send("database iscorrect").end();
                        }else{
                            res.redirect("/admin/blog");
                        }
                    })
                    break;
                default:
                    db.query("SELECT * FROM blog_table",(err,data)=>{
                        if(err){
                            res.status("500").send("database err").end();
                        }else{
                            res.render("admin/blog.ejs",{banner:data});
                        }
                    })
            }
        })
        router.post("/",(req,res)=>{   //插入内容
            var title=req.body.title;
            var pic_src=req.body.pic_src;
            var pic_big_src=req.body.pic_big_src;
            var summary=req.body.summary;
            var content=req.body.content;
            var post_time=req.body.post_time;
            var author=req.body.author;
            var n_view=req.body.n_view;
            var mod_id=req.body.mod_id;
            if(mod_id){                         //修改
                db.query(`UPDATE blog_table SET title="${title}",pic_src="${pic_src}",pic_big_src="${pic_big_src}",
                    summary="${summary}",content="${content}" ,post_time="${post_time}",author="${author}",n_view="${n_view}" 
                    WHERE ID=${mod_id}`,(err,data)=>{
                    if(err){
                        res.status(500).send("database err").end();
                    }else{
                        res.redirect("/admin/blog")
                    }
                });
            }else{                     //插入
                if(!title||!pic_src||!pic_big_src||!summary||!content||!post_time||!author||!n_view){
                    res.status("400").send("arguments iscorrect");
                    console.log("参数有误");
                }else{
                    db.query(`INSERT INTO blog_table (title,pic_src,pic_big_src,summary,content,post_time,author,n_view)
                     VALUES ("${title}","${pic_src}","${pic_big_src}","${summary}","${content}","${post_time}","${author}","${n_view}")`,(err,data)=>{
                        if(err){
                            res.status(500).send("database err").end();
                        }else{
                            res.redirect("/admin/blog")
                        }
                    });
                }
            }
            

        })
    return router;
};