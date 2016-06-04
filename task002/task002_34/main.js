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

//随机生成我们要操作的的小方块位置
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
	var aBtn = document.getElementsByTagName('button');
	
	var boxInfo = {            //用一个对象来存储box有关的信息。
		direction: 0,          //定义盒子当前的方向 0-3分别为上右下左
		rotate : 0             //定义盒子当前的旋转角度
	}

	//对于 “前进” 时判断当前box所处的方向和位置。看是否（怎样）执行go函数
	var goTimer = null;
	aBtn[0].onclick = function () {
		clearInterval(goTimer)
		if (boxInfo.direction === 0) {
			//向上
			if (box.offsetTop > 0) {
				go("top", -50)
			}
		}
		else if (boxInfo.direction === 2) {
			//向下
			if (box.offsetTop < 450) {
				go("top", 50)
			}
		}
		else if (boxInfo.direction === 1) {
			//向右
			if (box.offsetLeft < 450) {
				go("left", 50)
			}
		}	
		else {
			//向左
			if (box.offsetLeft > 0) {
				go("left", -50)
			}
		}	
	}

	/**
	 * 对于 “前进” 要执行的函数
	 * @param  {[string]} direction [判断是上下还是左右行进]
	 * @param  {[type]} long      [根据传来的值的正负来决定是上还是下  或者 是左还是右]
	 * @return {[type]}           [description]
	 */
	function go(direction, long) {
		speed = long / 50;
		if (direction == "top") {
			box.style.top = box.offsetTop + speed + "px";
			goTimer = setInterval(function () {
				if (box.offsetTop % 50 == 0) {
					clearInterval(goTimer)
					goTimer = null;
				}
				else {
					box.style.top = box.offsetTop + speed + "px";
				}
			}, 20)
		}
		else {
			box.style.left = box.offsetLeft + speed + "px";
			goTimer = setInterval(function () {
				if (box.offsetLeft % 50 == 0) {
					clearInterval(goTimer)
					goTimer = null;
				}
				else {
					box.style.left = box.offsetLeft + speed + "px";
				}
			}, 20)
		}
	}

	//防止在没有执行完 go函数之前进行转向操作，各个按钮执行的操作。
	for (let i = 1; i <= 12; i++) {
		aBtn[i].onclick = function () {
			if (goTimer == null) {
				switch (i) {
					case 1: {
						rotateBox(-90)
						break;
					}
					case 2: {
						rotateBox(90)
						break;
					}
					case 3: {
						rotateBox(180)
						break;
					}					
					case 4: {
						rotateBox("", 0)
						break;
					}
					case 5: {
						rotateBox("", 90)
						break;
					}
					case 6: {
						rotateBox("", 180)
						break;
					}
					case 7: {
						rotateBox("", 270)
						break;
					}
					case 8: {
						if (box.offsetTop > 0) {
							go("top", -50)
						}
						break;
					}
					case 9: {
						if (box.offsetLeft < 450 ) {
							go("left", 50)
						}
						break;
					}
					case 10: {
						if (box.offsetTop < 450) {
							go("top", 50)
						}
						break;
					}
					case 11: {
						if (box.offsetLeft > 0) {
							go("left", -50)
						}
						break;
					}
					case 12: {
						var command = document.getElementById('command').value.trim();
						if (goTimer == null) {
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
								aBtn[3].onclick();
							}
							else if (/^MOV TOP$/i.test(command)) {
								aBtn[4].onclick();
							}
							else if (/^MOV RIG$/i.test(command)) {
								aBtn[5].onclick();
							}
							else if (/^MOV BOT$/i.test(command)) {
								aBtn[6].onclick();
							}
							else if (/^MOV LEF$/i.test(command)) {
								aBtn[7].onclick();
							}
							else if (/^TRA TOP$/i.test(command)) {
								aBtn[8].onclick();
							}
							else if (/^TRA RIG$/i.test(command)) {
								aBtn[9].onclick();
							}
							else if (/^TRA BOT$/i.test(command)) {
								aBtn[10].onclick();
							}
							else if (/^TRA LEF$/i.test(command)) {
								aBtn[11].onclick();
							}
						}
						break;
					}
				}
			}
		}
	}
	
	var timer = null;
	/**
	 * 控制旋转的函数，并根据最后的旋转结果确定方向
	 * @param  {[type]} rotate [对于只要求旋转的命令，只用提供当前要旋转的度数]
	 * @param  {[type]} target [对于要求旋转到某个固定方向的命令，需要提供要旋转到的度数]
	 */
	function rotateBox(rotate, target) {
		clearInterval(timer)
		boxInfo.rotate = boxInfo.rotate % 360;  //每次点击得到当前的rotate值
		if (boxInfo.rotate < 0) {
			boxInfo.rotate = 360 + boxInfo.rotate;
		}
		var argumentLength = arguments.length  //判断下当前函数有几个实参
		var endRotate = argumentLength == 2 ? target: boxInfo.rotate + rotate;   //根据提供的参数来确定最后的终止值
		var speed = argumentLength == 2 ? Math.round((endRotate-boxInfo.rotate)/20) : rotate/20;  //根据提供的参数来确定每帧旋转的速度。
		if (speed == 0) {
			speed = 1;                //多次速度点击（至上/右使得endRotate和boxInfo.rotate及其接近，没有这个的话，盒子就不会运动了）
		}
		/*box.style.transformOrigin = "0 0";  //修改旋转原点*/
		// 防止多次点击使得endRotae除90不尽的情况出现bug
		if (endRotate % 90 != 0) {
			endRotate = Math.round(endRotate/90) * 90;
		}
	
		//因为速度是不固定的，防止因为速度的原因当前boxInfo累加速度后不等于目标值的情况。所以要修改下当前的rotate值
		if (endRotate - boxInfo.rotate != 0) {
			if ((endRotate - boxInfo.rotate) % speed != 0) {
				boxInfo.rotate = (endRotate - boxInfo.rotate) % speed + boxInfo.rotate;
			}
		}
		
		timer = setInterval(function() {
			if (boxInfo.rotate == endRotate) {
				clearInterval(timer);
				//这里判断不太好。可能写到函数里判断比较好。这样的话每次都要判断一次。
				//完成后，对当前旋转角度进行判断来确定当前方向。（如果角度为负值，则对应转成相应正值）
				if (boxInfo.rotate < 0) {
					boxInfo.rotate = 360 + boxInfo.rotate;
				} 
				//再根据当前的旋转到的角度来判断方块所处的方向0-3分别为上右下左
				if (boxInfo.rotate == 0) {
					boxInfo.direction = 0;
					//如果有2个参数，说明还需要进行行进命令，故执行go函数
					if (argumentLength == 2) {
						aBtn[0].onclick();
					}
				}
				else if (boxInfo.rotate == 90) {
					boxInfo.direction = 1;
					if (argumentLength == 2) {
						aBtn[0].onclick();
					}
				}
				else if (boxInfo.rotate == 180) {
					boxInfo.direction = 2;
					if (argumentLength == 2) {
						aBtn[0].onclick();
					}
				}
				else {
					boxInfo.direction = 3;
					if (argumentLength == 2) {
						aBtn[0].onclick();
					}
				}
			}
			else {
				boxInfo.rotate += speed;
				box.style.transform = "rotate(" + boxInfo.rotate  + "deg)";
			}
		}, 20)
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
