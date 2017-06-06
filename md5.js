const crypto=require("crypto"); //引入模块
var obj=crypto.createHash("md5"); //创建md5对象
obj.update("123456");    //对象注入数据
var str=obj.digest("hex"); //返回值
