window.onload = function () {
	var main = document.getElementById('main');
	var aBox = getClass(main, "box");

	//点击出原图和遮罩层。
	for (let i = 0, len = aBox.length; i < len; i++) {
		aBox[i].onclick = function () {
			var mask = document.getElementById('mask');
			if (mask.style.display != "block") {
				mask.style.display = "block";
			}
			var imgSrc = aBox[i].getElementsByTagName('img')[0].src;
			var img = document.createElement("img");
			img.src = imgSrc;
			mask.appendChild(img)
		}
		mask.onclick = function () {
			mask.innerHTML = "";
			mask.style.display = "none";
		}
	}

	//执行函数加载页面。这里是直接确定图片的宽度来得到列数的。好看点。看要不根据列数来确定图片宽度。
	var render = function() {	
		// 确定页面宽度，然后根据每个盒子跨度来确定列数
		var mainWidth = main.offsetWidth;
		var boxWidth = 216;
		var clos = Math.floor(mainWidth / boxWidth);
		
		//根据列数得到每列起始高度值
		var perCloHeight = [];  //用来存储每列高度值的数组
		for (let i = 0; i < clos; i++) {
			perCloHeight.push(aBox[i].offsetHeight);
			aBox[i].style.position = "absolute";
			aBox[i].style.left = i * boxWidth + "px";
			aBox[i].style.top = 0 + "px";
		}
		
		var minHeight; //定义我们要求的N列中高度最小的值
		for (let i = clos, len = aBox.length; i < len; i++) {
			var curHeight = aBox[i].offsetHeight;
			minHeight = perCloHeight[0]
			//找到存储各列高度的数组中高度最小的一列
			for (let j = 1; j < perCloHeight.length; j++) {
				if (perCloHeight[j] < minHeight) {
					minHeight = perCloHeight[j];
				}
			}
			
			var index;  //定义我们要寻找的高度最小一列的序号
			for (let j = 0; j < perCloHeight.length; j++) {
				if (minHeight == perCloHeight[j]) {
					index = j;
				}
			}
			
			//将当前盒子根定位到正确的位置。
			aBox[i].style.position = "absolute";
			aBox[i].style.left = index * boxWidth + "px";
			aBox[i].style.top = minHeight + "px";
			perCloHeight[index] += aBox[i].offsetHeight;
			
		}
	}
	render();
	//页面缩放的时候重新加载图片。（图片看怎么能无限获取。？）
	window.onresize = render;
}

/*
getClass函数。通过指定的class获得元素
 */
function getClass(parentNode, target) {
	var childNodes = parentNode.getElementsByTagName("*");
	var result = [];
	for (let i = 0, len = childNodes.length; i < len; i++) {
		if (childNodes[i].className == target) {
			result.push(childNodes[i])
		}
	}
	return result;
}

//Q1：L23；
//Q2: L67;