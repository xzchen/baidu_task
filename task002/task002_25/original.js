// 0.这个得重写，太多问题了
// 1.搜索渲染，写太杂，逻辑乱。本身html就没写好，下次换个写
// 2.把task24的东西要组合上去，这样没什么功能
// 3.css样式没好好写，太丑
// 4.DOM操作那边，可以写事件绑定，减少代码量
// 5.这个真写太差劲了，改改改！！
var searchBox = document.getElementById("searchBox");
var menu = document.getElementById("menu");
var text = document.getElementById("text")
var btn = document.getElementById("button");

//页面初始化
(function () {
	 aLi = document.getElementsByTagName("li")
	for (let i = 0; i < aLi.length; i++) {
		var div = document.createElement("div")
		div.innerHTML = "<span onclick = 'addNode(this)'>添加</span><span onclick = 'removeNode(this)'>删除</span><span onclick = 'reName(this)'>重命名</span>"
		aLi[i].insertBefore(div, aLi[i].childNodes[1]) 
	}
})()

// 节点的折叠和展开
menu.onclick = function(ev) {
	var ev = ev || evevt;
	var target = ev.target || src.element;
	if (target.nodeName = "li" && target.getElementsByTagName("ul")[0]) {
		//这里如果先判断 == blcok的话，会有点bug，第一次点击时直接跳到else，还不懂为什么。
		if (target.getElementsByTagName("ul")[0].style.display == "none") {
			target.getElementsByTagName("ul")[0].style.display = "block";
		}
		else {
			target.getElementsByTagName("ul")[0].style.display = "none";
		}
	}
}

//搜索操作
var int = null
btn.onclick = function () {
	getSearchOrder(menu)
	var keyWord = text.value.trim()
	var re = new RegExp("^"+keyWord, "i")
	//计算检索到多少个值
	var count = 0
	//清空之前遍历结果
	for (let i  = 0; i < arr.length; i++) {
		arr[i].style.backgroundColor = "#fff"
	}
	//第一个遍历对象的处理
	if (re.test(arr[1].childNodes[0].nodeValue) && (arr[1].childNodes[0].nodeValue.length == keyWord.length)) {
		arr[1].style.backgroundColor = "#ccc"
		for (let i = 0; i < arr[1].children.length; i++) {
			arr[1].children[i].style.backgroundColor = "#fff"
		}
		count++
	}
	else {
		arr[1].style.backgroundColor = "#f60"
		for (let i = 0; i < arr[1].children.length; i++) {
			arr[1].children[i].style.backgroundColor = "#fff"
		}
	}
	var i = 2;
	clearInterval(int)
	int = setInterval(function() {
		if (i < arr.length) {
			//如果等于#ccc，表示是检索到的，所以不必变为白色。
			if (!(arr[i - 1].style.backgroundColor == "rgb(204, 204, 204)")) {
				arr[i-1].style.backgroundColor = "#fff"
			}
			
			//判断是否符合正则，是则显示为#ccc，否则为#f60
			if (re.test(arr[i].childNodes[0].nodeValue) && (arr[i].childNodes[0].nodeValue.length == keyWord.length)) {
				arr[i].style.backgroundColor = "#ccc";
				//保证搜索到的元素的父元素出于展开状态
				var j = i;
				arr[j] = arr[i]
				while (arr[j].parentNode.nodeName.toLowerCase() != "div") {
					arr[j].parentNode.style.display = "block"
					arr[j] = arr[j].parentNode
				}
				arr[i].parentNode.style.display = "block"
				count++
			}
			else {
				arr[i].style.backgroundColor = "#f60"
			}
			if (arr[i].children.length > 1) {
				arr[i].children[1].style.backgroundColor = "#fff"
			}
			
		}
		else {
			if (keyWord != "") {
				alert("你检索的词是：" + keyWord + "\n一共搜索到了" + count +"个匹配项")
			}
			clearInterval(int)
		}
		i++	
	},300)
}

//DOM操作单的悬停出现/消失
menu.onmouseover = function () {
	var ev = ev || event;
	var target = ev.target || src.element;
	if (target.nodeName.toLowerCase() == "li") {
		target.onmouseover = function () {
			target.children[0].style.display = "inline-block"
		}
		target.onmouseout = function () {
			target.children[0].style.display = "none"
		}	
	}
}


//添加子节点
function addNode(node) {
	for( let i = 0; i < aLi.length; i++) {
		aLi[i].style.backgroundColor = "#fff"
	}
	let nodeName = prompt("请输入添加的文件名", "bendan")
	node = node.parentNode.parentNode;
	if (node.children.length <= 1) {
		let ul = document.createElement("ul");
		ul.innerHTML = "<li>" + nodeName + "<div><span onclick = 'addNode(this)'>添加</span><span onclick = 'removeNode(this)'>删除</span><span onclick = 'reName(this)'>重命名</span></div></li></ul>"
		// node.parentNode.parentNode.appendChild(ul)
		node.appendChild(ul);
	}
	else {
		let li = document.createElement("li");
		li.innerHTML = nodeName + "<div><span onclick = 'addNode(this)'>添加</span><span onclick = 'removeNode(this)'>删除</span><span onclick = 'reName(this)'>重命名</span></div>";
		node.children[1].appendChild(li)
	}
}

//删除节点
function removeNode(node) {
	for( let i = 0; i < aLi.length; i++) {
		aLi[i].style.backgroundColor = "#fff"
	}
	menu.backgroundColor = "#fff"
	console.log(menu)
	node = node.parentNode.parentNode;
	node.parentNode.removeChild(node)
}

//节点重命名
function reName(node) {
	for( let i = 0; i < aLi.length; i++) {
		aLi[i].style.backgroundColor = "#fff"
	}
	node = node.parentNode.parentNode;
	let nodeName = prompt("请输入要修改的文件名", "bendan");
	node.childNodes[0].nodeValue = nodeName
}

//还是之前深度遍历，不熟练。
function getSearchOrder(node) {
	arr = []
	var queue = []
	var depth = null;
	if (node) {
		queue.push(node)
	}
	while (queue.length > 0) {
		depth = queue.shift();
		arr.push(depth);

		//如果children[1]为ul的话，说明要开启下一级了。所以跳一下。
		if (depth.children[1] && depth.children[1].nodeName.toLowerCase() == "ul") {
			depth = depth.children[1];
		}

		//是li才加入计算
		if (depth.children[0] && (depth.children[0].nodeName.toLowerCase() == "li")) {
			queue.push(depth.children[0]);
			depth = depth.children[0];
			while (depth.nextElementSibling) {
				queue.push(depth.nextElementSibling)
				depth = depth.nextElementSibling
			}
		}
	}
	return arr;
} 
