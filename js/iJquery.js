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
        return new carrier.prototype.init();//创建carrier实例
    };
    carrier.prototype={//carrier原型
        constructor:carrier,
            init:function(){
            this[0]="LQ";
            this[1]="is good";
            return this;
        },
        css:function(){console.log("修改样式")},
        pushStack:function(){console.log("constructor--",this.constructor());}
    };
    carrier.prototype.init.prototype=carrier.prototype;//原型链共享//这样new init时，实例原型将指向carrier原型。
    root[name]=root.carrier=carrier;//别名
},"$");