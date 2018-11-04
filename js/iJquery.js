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
    //carrier.prototype.init.prototype=carrier.prototype;//原型链共享//这样new init时，实例原型将指向carrier原型。
    carrier.fn=carrier.prototype.init.prototype=carrier.prototype;//原型链共享
    //JQ挂载extend方法
    carrier.fn.extend=carrier.extend=function(){
        /*需求
         * 1：参数1---扩展对象：实例扩展，实例原型扩展，本身扩展
         * 2：参数2以上 任意对象扩展，扩展对象：arguments[0]
         * 3：目标对象必须为引用类型，参数不能为空
         * */
        //需求3
        var length=arguments.length,i= 1,target=arguments[0]||{},
            option,//具体的src
            name;//src对象名

        if(typeof target!=="object"){
            target={};
        }
        //需求1
        if (length ==i){
            target=this;//把this变为目标元素
            i--;//把第一个元素变为src
        }
        //需求2
        for(;i<length;i++){
            if((option=arguments[i])!==null){
                for(name in option ){
                    target[name]=option[name];
                }
            };
        }
        return target;
    };
    root[name]=root.carrier=carrier;//别名
},"$");