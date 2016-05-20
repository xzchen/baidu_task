//生成表格
!function () {
	var tbody = document.getElementById('tbody');
	for (var i = 0; i < 10; i++) {
		var tr = document.createElement("tr")
		for (var j = 0; j < 10; j++) {
			var td = document.createElement("td");
			tr.appendChild(td);
		}
		tbody.appendChild(tr);
	}
}()

//生成移动的小方块
!function () {
	var box = document.createElement("div");
	var head = document.createElement("div");
	var body = document.createElement("div");
	box.id = "box";
	head.id = "head";
	body.id = "body";
	var container = document.getElementById('container');
	box.className = "box";
	box.style.top = Math.floor(Math.random()*10)*50 + "px";
	box.style.left = Math.floor(Math.random()*10)*50 + "px";
	head.className = "tHead";
	body.className = "tBody";
	box.appendChild(head);
	box.appendChild(body);
	container.appendChild(box)
}()


window.onload = function () {
	var direction = 0;  //用来标记方向 上右下左分别为0123;
	var box = document.getElementById("box");
	var head = document.getElementById("head");
	var body = document.getElementById("body");
	var table = document.getElementById('table');
	var aTd = document.getElementsByTagName('td');


	//添加事件 
	var aBtn = document.getElementsByTagName('button');
	aBtn[0].onclick = function () {
		//根据head和body所处的位置来判断盒子的方向
		var tHead = head.offsetTop;
		var tBody = body.offsetTop;
		var lHead = head.offsetLeft;
		var lBody = body.offsetLeft;

		//也可以换成用direction来比较，那样比较简单。为了清楚逻辑，就不换了
		if (tHead < tBody) {
			//向上
			if (box.offsetTop == 0) {
				console.log("撞墙了，走不动了，你换个方向")
			}
			else {
				box.style.top = box.offsetTop - 50 + "px";
			}
		}
		else if (tHead > tBody) {
			//向下
			if (box.offsetTop == 450) {
				console.log("撞墙了，走不动了，你换个方向")
			}
			else {
				box.style.top = box.offsetTop + 50 + "px";
			}
		}
		else if (tHead == tBody) {
			if (lHead > lBody) {
				//向右
				if (box.offsetLeft == 450) {
					console.log("撞墙了，走不动了，你换个方向")
				}
				else {
						box.style.left = box.offsetLeft + 50 + "px";
				}
			
			}
			else {
				//向左
				if (box.offsetLeft == 0) {
					console.log("撞墙了，走不动了，你换个方向")
				}
				else {
					box.style.left = box.offsetLeft - 50 + "px";
				}
				
			}
		}
	}

	//每个按钮代表的不同命令
	aBtn[1].onclick = function () {
		if (direction == 0) {
			direction += 3; 
		}
		else {
			direction --;
		}
		renderBox(direction)
	}

	aBtn[2].onclick = function () {
		direction ++;
		renderBox(direction)
	}

	aBtn[3].onclick = function () {
		direction += 2;
		renderBox(direction)
	}

	aBtn[4].onclick = function () {
		var command = document.getElementById('command').value.trim();
		if (/^GO$/i.test(command)) {
			aBtn[0].onclick();
		}
		else if (/^TUN LEF$/i.test(command)){
			aBtn[1].onclick();
		}
		else if (/^TUN RIG$/i.test(command)) {
			aBtn[2].onclick();
		}
		else if (/^TUN BAC$/i.test(command)) {
			aBtn[4].onclick();
		}
	}	

	//键盘上下左右控制移动
	window.onkeydown = function (ev) {
		ev = event || window.event;
		var keyCode = ev.keyCode || ev.which;
		switch (keyCode) {
			case 37:
				aBtn[1].onclick();
				break;
			case 38:
				aBtn[0].onclick();
				break;
			case 39:
				aBtn[2].onclick();
				break;
			case 40:
				aBtn[3].onclick();
				break;
		}
	}

	//点击任意td格子移动到当前位置
	for (var i = 0, len = aTd.length; i < len; i++) {
		aTd[i].onclick = function () {
			box.style.left = this.offsetLeft + "px";
			box.style.top = this.offsetTop + "px";
		}
	}
}

//确定小方块的方向
function renderBox(direction) {
	switch (direction % 4) {
		case 0: {
			head.className = "tHead";
			body.className = "tBody";
			direction = 0;
		}
		break;
		case 1: {
			head.className = "rHead";
			body.className = "rBody";
			direction = 1;
		}
		break;
		case 2: {
			head.className = "bHead";
			body.className = "bBody";
			direction = 2;
		}
		break;
		case 3: {
			head.className = "lHead";
			body.className = "lBody";
			direction = 3;
		}
		break;
	}
	return direction;
}
