var utils=(function(){
    var flg='getComputedStyle' in window;
    function makeArray(arg){
        if(flg){//标准浏览器
            return Array.prototype.slice.call(arg);
        }else{
            var ary=[];
            for(var i=0; i<arg.length; i++){
                ary.push(arg[i]);
            }
            return ary;
        }
    }
    function jsonParse(jsonStr){
        return 'JSON' in window?JSON.parse(jsonStr):eval('('+jsonStr+')');
    }
    function rnd(n,m){
        n=Number(n);
        m=Number(m);
        if(isNaN(n) || isNaN(m)){
            return Math.random();
        }
        if(n>m){
            var tmp=m;
            m=n;
            n=tmp;
        }
        return Math.round(Math.random()*(m-n)+n);
    }
    function getByClass(strClass,parent){
        parent=parent||document;
        if(flg){
            return this.makeArray(parent.getElementsByClassName(strClass));
        }
        var aryClass=strClass.replace(/(^ +)|( +$)/g,'').split(/\s+/g);
        var nodeList=parent.getElementsByTagName('*');
        var ary=[];
        for(var i=0; i<nodeList.length; i++){
            var cur=nodeList[i];
            var bOk=true;
            for(var j=0; j<aryClass.length; j++){
                var reg=new RegExp('(^| +)'+aryClass[j]+'( +|$)');
                if(!reg.test(cur.className)){
                    bOk=false;
                    break;
                }
            }
            if(bOk){
                ary.push(cur);
            }
        }
        return ary;
    }
    function hasClass(curEle,cName){
        var reg=new RegExp('(^| +)'+cName+'( +|$)','g');
        return reg.test(curEle.className);
    }
    function addClass(curEle,strClass){
        var aryClass=strClass.replace(/(^ +)|( +$)/g,'').split(/\s+/g);
        for(var i=0; i<aryClass.length; i++){
            if(!this.hasClass(curEle,aryClass[i])){
                curEle.className+=' '+aryClass[i];
            }
        }
    }
    function removeClass(curEle,strClass){
        var aryClass=strClass.replace(/(^ +)|( +$)/g,'').split(/\s+/g);
        for(var i=0; i<aryClass.length; i++){
            var reg=new RegExp('(^| +)'+aryClass[i]+'( +|$)','g');
            if(reg.test(curEle.className)){
                curEle.className=curEle.className.replace(reg,' ').replace(/(^ +)|( +$)/g,'').replace(/\s+/g,' ');
            }
        }
    }
    function getCss(curEle,attr){
        var val=null;
        var reg=null;
        if(flg){
            val=getComputedStyle(curEle,false)[attr];
        }else{
            if(attr==='opacity'){
                val=curEle.currentStyle['filter'];//‘alpha(opacity=10)’;
                reg=/^alpha\(opacity[=:](\d+(\.\d+)?)\)$/;
                return reg.test(val)?RegExp.$1/100:1;
            }
            val=curEle.currentStyle[attr];
        }
        reg=/^([+-])?(\d+(\.\d+)?)(px|pt|rem|em)?$/gi;
        return reg.test(val)?parseFloat(val):val;
    }
    function setCss(curEle,attr,value){
        if(attr==='float'){
            curEle.style.cssFloat=value;
            curEle.style.styleFloat=value;
            return;
        }
        if(attr=='opacity'){
            curEle.style.opacity=value;
            curEle.style.filter='alpha(opacity='+(value*100)+')';
            return;
        }
        var reg=/(width|height|top|right|bottom|left|((margin|padding)(top|right|bottom|left)?))/gi;
        if(reg.test(attr)){
            if(value!=='auto' || value.toString().indexOf('%') == -1){
                value=parseFloat(value)+'px';
            }
        }
        curEle.style[attr]=value;
    }
    function setGroupCss(curEle,opt){
        if(Object.prototype.toString.call(opt) !== '[object Object]') return;
        for(var attr in opt){
            this.setCss(curEle,attr,opt[attr]);
        }

    }
    function css(curEle){
        var argTwo=arguments[1];
        if(typeof argTwo==='string'){
            var argThree=arguments[2];
            if(argThree===undefined){//第三个参数没有-获取
                return this.getCss(curEle,argTwo);
            }else{
                this.setCss(curEle,argTwo,argThree);
            }
        }
        if({}.toString.call(argTwo)==='[object Object]'){
            this.setGroupCss(curEle,argTwo);
        }
    }
    function win(attr,value){
        if(value===undefined){
            return document.documentElement[attr]||document.body[attr];
        }
        document.documentElement[attr]=document.body[attr]=value;
    }
    function offset(curEle){
        var l=curEle.offsetLeft;
        var t=curEle.offsetTop;
        var par=curEle.offsetParent;
        while(par){
            if(window.navigator.userAgent.indexOf('MSIE 8') == -1){
                l+=par.clientLeft;
                t+=par.clientTop;
            }
            l+=par.offsetLeft;
            t+=par.offsetTop;
            par=par.offsetParent;
        }
        return {left:l,top:t}
    }
    function getChildren(curEle,tagName){
        var childs=curEle.childNodes;
        var ary=[];
        for(var i=0; i<childs.length; i++){
            var cur=childs[i];
            if(cur.nodeType==1){
                if(tagName){
                    if(cur.tagName.toLocaleLowerCase()===tagName.toLowerCase()){
                        ary.push(cur);
                    }
                }else{
                    ary.push(cur)
                }
            }
        }
        return ary;
    }
    function prev(curEle){
        if(flg){
            return curEle.previousElementSibling;
        }
        var pre=curEle.previousSibling;
        while(pre && pre.nodeType !== 1){
            pre=pre.previousSibling;
        }
        return pre;
    }
    function next(curEle){
        if(flg){
            return curEle.nextElementSibling;
        }
        var nex=curEle.nextSibling;
        while(nex && nex.nodeType !== 1){
            nex=nex.nextSibling;
        }
        return nex;
    }
    function sibling(curEle){
        var ary=[];
        var pre=this.prev(curEle);
        var nex=this.next(curEle);
        if(pre) ary.push(pre);
        if(nex) ary.push(nex);
        return ary;
    }
    function prevAll(curEle){
        var ary=[];
        var pre=this.prev(curEle);
        while(pre){
            ary.push(pre);
            pre=this.prev(pre);
        }
        return ary;
    }
    function nextAll(curEle){
        var nex=this.next(curEle);
        var ary=[];
        while(nex){
            ary.push(nex);
            nex=this.next(nex);
        }
        return ary;
    }
    function siblings(curEle){
        var ary1=this.prevAll(curEle);
        var ary2=this.nextAll(curEle);
        return ary1.concat(ary2);
    }
    function firstChild(curEle){
        var children=this.getChildren(curEle);
        return children[0];
    }
    function lastChild(curEle){
        var children=this.getChildren(curEle);
        return children[children.length-1];
    }
    function index(curEle){
        return this.prevAll(curEle).length;
    }
    function appendChild(curEle,parent){
        parent.appendChild(curEle);
    }
    function prependChild(curEle,parent){
        var first=this.firstChild(parent);
        if(first){
            parent.insertBefore(curEle,first);
        }else{
            parent.appendChild(curEle);
        }
    }
    function insertBefore(curEle,oldEle){
        oldEle.parentNode.insertBefore(curEle,oldEle);
    }
    function insertAfter(curEle,oldEle){
        var nex=this.next(oldEle);
        if(nex){
            oldEle.parentNode.insertBefore(curEle,nex);
        }else{
            oldEle.parentNode.appendChild(curEle);
        }
    }
    return {
        //makeArray:类数组转数组
        makeArray:makeArray,
        //jsonParse:把JSON格式的字符串转成JSON格式的数据（对象）
        jsonParse:jsonParse,
        //rnd:求一定范围的随机数，包含最大值；
        rnd:rnd,
        //getByClass:通过class名，可以限制范围的获取元素
        getByClass:getByClass,
        //hasClass:判断元素身上是否有某个class名
        hasClass:hasClass,
        //addClass:给元素批量添加出class名
        addClass:addClass,
        //removeClass:从元素身上批量删除class名
        removeClass:removeClass,
        //getCss:获取非行间样式
        getCss:getCss,
        //setCss:给元素设置一个样式
        setCss:setCss,
        //setGroupCss:给元素设置一组样式
        setGroupCss:setGroupCss,
        //css:集获取，设置一个，设置一组为一体；
        css:css,
        //win:浏览器盒子模型的兼容处理
        win:win,
        //offset:元素偏移量的兼容处理；
        offset:offset,
        //getChildren:获取当前元素下的所有子元素（可以通过标签名过滤子元素）
        getChildren:getChildren,
        //prev：获取当前元素的上一个哥哥元素
        prev:prev,
        //next:获取当前元素的下一个弟弟元素
        next:next,
        //sibling:获取当前元素的相邻元素；
        sibling:sibling,
        //prevAll:获取当前元素所有的哥哥元素
        prevAll:prevAll,
        //nextAll:获取当前元素所有的弟弟元素
        nextAll:nextAll,
        //siblings:获取当前元素所有的兄弟元素；
        siblings:siblings,
        //firstChild:获取当前容器下第一个子元素
        firstChild:firstChild,
        //lastChild:获取当前容器下最后一个子元素
        lastChild:lastChild,
        //index:当前元素的索引（当前元素排行第几）；
        index:index,
        //appendChild:把新元素插入到父容器的末尾；
        appendChild:appendChild,
        //prependChild:把新元素插入到父容器的开头；
        prependChild:prependChild,
        //insertBefore:把新元素插入到指定元素的前面
        insertBefore:insertBefore,
        //insertAfter:把新元素插入到指定元素的后面；
        insertAfter:insertAfter
    }
})();

