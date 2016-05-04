var wrap = document.getElementById('wrap');
var box = document.getElementById('div');
var btn = document.getElementById('button');

btn.onclick = function () {
	wrap.style.display = "block";
}

wrap.addEventListener("click", function () {
	wrap.style.display = "none";
})

box.onclick = function (ev) {
	ev.stopPropagation();  //阻止冒泡的父容器#wrap
}

window.onresize = function () {
	box.style.top = (wrap.offsetHeight - box.offsetHeight)/2 + "px"
	box.style.left = (wrap.offsetWidth - box.offsetWidth)/2 + "px"
}

box.onmousedown = function (ev) {
	ev = event || window.event;
	//获取点击的位置和盒子的坐标差
	var distanceX = ev.clientX - box.offsetLeft;
	var distanceY = ev.clientY - box.offsetTop;

	//onmousemove有反应时间，太快会出bug，改给document加，这样还是包含在onmousedown事件里
	wrap.onmousemove = function (ev) {
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
	
	wrap.onmouseup = function () {
		wrap.onmousemove = null;
		wrap.onmouseup = null;
		//这时不执行wrap的点击事
		if (ev.target.nodeName = "div") {
			wrap.onclick = null;
		}
	}
	return false; //阻止默认事件，图片等。。
}