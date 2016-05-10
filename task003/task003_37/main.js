var wrap = document.getElementById('wrap');
var box = document.getElementById('div');
var btn = document.getElementById('button');
var close = document.getElementById('close');
var form = document.getElementById('form');

btn.onclick = function () {
	wrap.style.display = "block";   //浮层出现
}

//禁止表单操作冒泡到父层容器box
!function (ev) {
	form.onmousedown = function (ev) {
		ev.stopPropagation(ev);
	}
	form.onmousemove = function(ev) {
		ev.stopPropagation(ev);
	}
	form.onmouseup = function(ev) {
		ev.stopPropagation(ev);
	}
	form.getElementsByTagName('button')[0].onclick = function () {
		return false;
	}
}()
	
close.onclick = function () {     //关闭图标的点击事件使得浮层消失
	wrap.style.display = "none";
}

box.onclick = function (ev) {    
	ev.stopPropagation();  //阻止冒泡到父容器#wrap
}

wrap.addEventListener("click", function () {
	wrap.style.display = "none";
})

window.onresize = function () {
	box.style.top = (wrap.offsetHeight - box.offsetHeight)/2 + "px"
	box.style.left = (wrap.offsetWidth - box.offsetWidth)/2 + "px"
}

box.onmousedown = function (ev) {
	// 当不是操作form内的元素时，给box加遮罩。防止拖动的时候移动到form区域发生错误
	if (box.getElementsByTagName('div').length === 0 && (ev.target.nodeName !== "BUTTON") ) {
		var boxWrap = document.createElement("div");
		boxWrap.style.width = box.offsetWidth + "px";
		boxWrap.style.height = box.offsetHeight + "px";
		box.appendChild(boxWrap);
	}

	ev = event || window.event;
	var target = ev.target || ev.srcElement;
	//获取点击的位置和盒子的坐标差
	var distanceX = ev.clientX - box.offsetLeft;
	var distanceY = ev.clientY - box.offsetTop;

	//onmousemove有反应时间，太快会出bug，改给document加，这样还是包含在onmousedown事件里
	document.onmousemove = function (ev) {
		//每次移动的时候重新获取鼠标当前的坐标点
		var ev = event || window.event;
		var l = ev.clientX - distanceX;
		var t = ev.clientY - distanceY;

		var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;   //滚动条高度的浏览器兼容
		// 边界情况的的处理
		if (t <= 0) {
			window.scrollTo(0, scrollTop - 100)
			t = 0;
		}
		if (l >= (wrap.offsetWidth - box.offsetWidth)) {
			l = wrap.offsetWidth - box.offsetWidth;
		}
		if (t >= (wrap.offsetHeight - box.offsetHeight)) {
			window.scrollTo(0, scrollTop + 100)
			t = wrap.offsetHeight - box.offsetHeight;
		}
		if (l <= 0) {
			l = 0;
		}
		box.style.left = l + "px";
		box.style.top= t + "px";
	}
	
	document.onmouseup = function () {
		document.onmousemove = null;
		document.onmouseup = null;
		//这时让wrap的点击事件为空
		if (ev.target.nodeName == "div") {
			console.log(ev.target.nodeName)
			wrap.onclick = null;
		}
		if (box.getElementsByTagName('div').length !== 0) {
			box.removeChild(boxWrap)   //结束后移除遮罩，不然form内元素不可操作。
		}
	}
	return false;
}