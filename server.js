const express=require("express");
const static=require("express-static");
const mysql=require("mysql");
const bodyParser=require("body-parser");
const multer=require("multer");
const muliterObj=multer({dest:"./static/upload"});
const cookieParser=require("cookie-parser");
const cookieSession=require("cookie-session");
const consolidate=require("consolidate");
const expressRoute=require("express-route");
var server=express();
server.listen(8888);


//1.获取请求数据
server.use(bodyParser.urlencoded());
server.use(muliterObj.any());


//2.cookie session
(function(){
	var keys=[];
	for(var i=0;i<10000;i++){
		keys[i]="a_"+Math.random();
	}
	server.use(cookieParser());
	server.use(cookieSession({
		name:"sess_id",
		keys:keys,
		maxAge:20*60*1000 //20分钟
	}));
})()
//3.模板

server.engine("html",consolidate.ejs);
server.set("views","template");
server.set("view engine","html");

//4.route
server.use("/admin",require("./route/admin/index.js")());
server.use("/",require("./route/web/")());

//5. static

server.use(static("./static"));