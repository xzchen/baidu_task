var menu = document.getElementById("menu");
var aDiv = menu.getElementsByTagName("div");
var aBtn = form.getElementsByTagName("button")
var text = document.getElementById("text")
var searchInput = document.getElementById("searchInput")
//记录渲染顺序的数组和定时器及记录与查找关键词相同的节点下标的数组
var arr = []
var int = null
var index = []

window.onload = function () {
	//写事件监听，不影响它们各自的点击事件，又减少了代码重复量
	for (var i = 0; i < aBtn.length; i++) {
		aBtn[i].addEventListener("click", function () {
			//写了好多次还是不长记性，记得清空数组。。。这次测试好了久，才确定自己确实是关了定时器的，只是每次点击的时候增加了数组元素
			arr = [];
			speed = text.value;		
			keyWord = searchInput.value.trim()
			index = []
		})
	}

	aBtn[0].onclick = function () {
		for (var i = 0; i < aDiv.length; i++) {
			arr.push(aDiv[i]);
		}	
	}

	aBtn[1].onclick = function () {
		inOrder(aDiv[0], arr);	
	}

	aBtn[2].onclick = function () {
		postOrder(aDiv[0], arr);
	}

	aBtn[3].onclick = function () {
		BFSOrder(aDiv[0], arr);
	}	

	//突然明白事件监听的好了，刚已经给每个button都加了这几句了，现在这样好看多了，没那么多重复的。
	for (var j = 0; j < aBtn.length; j++) {
		aBtn[j].addEventListener("click", function () {
			index = []
			search(arr, speed, index)	
		})
	}	
}

function search (arr, speed, index) {
	// 获得开始搜索的时间
	var beginTime = new Date()
	//用正则去匹配文本，如果不用忽略大小写匹配的话，匹配条件会简单多。
	var reg = new RegExp ("^"+keyWord,"i");
	// 设置检索到文本总数为0
	var count = 0;
	//保证每次点击时所有颜色标记被清空
	for (let i = 0; i < arr.length; i++) {
		arr[i].style.backgroundColor = "#fff"
	}
	//匹配条件
	if (reg.test(arr[0].getElementsByTagName("span")[0].innerHTML) && (arr[0].getElementsByTagName("span")[0].innerHTML.length == keyWord.length)) {
		arr[0].style.backgroundColor = "#ccc";
		count++;
	}
	else {
		arr[0].style.backgroundColor = "#f60"
	}
	var i = 1;
	//关闭定时器，防止多个定时器同时存在
	clearInterval(int) 
	int = setInterval(function() {
		// 根据i值判断渲染到那个节点（按顺序）了。
		if (i < arr.length) {
			//这个判断前一位那个div的颜色，确定是否改变
			if (arr[i - 1].style.backgroundColor != "rgb(204, 204, 204)") {
				arr[i - 1].style.backgroundColor = "#fff";
			}
			//这个判断当前检索的文本是否符合
			if (reg.test(arr[i].getElementsByTagName("span")[0].innerHTML) && arr[i].getElementsByTagName("span")[0].innerHTML.length == keyWord.length) {
				//这里先把找到的arr[i]用node代替
				var node = arr[i]
				//对父元素进行展开，把父元素的父元素也要展开视觉上能看到效果
				while (node.nodeName != "SECTION" ) {
					node.parentNode.getElementsByTagName("i")[0].className = "collapseTriangle"
					for (let j = 3; j < node.parentNode.children.length; j++) {
						node.parentNode.children[j].style.display = "block";
					}
					node = node.parentNode;
				}
				//先展开后将该查找到元素变色，效果更好点。
				arr[i].style.backgroundColor = "#ccc";
				count++;
				
			}
			//当前检索文本不满足正则要求的的情况
			else {
				arr[i].style.backgroundColor = "#f60"
			}		
		}
		//当所有节点都被遍历完成完了
		else {
			clearInterval(int)
			if (arr[i - 1].style.backgroundColor != "rgb(204, 204, 204)") {
				arr[i - 1].style.backgroundColor = "#fff";
			}
			//根据结束的时间算出搜索用时
			var endTime = new Date()
			var disTime =((endTime.getTime() - beginTime.getTime())/1000).toFixed(2)
			//完了结束后，给找到的元素加上标记
			for (let i in index) {
				arr[index[i]].style.backgroundColor = "#ccc"
			}
			//如果检索词有查找到相同文本
			if (count > 0) {
				alert("你好，你搜索的关键词是：" + keyWord + "\n共找到了" + count + "个匹配的文本\n此次搜索共用时" + disTime + "s")
			}
			else if (keyWord != ""){
				alert("你好，你搜索的关键词是：" + keyWord + "\n我们找不到匹配的文本\n此次搜索共用时" + disTime + "s")
			}
			//此时代表便利过程结束了，我们可以将int设置为空，满足去增删节点的条件
			int = null;
		}
		i++
	}, speed)
}

//递归模仿中序的深度优先遍历
function  inOrder(node, arr) {
	if (node.children.length >= 2) {
		//如果该节点子元素只有2个，所以只有i标签和p标签，证明无div子元素，可直接加入排序数组
		if (node.children.length ==2) {
			arr.push(node);
		}
		else {
			inOrder(node.children[3], arr);
        	arr.push(node);	
		}
    	// 因为第一个子div下标为3，所以从第四的div加入
    	if (node.children.length > 3) {
    		for (var i = 4; i < node.children.length; i++) {
    			inOrder(node.children[i], arr)
    		}
    	}
	}
}

function postOrder(node, arr) {
	if (node) {
		// 左子树单独作为下一级别？
		postOrder(node.children[3], arr);
		//右子树统一为一个级别然后递归判断
		if (node.children.length > 3) {
			for (var i = 4; i < node.children.length; i++) {
				postOrder(node.children[i], arr)
			}
		}
		arr.push(node);
	}
}

//广度优先遍历
function BFSOrder(node, arr) {
	// 这两个怎么说呢，他们组合起来得到渲染顺序。depth能够根据queue.shift()得到它的所有子节点。
	var queue = []
	var depth = null
	if (node.children.length >= 2) {
		queue.push(node)
	}
	//执行1次得到1个渲染节点。
	while (queue.length > 0) {
		//删除每次第1个节点，并且放入arr里面。
		depth = queue.shift();
		arr.push(depth);
		//找到同一深度的所有节点,子节点大于2证明有子div元素
		if (depth.children.length > 2) {
			//把第一个子div元素节点放在queue队列里面
			queue.push(depth.children[3]);
			depth = depth.children[3];
			//有多个子div元素的时候
			while (depth.nextElementSibling) {
				queue.push(depth.nextElementSibling);
				depth = depth.nextElementSibling;
			}
		}
	}
}	

//初始化页面
for (let i = 1; i < aDiv.length; i++) {
	if (aDiv[i].childNodes.length  > 1) {
		//添加icon
		let icon = document.createElement("i");
		aDiv[i].insertBefore(icon, aDiv[i].childNodes[0])
		icon.className = "collapseTriangle";
	}
	let p = document.createElement("p");
	p.innerHTML = "<span onclick = addNode(this)>添加</span><span onclick = delNode(this)>删除</span><span onclick = reName(this)>重命名</span>"
	aDiv[i].insertBefore(p, aDiv[i].childNodes[2])
}

//初始化DOM操作添加事件
for (var i = 0; i < aDiv.length; i++) {
	aDiv[i].onclick = nodeExpandAndCollapse;
	aDiv[i].onmouseover = showP;
	aDiv[i].onmouseout = hideP;
}

//添加节点
function addNode(node, ev) {
	if (int != null) {
        alert("正在遍历呢，你要是加了节点，就有bug了啊")
    }
    else {
    	//取消冒泡到祖先元素DIV
    	var ev = event || ev;
    	ev.stopPropagation()
    	//prompt传递信息
    	var nodeName = prompt("请输入要添加的文件名", "bendan").trim();
    	//node统一变为要操作DIV
    	node = node.parentNode.parentNode;
    	//创建的新要插入的节点，用DIV作为容器
    	let div = document.createElement("div");
    	if (nodeName !== "" ) {
    		//当node节点下没有子DIV
    		if (node.getElementsByTagName("div").length == 0) {
    			//给父元素加icon和样式
    			let icon = document.createElement("i");
    			icon.className = "collapseTriangle";
    			node.insertBefore(icon, node.childNodes[0])
    		}
    		div.innerHTML = "<span>" + nodeName + "</span><p><span onclick = addNode(this)>添加</span><span onclick = delNode(this)>删除</span><span onclick = reName(this)>重命名</span></p>";
    	}
    	else {
    		if (!node.getElementsByTagName("div").length == 0) {
    			//给父元素加icon和样式
    			let icon = document.createElement("i");
    			icon.className = "collapseTriangle";
    			node.insertBefore(icon, node.childNodes[0])
    		}
    		div.innerHTML = "<span>新建文件</span><p><span onclick = addNode(this)>添加</span><span onclick = delNode(this)>删除</span><span onclick = reName(this)>重命名</span></p>";
    	}
    	//给每一添加的div添加事件
    	div.onclick = nodeExpandAndCollapse;
    	div.onmouseover = showP;
    	div.onmouseout = hideP;
    	node.appendChild(div)
    }
	
}

//删除节点
function delNode(node, ev) {
	if (int != null) {
        alert("正在遍历啊，你要是减少了节点，就有bug啊，还没解决这个问题")
    }
    else {
    	var ev = event || ev;
    	ev.stopPropagation()
    	node = node.parentNode.parentNode;
    	if (node.parentNode.getElementsByTagName("div").length < 2) {
    		//如果父元素没有其余的div元素，则删去icon样式，
    		node.parentNode.getElementsByTagName("i")[0].className = "";
    	}
    	node.parentNode.removeChild(node);
    }
}

//重命名文本
function reName(node, ev) {
	var ev = event || ev;
	ev.stopPropagation()
	var nodeName = prompt("请输入要更改的文件名", "bendan").trim();
	node = node.parentNode.parentNode;
	if  (nodeName !== "") {
		node.getElementsByTagName("span")[0].innerText = nodeName;
	}
	else {
		node.getElementsByTagName("span")[0].innerText = "未命名";
	}
}


// DOM树的折叠与展开
function nodeExpandAndCollapse(ev) {
	var ev = event || window.ev;
	var target = ev.target;
	ev.stopPropagation();
	var node = this;
	//判断是否有子DIV然后根据icon的className决定是展开还是关闭
	if (node.getElementsByTagName("div").length != 0 && node.getElementsByTagName("i")[0].className == "collapseTriangle") {
		console.log(target)
		//因为每个可执行伸缩操作的div固定含有一个放icon的i标签和放内容的span标签和放操作span的P标签。所以从下标3开始才是子div元素
	 	for (let j = 3; j < node.children.length; j++) {
	 		node.children[j].style.display = "none";
	 	}
	 	node.getElementsByTagName("i")[0].className = "expandTriangle";
	}
	else if(node.getElementsByTagName("div").length != 0 && node.getElementsByTagName("i")[0].className == "expandTriangle") {
	 	for (let j = 3; j < node.children.length; j++) {
	 		node.children[j].style.display = "block";
	 	}
	 	node.getElementsByTagName("i")[0].className = "collapseTriangle";
	}
}

//DOM操作单的出现和隐藏
function showP(ev) {
	//禁止元素冒泡
	var ev = event || window.ev;
	var target = ev.target;
	ev.stopPropagation();
	this.getElementsByTagName("p")[0].style.display = "inline-block";	
}
function hideP() {
	this.getElementsByTagName("p")[0].style.display = "none";
}


