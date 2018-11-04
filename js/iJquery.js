/*
 *作者：luo
 *时间：2018/11/4 0004
 *Email：hubluo@gmail.com
 *功能：
 */
~function(root,factory,name){
    factory(root,name);
}(this,function(root,name){
    /*注意
     * carrier.prototype.init;只是表示了一个引用，实质上就是个函数地址，这个地址指向了函数所在内存位置。
     * carrier.prototype.init();表达了2个操作：1.执行carrier.prototype.init所指向地址的函数;2.指明了函数的执行环境为carrier.prototype。
     * 简单的来说，就是在carrier.prototype环境下找到init函数，并执行它。
     * */
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
        //深拷贝
        var deep=false,//判断拷贝类型
            copy,//记录option[name]，判断类型；
            src,//记录target[name],判断类型；
            copyIsArray,//记录当copy为数组时；
            clone;//目标值的备份；

        if(typeof target=="boolean"){
            deep=target;
            target=arguments[1];
            i=2;
        }

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
                    src=target[name];
                    copy= option[name];
                    if(deep && (carrier.isPlainObject(copy) || (copyIsArray=carrier.isArray(copy)))){
                        if(copyIsArray){
                            //true被拷贝的值为数组
                            copyIsArray=false;
                            clone = src && carrier.isArray(src) ? src : [];
                        }else{
                            //被拷贝的值为对象
                            clone = src && carrier.isPlainObject(src) ? src : {};
                        }
                        //深拷贝
                        target[name] = carrier.extend( deep, clone, copy  );
                    }else if(copy !==undefined){
                        //浅拷贝
                        //target[name]=option[name];
                        target[name]=copy;
                    }
                }
            };
        };
        return target;
    };
    carrier.extend({
        //类型检查
        isPlainObject: function( obj ){
            return typeof obj === "object";
        },

        isArray: function(obj){   //array对象
            return toString.call(obj) === "[object Array]";
        }
    });
    root[name]=root.carrier=carrier;//别名
},"$");