//生成我们需要的格子空间
!function () {                    
	//用字符串（数组）代替不必要的DOM操作。
	var tbody = document.getElementById('tbody');
	var table = [];
	var tableStr = "<tr>";
	var tr = [];
	var trStr = "";
	for (let i = 0; i < 10; i++) {
		trStr += "<td></td>"
	}
	for (let i = 0; i < 10; i++) {
		table.push(trStr);
	}
	tableStr += table.join("</tr><tr>") + "</tr>";
	tbody.innerHTML = tableStr;
}()

//生成我们要操作的的小方块并随机产生位置
!function () {
	var box = document.createElement("div");
	box.innerHTML = "<div class='tHead'></div>ben<div class='tBody'></div>"
	box.id = "box";
	box.className = "box";
	box.style.top = Math.floor(Math.random()*10)*50 + "px";
	box.style.left = Math.floor(Math.random()*10)*50 + "px";
	box.style.transform = "rotate(" + 0 + "deg)"
	var container = document.getElementById('container');
	container.appendChild(box)
}()

window.onload = function () {
	var box = document.getElementById("box");
	var table = document.getElementById('table');
	var aTd = document.getElementsByTagName('td');
	var aBtn = document.getElementsByTagName('button');
	var moveFlag = true;	//给文本框的执行来判断是否在执行命令中。如果为true就代表可以执行下一个命令
	var rotateFlag = true;   //同上，判断是否在进行旋转操作
	var moveTimer = null;	//移动函数的定时器
	var rotateTimer = null;	//旋转函数的定时器
	//用一个对象来存储跟这个方块盒子相关的信息
	var boxInfo = {            
		direction: 0,          //定义方块盒子当前的方向 0-3分别为上右下左
		angle: 0,             //定义方块盒子当前的旋转角度

		/**
		 * move方法定义这个小方块怎么运动，朝哪个方向运动，运动距离是多少
		 * @param  {[string]} direction [决定了运动的方向，是上下还是左右]
		 * @param  {[number} long      [决定了运动的距离，根据正负来判断是下（右）还是上（左）]
		 */
		move: function (direction, long) {
			clearInterval(moveTimer)
			moveFlag = false;	//表示正处于一个运动状态（旋转）。
			speed = long / 50;
			var startPos = direction == "top" ? box.offsetTop : box.offsetLeft;
			//简单写了下解决当未完成一个move运动时候继续点击导致位置不到正确边界的bug，不好用。效果很突兀，但是又不想写两个定时器。把上下和左右的分开。
			if (direction == "top") {
				box.style.left = Math.round(box.offsetLeft / 50) * 50 + "px";
			}
			if (direction == "left") {
				box.style.top = Math.round(box.offsetTop / 50) * 50 + "px";
			}

			//保证任意时候点击时都是以当前td边界的位置作为起始值来计算目标值的。
			if (long < 0) {
				startPos = Math.ceil(startPos / 50) * 50;
			}
			else {
				startPos = Math.floor(startPos / 50) * 50;
			}
			var target = startPos + long;        //设定要到达的目标位置
			//如果第一次移动后的位置会超过边界，就不去移动，直接判断这次运动完成
			if ( (startPos + speed) >= 0 && (startPos + speed) <= 450) {
				//上下移动的情况。根据正负值判断是上还是下
				if (direction == "top") {
					//如果当前的位置不能再加上N个speed后刚好到达目标target的位置。就把当前的位置改变下。
					box.style.top = target - Math.round( (target - box.offsetTop) / speed) * speed + "px";
					box.style.top = box.offsetTop + speed + "px";	
					moveTimer = setInterval(function () {
						// 到达0/450的边界情况的处理。提前停止
						if (box.offsetTop === target || box.offsetTop <= 0 || box.offsetTop >= 450) {
							clearInterval(moveTimer)    //clearInterval(moveTimer) 和 moveTimver = null 为什么结果不一样?
							if (box.offsetTop != 0) {
								if (box.offsetTop >= 450) {
									box.style.top = 450 + "px";
								}
								else if (box.offsetTop <= 0) {
									box.style.top = 0 + "px";
								}
							}
							moveFlag = true; //当前运动（旋转）完成后将flag定义为true，证明可以进行下一步操作了。
						}
						else {
							moveFlag =false;
							box.style.top = box.offsetTop + speed + "px";
						}
					}, 25)
				}
				else if (direction == "left") { 
					box.style.left = target - Math.round( (target - box.offsetLeft) / speed) * speed + "px";
					box.style.left = box.offsetLeft + speed + "px";
					moveTimer = setInterval(function () {
						if (box.offsetLeft === target || box.offsetLeft <= 0 || box.offsetLeft >= 450) {
							clearInterval(moveTimer)   
							if (box.offsetLeft != 0) {
								if (box.offsetLeft >= 450) {
									box.style.left = 450 + "px";
								}
								else if (box.offsetLeft <= 0) {
									box.style.left = 0 + "px";
								}
							}
							moveFlag = true;
						}
						else {
							box.style.left = box.offsetLeft + speed + "px";
						}
					}, 25)
				}
			}
			else {
				moveFlag = true;
			}
		},

		/**
	 	* 控制旋转的函数，并根据最后的旋转结果确定方向,这里根据上个任务重新写了下。简单了点。目标要达到的旋转角度可以通过culculateNeedAngle函数得出
	 	* @param  {[type]} angle [提供我们所需要在原本的基础上还需旋转的角度]
	 	*/
		rotate: function(angle=90) {
			rotateFlag = false;
			clearInterval(rotateTimer)
			boxInfo.angle = +box.style.transform.match(/-?\d+/)[0];   //获取当前盒子的angle值
			var speed = angle / 90;    //根据提供的旋转角度angle参数来计算单次的步长。
			var endAngle;			//结束的旋转角度值
			//保证随时点击的时候，都能得到正确的结束angle值（endAngle % 90 = 0）
			if (angle != 0) {
				if (angle > 0) {
					endAngle = Math.floor(boxInfo.angle / 90) * 90 + angle;
				}
				else {
					endAngle = Math.ceil(boxInfo.angle / 90) * 90 + angle;
				}
				rotateTimer = setInterval(function() {
					if ( Math.abs(endAngle - boxInfo.angle) < Math.abs(speed) ) {
						clearInterval(rotateTimer);
						//旋转运动完成确认当前方块盒子的方向
						boxInfo.angle = boxInfo.angle >= 360 ? boxInfo.angle - 360 : boxInfo.angle;
						boxInfo.angle = boxInfo.angle < 0 ? boxInfo.angle + 360 : boxInfo.angle;
						boxInfo.direction = boxInfo.angle / 90;
						box.style.transform = "rotate(" + boxInfo.angle + "deg)"
						rotateFlag = true;  //代表旋转操作的完成
					}
					else {
						boxInfo.angle += speed;
						box.style.transform = "rotate(" + boxInfo.angle +"deg)" 
					}
				},6)
			}
			else {
				rotateFlag = true;
			}
			
		}
	}

	//执行“前进”命令时，根据当前盒子方向去执行boxInfo的move方法。
	function getDirectionAndGo(long=50) {
		if (boxInfo.direction === 0 || boxInfo.direction === 3) {
			long = -long;        //默认long为正值。如果当前盒子头部处于上或者左，则移动矢量为负值。负方向。
		}
		if (boxInfo.direction === 0 || boxInfo.direction === 2) {

			boxInfo.move("top", long);   //上下方向
		}
		else if (boxInfo.direction === 1 || boxInfo.direction === 3) {
			boxInfo.move("left", long)
		}	
	}

	/**
	 * 根据我们要达到的角度，并且已知当前盒子角度的情况下去计算去我们需要旋转的角度值
	 * @param  {[number]} targetAngle [我们要达到的旋转角度值]
	 * @return {[number]} angle       [得出来的需要旋转的角度值,我们可以用这个返回值去执行boxInfo的rotate方法。]
	 */
	function culculateNeedAngle(targetAngle) {
		var angle = targetAngle - boxInfo.angle;
		if (angle > 0) {                       //保证随时点击的时候都能保证我们目标的值angle % 90 = 0;
			angle = Math.ceil(angle / 90) * 90;
		}
		else {
			angle = Math.floor(angle / 90) * 90;
		}
		if (angle === -180) {
			angle = 180;
		}
		else if (angle === 270) {
			angle = -90;
		}
		else if (angle === -270) {
			angle = 90;
		}
		return angle;
	} 

	//根据命令后面跟的数字决定移动多少距离，这里的long是得到是几个单位长度（一个Td格子的边长）
	function getUnitLength(str) {
		var long = str.match(/\d/);
		if (long == null) {
			long = 1;
		}
		return long;
	}
	//每个按钮的执行语句
	for (let i = 0; i <= 12; i++) {
		aBtn[i].onclick = function () {
			switch (i) {
				case 0: {
					getDirectionAndGo();
					break;
				}
				case 1: {
					boxInfo.rotate(-90);
					break;
				}
				case 2: {
					boxInfo.rotate(90);
					break;
				}
				case 3: {
					boxInfo.rotate(180)
					break;
				}					
				case 4: {
					boxInfo.rotate(culculateNeedAngle(0))
					boxInfo.move("top", -50)
					break;
				}
				case 5: {
					boxInfo.rotate(culculateNeedAngle(90))
					boxInfo.move("left", 50)
					break;
				}
				case 6: {
					boxInfo.rotate(culculateNeedAngle(180))
					boxInfo.move("top", 50)
					break;
				}
				case 7: {
					boxInfo.rotate(culculateNeedAngle(270))
					boxInfo.move("left", -50)
					break;
				}
				case 8: {
					boxInfo.move("top", -50)
					break;
				}
				case 9: {
					boxInfo.move("left", 50)
					break;
				}
				case 10: {
					boxInfo.move("top", 50)
					break;
				}
				case 11: {
					boxInfo.move("left", -50)
					break;
				}
				case 12: {
					var command = document.getElementById('command').value.trim();
					var value = document.getElementById('value').value.trim();
					var arr = value.split(/\n+/g);
					var j = 0; 
					var zheng = null;
					var zheng = setInterval(function () { 
						if (j < arr.length) {
							//确保move和rotate方法都没有在执行。因为有的命令是需要两个方法同时进行的，如果只是检验其一的话，会导致错误执行下一个命令
							if (moveFlag && rotateFlag) {
								if (/^GO/i.test(arr[j])) {
									getDirectionAndGo(50 * getUnitLength(arr[j]))
								}
								else if (/^TUN LEF$/i.test(arr[j])){
									aBtn[1].onclick();
								}
								else if (/^TUN RIG$/i.test(arr[j])) {
									aBtn[2].onclick();
								}
								else if (/^TUN BAC$/i.test(arr[j])) {
									aBtn[3].onclick();
								}
								else if (/^MOV TOP/i.test(arr[j])) {
									boxInfo.rotate(culculateNeedAngle(0));
									boxInfo.move("top", -50 * getUnitLength(arr[j]))
								}
								else if (/^MOV RIG/i.test(arr[j])) {
									boxInfo.rotate(culculateNeedAngle(90));
									boxInfo.move("left", 50 * getUnitLength(arr[j]));
								}
								else if (/^MOV BOT/i.test(arr[j])) {
									boxInfo.rotate(culculateNeedAngle(180));
									boxInfo.move("top", 50 * getUnitLength(arr[j]));
								}
								else if (/^MOV LEF/i.test(arr[j])) {
									boxInfo.rotate(culculateNeedAngle(180));
									boxInfo.move("left", -50 * getUnitLength(arr[j]));
								}
								else if (/^TRA TOP/i.test(arr[j])) {
									boxInfo.move("top", -50 * getUnitLength(arr[j]));
								}
								else if (/^TRA RIG/i.test(arr[j])) {
									boxInfo.move("left", 50 * getUnitLength(arr[j]));
								}
								else if (/^TRA BOT/i.test(arr[j])) {
									boxInfo.move("top", 50 * getUnitLength(arr[j]));
								}
								else if (/^TRA LEF/i.test(arr[j])) {
									boxInfo.move("left", -50 * getUnitLength(arr[j]));
								}
								j++;
							}	
						}
						else {
							clearInterval(zheng)
						}
					}, 10)	
					break;
				}
			}
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
			case 87:
				aBtn[4].onclick();
				break;
			case 68:
				aBtn[5].onclick();
				break;
			case 83:
				aBtn[6].onclick();
				break;
			case 65:
				aBtn[7].onclick();
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

// culculate
/*
go
tun lef
go 2 
tun rig
go 3
tun bac
go4
tra top
go5
tra 
tra 
tra rig
go 7
tra bot
go8 
tra lef
go 6
mov top 2
tra bot
go 3
mov bot 5
go2
 */