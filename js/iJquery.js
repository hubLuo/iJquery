/*
 *作者：luo
 *时间：2018/11/4 0004
 *Email：hubluo@gmail.com
 *功能：
 */
~function(root,factory,name){
    factory(root,name);
}(this,function(root,name){
    var carrier=function(){ //封装构造函数
    };
    root[name]=root.carrier=carrier;//别名
},"$");