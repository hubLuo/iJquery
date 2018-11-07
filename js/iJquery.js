/*
 *作者：luo
 *时间：2018/11/4 0004
 *Email：hubluo@gmail.com
 *功能：
 */

/*
* 1架构
* */
~function(root,factory,name){
    factory(root,name);
}(this,function(root,name){
    /*注意
     * carrier.prototype.init;只是表示了一个引用，实质上就是个函数地址，这个地址指向了函数所在内存位置。
     * carrier.prototype.init();表达了2个操作：1.执行carrier.prototype.init所指向地址的函数;2.指明了函数的执行环境为carrier.prototype。
     * 简单的来说，就是在carrier.prototype环境下找到init函数，并执行它。
     * */
    var carrier=function(selector,context){ //封装构造函数
        return new carrier.prototype.init(selector,context);//创建carrier实例
    };
    carrier.prototype={//carrier原型
        constructor:carrier,
        init:function(selector,context){
            return this.selector(selector,context);//等同carrier.prototype.selector(selector,context).call(this);
        },
        css:function(){console.log("修改样式")},
        pushStack:function(){console.log("constructor--",this.constructor()==this,this,this.constructor());}
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
    root[name]=root.carrier=carrier;//别名
},"$");

/*
* 2选择器引擎
* */
~function($){
    var carrier= $,htmlIdExp= /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,//判断html标签和#id
        rejectExp = /^<(\w+)\s*\/?>/;  //"<(div)>"过滤掉<>//去除$这样才能匹配<div></div>形式的<>;
    //为了减少模块依赖，不用静态方法isFunction,isArray;
    var toString=Object.prototype.toString,strFn="[object Function]",strArr="[object Array]";
    $.fn.extend({
        //length:0,
        //选择器
        selector:function(selector,context){
            if(!selector){return this;}
            if(typeof selector==="string"){
                this.length=0;var match;
                //1-2处理字符串情况：分辨字符串：#xx,.xx,html字符串
                if(selector.charAt(0) ==="<" && selector.charAt(selector.length-1)===">" && selector.length>=3){
                    //html字符串
                    match=[null,selector,null];
                }else{
                    match=htmlIdExp.exec(selector)?htmlIdExp.exec(selector):[];//因为此处只能是#开头字符串，html标签已经截取完毕。
                }

                if(match[1]){
                    //1处理HTML标签字符串：创建DOM+存储
                    carrier.merge(this,carrier.parseHTML(selector,context&&context.nodeType?context:document));
                }else{
                    //2处理#字符串：查询+存储
                    if(!match[2]){

                        //3.进行class和标签名查询
                        var doms=carrier.querySelector(selector,context || document),len=doms.length;
                        for(var i=0;i<len;i++){this[i]=doms[i];}
                        this.length=len;
                        return this
                    }
                    // 查询#字符串：
                    var elem=document.getElementById(match[2]);
                    if(elem,elem.nodeType){
                        this.length=1;
                        this[0]=elem;
                    }
                    this.context=context || document;
                    this.selector=selector;
                    return this;
                }
            }else if(selector.nodeType){
                //3处理element对象情况
                this.context=this[0]=selector;
                this.length=1;
                return this;
            }else if(toString.call(selector)===strFn){
                //4处理函数情况
                carrier.rootInstance.ready(selector);
            }
            //return this;
        },
        ready:function(fn){
            //监听DOM事件
            //document.addEventListener("DOMContentLoaded",carrier.ready);
            if(!carrier.isAddDOMContentLoaded){
                carrier.isAddDOMContentLoaded=true;
                carrier.handleDOMContentLoaded(carrier.ready);
            }
            //DOM加载完成：直接执行；DOM没有加载完：加入执行队列
            carrier.isReady?fn.call(document,carrier):carrier.readyList.push(fn);
        }
    });
    //核心静态方法
    $.extend({
        //核心方法泛数组合并
        merge:function(target,src){
            var i=target.length || 0,l=src.length,j=0;
            if(toString.call(src)===strArr){
                for(;j<l;j++){
                    target[i++]=src[j];
                }
            }else{
                while(src[j]!==undefined){
                    target[i++]=src[j++];
                }
            }
            target.length=i;
            return target;
        },
        markArray:function(arr){
            var result=[];
            if(arr &&arr.length>0){
                return carrier.merge(result,arr);
            }
        },
        parseHTML:function(data,context){
            //创建DOM
            if(!data || typeof data!=="string"){
                return null;
            }
            //过滤掉<>
            var parse=rejectExp.exec(data);
            return [context.createElement(parse[1])];
        },
        each:function(obj,callback,args){
            /*
             * each设计：遍历对象分为泛数组和对象
             * 1.length区分出泛数组和其他对象
             * 2.遍历方式不统一使用in的形式是考虑到类数组中非数字下标属性也会被读取。
             * 所以泛数组采用下标循环，对象采用in循环。
             * 3.参数：obj遍历的对象，callback遍历时回调，args自定义回调函数参数；
             * 4.遍历时回调函数绑定对象规则：泛数组时绑定遍历值，其他对象时绑定该对象。
             * 5.遍历时回调函数参数传递规则：有args时，传递args,否则传递遍历的数据。
             * */
            /*
            //第一版：
            var length=obj.length;
            if(args){
                //使用自定义callback参数
                if(length===undefined){
                    for(var name in obj){
                        callback.apply(obj,args);
                    }
                }else{
                    for(var i=0;i<length;i++){
                        callback.apply(obj[i],args);
                    }
                }
            }else{
                if(length===undefined){
                    for(var name in obj){
                        callback.call(obj,name,obj[name]);
                    }
                }else{
                    for(var i=0;i<length;i++){
                        callback.call(obj[i],i,obj[i]);
                    }
                }
            }*/
            //第二版：
            var length=obj.length,arr=function(){return args};
            if(!arr()){
                arr=function(index,value){return [index,value];}
            }
            if(length===undefined){
                for(var name in obj){
                    callback.apply(obj,arr(name,obj[name]));
                }
            }else{
                for(var i=0;i<length;i++){
                    callback.apply(obj[i],arr(i,obj[i]));
                }
            }
        },
        //遍历实例对象，并执行操作。
        eachForInstance:function(fn){
            return function(){
                carrier.each(this,function(){
                    var arr=Array.prototype.slice(arguments);
                    //arr.unshift(this);//注意unshift在IE下无效
                    fn.apply(null,[this].concat(arr));//方式1设置元素为方法的第一个参数。
                    //fn.apply(this,arguments);//方式2直接设置元素为方法的执行环境。
                },Array.prototype.slice(arguments));
            }.bind(this);
        },
        rootInstance:carrier(document),//1.根实例
        readyList:[],//2.事件队列
        isReady:false,
        ready:function(){
            //依次执行事件队列中的函数。
            carrier.isReady=true;
            carrier.each(carrier.readyList,function(i,fn){
                //是数组，所以方法绑定在数组中的元素，所以this===fn的。
                this.call(document,carrier);
            });
            carrier.readyList=null;//执行完清空。
        },
        isAddDOMContentLoaded:false,
        handleDOMContentLoaded:function(fn){
            var ready = false,
                top = false,
                doc = window.document,
                root = doc.documentElement,
                modern = doc.addEventListener,
                add = modern ? 'addEventListener' : 'attachEvent',
                del = modern ? 'removeEventListener' : 'detachEvent',
                pre = modern ? '' : 'on',
                init = function(e) {
                    if (e.type === 'readystatechange' && doc.readyState !== 'complete') return;
                    (e.type === 'load' ? window : doc)[del](pre + e.type, init, false);
                    if (!ready && (ready = true)) fn.call(window, e.type || e);
                },
                poll = function() {
                    try {
                        root.doScroll('left');
                    } catch(e) {
                        setTimeout(poll, 50);
                        return;
                    }
                    init('poll');
                };

            if (doc.readyState === 'complete') fn.call(window, 'lazy');
            else {
                if (!modern && root.doScroll) {
                    try {
                        top = !window.frameElement;
                    } catch(e) {}
                    if (top) poll();
                }
                doc[add](pre + 'DOMContentLoaded', init, false);
                doc[add](pre + 'readystatechange', init, false);
                window[add](pre + 'load', init, false);
            }
        }
    });
}($);
/*
* 3选择器
* */
~function($){
    var carrier= $;
    carrier.extend({
        querySelector:function(selector,context){
            return context.querySelectorAll(selector);
        }
    });
}($);

/*
* 4选择实例元素
* */
~function($){
    var carrier= $;
    carrier.fn.extend({
        pushStack: function( elems ) {
            //理解Jquery的入栈，将已有的元素合并出一个新的空 $ 对象
            //之所以是空$对象，因为工厂式构造函数没有传递参数。
            var ret = $.merge( this.constructor(), elems );

            // Add the old object onto the stack (as a reference)
            ret.prevObject = this;

            // Return the newly-formed element set
            return ret;
        },
        first: function() {
            return this.eq( 0 );
        },
        last: function() {
            return this.eq( -1 );
        },
        end: function() {
            return this.prevObject || this.constructor();
        },
        eq: function( i ) {
            var len = this.length,
                j = +i + ( i < 0 ? len : 0 );
            this.selectedEls(j);
            return this.pushStack( j >= 0 && j < len ? [ this[ j ] ] : [] );
        },
        find:function(selector){
            var arr=[];
            for(var i=0;i<this.length;i++){
                var res=this[i].querySelectorAll(selector);
                Array.prototype.push.apply(arr,res);
            }
            return this.pushStack(arr);
        }
    });
}($);


//类型检查
$.extend({
    type:function(){},
    isPlainObject: function( obj ){
        return typeof obj === "object";
    },
    isObject: function( obj ){
        return Object.prototype.toString.call(obj) === "[object Object]";
    },
    isArray: function(obj){   //array对象
        return Object.prototype.toString.call(obj) === "[object Array]";
    },
    isFunction:function(){
        return Object.prototype.toString.call(obj) === "[object Function]";
    }
});





















