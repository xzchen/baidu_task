// 获取操作元素
var form = document.getElementById("form")
var text = form.getElementsByTagName("input")[0]
var btn = form.getElementsByTagName("button")
var oBarChart = document.getElementById("bar_chart")
var aP = oBarChart.getElementsByTagName("p")
var oRank = document.getElementById("rank")
var aSpan = oRank.getElementsByTagName("span")
var num = new Array()
window.onload = function() {
    //生成初始页面
    for (var i = 0; i < 40; i++) {
        var p = document.createElement("p")
        var span = document.createElement("span")
        var height = Math.round((Math.random() * 90 + 10))
        p.style.height = height * 3 + "px"
        span.innerHTML = height
        oBarChart.appendChild(p)
        oRank.appendChild(span)
    }

    // 判断是否超过队列元素限制（60）,超过则不允许添加元素
    form.onclick = function(ev) {
        var ev = ev || evevt
        var target = ev.target || ev.srcElement    
        if (target.nodeName.toLowerCase = "button") {
            if (aP.length >= 60) {
                alert("你已经添加了60个数据了，不能再添加了")
                btn[0].disabled = true
                btn[1].disabled = true
            }
            else {
                btn[0].disabled = false
                btn[1].disabled = false
            }
        }
    }

    // 每个按钮的点击事件
    btn[0].onclick = function () {
        for (var i = 0; i < aSpan.length; i++) {
            num[i] = aSpan[i].innerHTML
        }
        
        if (text.value > 100 || text.value < 10) {
            alert("请输入数字[10,100]")
        }
        else {
            leftPush()
        }

    }

    btn[1].onclick = function () {
        if (text.value > 100 || text.value < 10) {
            alert("请输入数字[10,100]")
        }
        else {
            RightPush()
        }
    }

    btn[2].onclick = function () {   
        oBarChart.removeChild(oBarChart.firstChild) 
        oRank.removeChild(oRank.firstChild)  
    }

    btn[3].onclick = function () {
        oBarChart.removeChild(oBarChart.lastChild)   
        oRank.removeChild(oRank.lastChild)         
    }
    
    
    btn[4].onclick = function () {
        //每次清空数组，否则每次重新排序时需排序元素少于上一次数组长度会找不到对应元素。（虽然不影响结果，但是浪费啊，而且多执行了循环）
        num.length = 0
        //获得span的值存入数组比较
        for (var i = 0; i < aSpan.length; i++) {
            num[i] = aSpan[i].innerHTML
        }
        // 自己不会可视化，这里抄了别人的，不会了，这稍微能理解点。以后看能不能补起来
        var i = 0, j = 1
        var int = setInterval(run,1)
        function run() {
            //这是别人的，基本只修改了数组排序时的比较方式
            /*var x = 0
            if (i < num.length) {
                if (j < num.length) {
                    if (num[i] - num[j] ) {
                        var tmp = num[i];
                        num[i] = num[j];
                        num[j] = tmp;
                        upNum();
                        return;
                    }
                    x++
                    j++;
                } 
                else {
                    i++;
                    j = i + 1;
                }   
            }
            所有的都比较完了，关闭定时器
            else {
                clearInterval(int);
            }*/

            //开始一直以为是bug，每次添加进去值后，就不参与排序了，我都是添加100。排序的时候就不是按照数字大小比较的
            for (var i = 0; i < num.length; i++) {
                for (var j = i+1; j < num.length; j++) {
                    // if (re) {
                    if (num[i] - num[j] > 0) {
                        var tmp = num[i]
                        num[i] = num[j]
                        num[j] = tmp
                        upNum()
                        return
                    }  
                    // }
                    //弃用了，不然每次会重新刷新排列。
                    /*else {
                        if (num[i] - num[j] < 0) {
                            var tmp = num[i]
                            num[i] = num[j]
                            num[j] = tmp
                            upNum()
                            return
                        }
                    }*/
                }
            }
            // re = !re
            clearInterval(int) 
        }
    }
}    

//3个按钮对应执行的函数
function leftPush() {
    var p = document.createElement("p")
    var span = document.createElement("span") 
    p.style.height = text.value * 3 + "px"
    span.innerHTML = text.value
    oBarChart.insertBefore(p, oBarChart.firstChild)
    oRank.insertBefore(span, oRank.firstChild)     
}

function RightPush() {
    var p = document.createElement("p")
    var span = document.createElement("span") 
    p.style.height = text.value * 3 + "px"
    span.innerHTML = text.value
    oBarChart.appendChild(p)
    oRank.appendChild(span)
}

function upNum() {
    for(var i = 0; i < num.length;i++) {  
        aP[i].style.height = num[i] * 3 + "px"
        aSpan[i].innerHTML = num[i]
    }
}

//点击已渲染的图表则删除它，用了事件代理。结果了taks18的问题
oBarChart.onclick = function(ev) {
    // 兼容处理
    ev = ev || event
    // 知道用户点击的目标
    var target = ev.target || ev.srcElement
    if (target.nodeName.toLowerCase() == "p") { 
        for (var i = 0; i < aP.length; i++) {
            aP[i].index = i
            aP[i].onclick = function() {
            this.parentNode.removeChild(this)
            aSpan[this.index].parentNode.removeChild(aSpan[this.index])
            }
        }
    }
}

oRank.onclick = function(ev) {
    // 事件代理不需要每次p(span)加载/删除的时候重新绑定事件
    ev = ev || event
    var target = ev.target || ev.srcElement
    if (target.nodeName.toLowerCase() == "span") { 
        for (var i = 0; i < aSpan.length; i++) {
            aSpan[i].index = i
            aSpan[i].onclick = function() {
            this.parentNode.removeChild(this)
            aP[this.index].parentNode.removeChild(aP[this.index])
            }
        }
    }
}