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
    //添加深浅拷贝静态方法
    carrier.copy=function(deep,target,src){
        var deep =deep||false,target=target,src=src,
            toString=Object.prototype.toString,strArr="[object Array]",strObj="[object Object]";
        if(typeof deep!=="boolean"){
            if(target){
                src=target,target=deep;
            }else{
                target=deep;
            }
            deep=false;
        }
        if(src==undefined){
            src=target,target=undefined;
        }
        // 只拷贝对象
        if(typeof src !=="object" ){
            return false;
        }
        // 如果没有目标对象则 根据src的类型判断是新建一个数组还是对象
        if(target==undefined){
            target=src instanceof Array?[]:{};
        }
        for (var key in src) {
            var isArray=false;
            // 遍历src，并且判断是src的属性才拷贝
            if (src.hasOwnProperty(key)) {
                //deep为true且src属性值为对象和数组时进行递归，否则直接赋值。
                if(deep&&(toString.call(src[key])==strObj||(isArray=toString.call(src[key])==strArr))){
                    target[key]=isArray?(target[key] && toString.call(target)==strArr ?target[key]:[]):
                        (target[key] && toString.call(target)==strObj ?target[key]:{});
                    carrier.copy(deep,target[key],src[key]);
                }else{
                    target[key]=src[key];
                }
                //target[key] = typeof src[key] === 'object' ?carrier.deepCopy(src[key]) : src[key];
            }
        }
        return target;
    };
    //JQ挂载extend方法：对象分类管理
    carrier.fn.extend=carrier.extend=function(){
        /*需求
         * 1：一个对象--扩展对象为this：实例扩展，实例原型扩展，本身扩展
         * 2：二个对象及以上--扩展对象为任意无关对象：第一顺位对象为目标对象
         * 3：目标对象必须为引用类型，参数不能为空
         * */
        var length=arguments.length,i= 1,target=arguments[0]||{};
        //深浅拷贝
        var deep=false;

        if(typeof target=="boolean"){
            deep=target;
            target=arguments[1];
            i=2;
        }
        /*需求3: object情况：低版本IE的function，Object对象，数组，null
                 function情况：较高版本浏览器都可以*/
        if(typeof target!=="object" && typeof target !=="function"){
            target={};
        }

        //需求1和2
        if (length ==i){
            target=this;//把this变为目标元素
            i--;//把第一个元素变为src
        }
        //扩展：对象属性拷贝
        for(;i<length;i++){
            if((arguments[i])!==null){
                carrier.copy(deep,target,arguments[i]);
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