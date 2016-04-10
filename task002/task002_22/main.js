//获取操作元素
var container = document.getElementById("container")
var aDiv = container.getElementsByTagName("div")
var form = document.getElementById("form")
var aBtn = form.getElementsByTagName("button")
var text = document.getElementById("text")
//记录渲染顺序的数组和定时器
var arr = []
var int = null
var da = new Date()
window.onload = function () {
	//写事件监听，不影响它们各自的点击事件，又减少了代码重复量
	for (var i = 0; i < aBtn.length; i++) {
		aBtn[i].addEventListener("click", function () {
			//写了好多次还是不长记性，记得清空数组。。。这次测试好了久，才确定自己确实是关了定时器的，只是每次点击的时候增加了数组元素
			arr = [];
			speed = text.value;		
		})
	}

	aBtn[0].onclick = function () {
		for (var i = 0; i < aDiv.length; i++) {
			arr.push(aDiv[i]);
		}
		//设置button事件监听后，测试发现是按顺序执行，所以把render（）放这里。不能统一放事件监听那里。
		render(arr, speed);	
	}

	aBtn[1].onclick = function () {
		inOrder(aDiv[0], arr);
		render(arr, speed);	
	}

	aBtn[2].onclick = function () {
		postOrder(aDiv[0], arr);
		render(arr, speed);	
	}	
}

//传入了根节点和渲染顺序的数组
function  inOrder(node, arr) {
		if (node) {
	        inOrder(node.firstElementChild, arr);
        	arr.push(node);
	        inOrder(node.lastElementChild,  arr);
		}
}

function postOrder(node, arr) {
	if (node) {
		postOrder(node.firstElementChild, arr);
		postOrder(node.lastElementChild, arr);
		arr.push(node);
	}
}

//将传入的数据定时渲染，arr存储的是节点渲染顺序，speen是渲染速度
function render(arr, speen) {
	//设置这段是为了重复点击后立即重新开始，为了刷掉之前已经改变的颜色
	for (let i = 0; i < arr.length; i++) {
		arr[i].style.backgroundColor = "#fff"
	}
	//立即将第一个颜色改变
	arr[0].style.backgroundColor = "#f60"
	var i = 1;
	clearInterval(int);
	int = setInterval(function (){
		if ( i < arr.length) {
			for (let i = 0; i < arr.length; i++) {
				arr[i].style.backgroundColor = "#fff";
			}
			arr[i].style.backgroundColor = "#f60";
			i++;
		}
		else {
			clearInterval(int);
			arr[i-1].style.backgroundColor = "#fff";
		}
	},speed)	  		
}
