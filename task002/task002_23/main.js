//获取操作元素
var container = document.getElementById("container")
var aDiv = container.getElementsByTagName("div")
var form = document.getElementById("form")
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
	/*aBtn[4].onclick = function () {
		BFSOrder(aDiv[0], arr)
		//这本来是单独写了个广度优先的搜索，然后发现可以复用，就给每个按钮都加了搜索功能
		getKeyWord(keyWord, arr, index)
		search(arr, speed, index)
		if (!keyWord.value.trim()) {
			alert ("请输入搜索值")
		}
		else {
			BFSOrder(aDiv[0], arr);
			var reg = new RegExp (keyWord.value, "i")
			for (let i in arr) {
				//匹配相同元素
				if (reg.test(arr[i].childNodes[0].nodeValue)) {
			        index.push(i)
			        console.log(index)
				}
			}
			console.log(index)
			search(arr, speed, index)
		}
	}*/	
		//突然明白事件监听的好了，刚已经给每个button都加了这几句了，现在这样好看多了，没那么多重复的。
	for (var j = 0; j < aBtn.length; j++) {
		aBtn[j].addEventListener("click", function () {
			index = []
			getKeyWord(keyWord, arr, index)
			search(arr, speed, index)	
		})
	}	
}

//arr是存储的节点渲染顺序，index存储的是与搜索关键词keyword匹配的节点下标
function getKeyWord (keyword, arr, index) {
	if (keyWord.trim() != "") {
		reg = new RegExp ("^"+keyWord,"i");
		for (var i in arr) {
			//为了即支持大小写又必须完全一样，不能输入a就要匹配acd之类的。加了个trim()去掉周围空格
			if( (reg.test(arr[i].childNodes[0].nodeValue)) && (arr[i].childNodes[0].nodeValue.trim().length == keyWord.length)) {
				// console.log(arr[i].childNodes[0].nodeValue.trim().length)
				index.push(i)
			}
		}	
	} 
}

//根据渲染的顺序arr，和渲染间隔速度speed及确定与搜索词相同的顺序下标来渲染（搜索）
function search (arr, speed, index) {
	// 获得开始搜索的时间
	var beginTime = new Date()
	//保证每次点击时所有颜色标记被清空
	for (let i = 0; i < arr.length; i++) {
		arr[i].style.backgroundColor = "#fff"
	}
	
	//判断第一个节点是否为匹配节点
	if (index[0] == 0) {
		arr[0].style.backgroundColor = "#ccc"
	}
	else {
		arr[0].style.backgroundColor = "#f60"
	}
	var i = 1;
	//关闭定时器，防止多个定时器同时存在
	clearInterval(int) 
	int = setInterval(function() {
		for (let i = 0; i < arr.length; i++) {
			arr[i].style.backgroundColor = "#fff"
		}
		// 根据i值判断渲染到那个节点（按顺序）了。
		if (i < arr.length) {
			//先统一为#f60这个颜色
			arr[i].style.backgroundColor = "#f60"
			//如果刚好这个节点文本内容同检索词一样，就改变它的颜色，表示被检索到了。这里可以改进下，这里没有让标记一直存在，而是检索完后跳出，体验不太好。
			for (var j in index) {
				if (i == index[j]) {
					arr[i].style.backgroundColor = "#ccc"
				}
			}		
		}
		//当所有节点都被渲染完了
		else {
			clearInterval(int)
			arr[i - 1].style.backgroundColor = "#fff"
			//根据结束的时间算出搜索用时
			var endTime = new Date()
			var disTime =((endTime.getTime() - beginTime.getTime())/1000).toFixed(2)
			//完了结束后，给找到的元素加上标记
			for (let i in index) {
				arr[index[i]].style.backgroundColor = "#ccc"
			}
			//如果检索词有查找到相同文本
			if (index.length > 0) {
				alert("你好，你搜索的关键词是：" + keyWord + "\n共找到了" + index.length + "个匹配的文本\n此次搜索共用时" + disTime + "s")
			}
			else if (keyWord != ""){
				alert("你好，你搜索的关键词是：" + keyWord + "\n我们找不到匹配的文本\n此次搜索共用时" + disTime + "s")
			}
		}
		i++
	}, speed)
}

//递归模仿中序的深度优先遍历
function  inOrder(node, arr) {
	if (node) {
        inOrder(node.firstElementChild, arr);
        arr.push(node);	
    	// 我天，居然真写出来，记录下，改了好多次,虽然现在就3行
    	if (node.children.length > 1) {
    		for (var i = 1; i < node.children.length; i++) {
    			inOrder(node.children[i], arr)
    		}
    	}
	}
}

function postOrder(node, arr) {
	if (node) {
		// 左子树单独作为下一级别？
		postOrder(node.firstElementChild, arr);
		//右子树统一为一个级别然后递归判断
		if (node.children.length > 1) {
			for (var i = 1; i < node.children.length; i++) {
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
	if (node) {
		queue.push(node)
	}
	//执行1次得到1个渲染节点。
	while (queue.length > 0) {
		//删除每次第1个节点，并且放入arr里面。
		depth = queue.shift();
		arr.push(depth);
		//找到同一深度的所有节点，
		if (depth.children[0]) {
			//把第一个子节点放在queue队列里面
			queue.push(depth.children[0]);
			depth = depth.children[0]
			//当有多个子节点时，都加入到queue队列里面
			while (depth.nextElementSibling) {
				queue.push(depth.nextElementSibling);
				depth = depth.nextElementSibling;
			}
		}
	}
}	
