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
	var table = document.getElementById('table');
	table.innerHTML += "<div id = 'box' class = 'box'><div class='tHead'></div>ben<div class='tBody'></div></div>";
	var box = document.getElementById('box');
	/*box.style.top = Math.floor(Math.random()*10)*50 + "px";
	box.style.left = Math.floor(Math.random()*10)*50 + "px";*/
	box.style.top = 450 + "px";
	box.style.left = 450 + "px";
}()

//根据命令后面跟的数字决定移动多少距离，这里的long是得到是几个单位长度（一个Td格子的边长）
function getUnitLength(str) {
	var long = str.match(/\d/);
	if (long == null) {
		long = 1;
	}
	return long;
}

window.onload = function () {
	var box = document.getElementById("box");
	var table = document.getElementById('table');
	var aTd = document.getElementsByTagName('td');  //所有的指令按钮（不包括命令面板的）
	var aBtn = document.getElementsByTagName('button');
	var moveFlag = true;	//给文本框的执行来判断是否在执行命令中。如果为true就代表可以执行下一个命令
	var rotateFlag = true;   //同上，判断是否在进行旋转操作
	var moveTimer = null;	//移动函数的定时器
	var rotateTimer = null;	//旋转函数的定时器
	var count = 0;
	var arrTd = [];			//把Td用二维数组表示，这样方便定位。如arrTd[3][5]。表示第3行，第5列（从0行0列开始起）
	for (let i = 0; i < 10; i++) {
		arrTd[i] = [];
	}
	for (let i = 0; i < 10; i++) {
		for (let j = 0; j < 10; j++) {
			arrTd[i].push(aTd[count]);
			count++
		}
	}

	//用一个对象来存储跟这个方块盒子相关的信息
	var boxInfo = {            
		direction: 0,          //定义方块盒子当前的方向 0-3分别为上右下左
		angle: 0,             //定义方块盒子当前的旋转角度
		rows: box.offsetTop / 50,   //定义方块盒子当前所处的行（从0起）
		cols: box.offsetLeft / 50,	//定义方块盒子当前所处的列（从0起）
		/**
		 * move方法定义这个小方块怎么运动，朝哪个方向运动，运动距离是多少
		 * @param  {[string]} direction [决定了运动的方向，是上下还是左右]
		 * @param  {[number} long      [决定了运动的距离，根据正负来判断是下（右）还是上（左）]
		 * .....写到现在发现这个move方法好长。。。感觉不太好。没有注释都无法重新理解意思了。看看改时间要不把提出单独的函数来
		 */
		move: function (direction, long) {
			clearInterval(moveTimer)
			//简单写了下解决当未完成一个move运动时候继续点击导致位置不到正确边界的bug，不好用。效果很突兀，但是又不想写两个定时器。把上下和左右的分开。
			if (direction == "top") {
				box.style.left = Math.round(box.offsetLeft / 50) * 50 + "px";
			}
			if (direction == "left") {
				box.style.top = Math.round(box.offsetTop / 50) * 50 + "px";
			}

			speed = long / 50;
			var startPos = direction == "top" ? box.offsetTop : box.offsetLeft;
			//保证任意时候点击指令按钮时都是以当前td边界的位置作为起始值来计算目标值的。
			if (long < 0) {
				startPos = Math.ceil(startPos / 50) * 50;
			}
			else {
				startPos = Math.floor(startPos / 50) * 50;
			}
			var target = startPos + long;        //设定要到达的目标位置
			//如果第一次移动后的位置会超过边界，就不去移动，直接判断这次运动完成
			//（满足是否去运动的条件。判断是否有障碍（墙/边界） 或许可以写个函数。但是这样就要区分是上下还是左右运动）
			if ( (startPos + speed) >= 0 && (startPos + speed) <= 450) {
				moveFlag = false;	//表示正处于一个运动状态（旋转）。
				let index;   //存放我们要去测试我们将会移动到的TD格子的序号。如果是上下，则记录的是行数。左右记录列数。
				//上下移动的情况。根据speed正负值判断是上还是下。另外处于上下移动的时候，我们的小方块所在的列数就不会变化。
				if (direction == "top") {
					if (speed < 0) {   //代表向上
						index = boxInfo.rows - 1;  //设定了index的初始检验值。
					}
					else {
						index = boxInfo.rows + 1;
					}
					//判断将会移动到的下一个td格子是否是“墙”，是则退出move这个函数。并且告知commandTimer判定这个指令完成了。
					if (arrTd[index][boxInfo.cols].className == "wall") {
						moveFlag = true;
						return false;
					}

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
							boxInfo.rows = box.offsetTop / 50;
							moveFlag = true; //当前运动（旋转）完成后将flag定义为true，证明可以进行下一步操作了。
						}
						else {
							box.style.top = box.offsetTop + speed + "px";
							//判断是否下一个TD格子是否是墙障碍。不能用 box.offsetTop % 50 == 0来判断，这样当步长不能不能被50的倍数整除时就不会满足条件
							if (Math.abs(Math.round(box.offsetTop / 50) * 50 - box.offsetTop) < Math.abs(speed)) {
								boxInfo.rows = Math.round(box.offsetTop / 50);  //把小方块格子的所处的行重新赋值一下
								//因为boxInfo.cols在上下运动时不会改变，每次只是改变的boxInfo.rows。所以只是每次运动到TD格子边界都是td的序号格子加减10。有点小问题。虽然每次，但是如果在运动中途点击改变了位置。index位置就会发生错乱
								if (speed < 0) {
									index = boxInfo.rows - 1;
								}
								else {
									index = boxInfo.rows + 1;
								}
								//为了防止超过aTd的下标之后报错
								if (0 <= index && index <= 9) {
									if (arrTd[index][boxInfo.cols].className == "wall") {
										clearInterval(moveTimer);
										box.style.top = boxInfo.rows * 50 + "px";  //当是因为步长不能被50的倍数整除时就停止了运动后其位置能回到正确的格子边界
										moveFlag = true;
									}
								}
							} 
						}
					}, 25)
				}
				else if (direction == "left") { 
					if (speed < 0) {   //代表向左
						index = boxInfo.cols - 1;
					}
					else {
						index = boxInfo.cols + 1;
					}
					//判断在移动的时候是否遇到墙的阻碍，是则退出move这个函数。并且告知commandTimer判定这个指令完成了。
					if (arrTd[boxInfo.rows][index].className == "wall") {
						moveFlag = true;
						return false;
					}
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
							boxInfo.cols = box.offsetLeft / 50;
							moveFlag = true;
						}
						else {
							box.style.left = box.offsetLeft + speed + "px";
							if (Math.abs(Math.round(box.offsetLeft / 50) * 50 - box.offsetLeft) < Math.abs(speed)) {
								boxInfo.cols = Math.round(box.offsetLeft / 50);  //把小方块格子的所处的行重新赋值一下
								if (speed < 0) {
									index = boxInfo.cols - 1;
								}
								else {
									index = boxInfo.cols + 1;
								}
								if (0 <= index && index <= 99) {
									if (arrTd[boxInfo.rows][index].className == "wall") {
										clearInterval(moveTimer);
										box.style.left = boxInfo.cols * 50 + "px";  //当是因为步长不能被50的倍数整除时就停止了运动后其位置能回到正确的格子边界
										moveFlag = true;
									}
								}
							} 
						}
					}, 25)
				}
			}
		},

		/**
	 	* 控制旋转的函数，并根据最后的旋转结果确定方向,这里根据上个任务重新写了下。简单了点。目标要达到的旋转角度可以通过culculateNeedAngle函数得出
	 	* @param  {[type]} angle [提供我们所需要在原本的基础上还需旋转的角度]
	 	*/
		rotate: function(angle=90) {
			rotateFlag = false;
			clearInterval(rotateTimer)
			boxInfo.angle = +box.style.transform.match(/-?\d+/);   //获取当前盒子的angle值
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
			
		},

		/*moveTo: function (x, y) {
			console.log(x + "," + y);
			var openList = [];
			var closeList = [];
			closeList.push(arrTd[boxInfo.rows][boxInfo.cols])
			// openList.push(arrTd[boxInfo.rows - 1][boxInfo.cols])
			var g = 1;
			var nowRows = boxInfo.rows;
			var nowCols = boxInfo.cols;
			judgeIsOpenListandCountSocre(g, nowRows - 1, nowCols, openList)
			judgeIsOpenListandCountSocre(g, nowRows, nowCols + 1, openList)
			judgeIsOpenListandCountSocre(g, nowRows + 1, nowCols, openList)
			judgeIsOpenListandCountSocre(g, nowRows, nowCols - 1, openList)
			console.log(openList)
			for (let i = 0; i < openList.length; i++) {
				console.log(openList[i].fScore + "i")
			}
			for (let i = 0; i < openList.length - 1; i++) {

				if (openList[i].fScore < openList[i + 1].fScore) {
					var temp = openList[i].fScore;
					openList[i].fScore = openList[i + 1].fScore;
					openList[i + 1].fScore = temp;
				}
			}
			for (let i = 0; i < openList.length; i++) {
				console.log(openList[i].fScore + "i")
			}
			//添加分值最小最近的那个作为下一个起点
			closeList.closeList[openList[0]];
		}*/
	}

	function judgeIsOpenListandCountSocre(g, rows, cols, openList) {
		if ( 0 <= rows && 0 <= cols && rows <= 9 && cols <= 9 && arrTd[rows][cols].className != "wall") {
			openList.push(arrTd[rows][cols]);
			let h = Math.abs(3 - rows) + Math.abs(6 - cols)
			arrTd[rows][cols].fScore = g + h;
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

	function getDirectionAndBuildWall(nowY, nowX) {
		if (boxInfo.direction === 0) {
			if (checkIsWallOrBorder(boxInfo.rows - 1, boxInfo.cols)  === false) {
				arrTd[nowY - 1][nowX].className = "wall";
			}
		}
		else if (boxInfo.direction === 1){
			if (checkIsWallOrBorder(boxInfo.rows, boxInfo.cols + 1)  === false) {
				arrTd[nowY][nowX + 1].className = "wall";
			}
			
		}
		else if (boxInfo.direction === 2){
			if (checkIsWallOrBorder(boxInfo.rows + 1, boxInfo.cols) === false) {
				arrTd[nowY + 1][nowX].className = "wall";
			}
		}
		else if (boxInfo.direction === 3){
			if (checkIsWallOrBorder(boxInfo.rows, boxInfo.cols - 1)  === false) {
				arrTd[nowY][nowX - 1].className = "wall";
			}
		}
	}

	function checkIsWallOrBorder(rows, cols) {
		if (0 <= rows && rows <= 9 && 0 <= cols && cols <= 9) {
			if (arrTd[rows][cols].className == "wall") {
				return true;
			}
			else {
				return false;
			}
		}
	}

	function getDirectionAndBruWall (nowY, nowX, str) {
		if (boxInfo.direction === 0) {
			if (checkIsWallOrBorder(nowY - 1, nowX) === true) {
				arrTd[nowY - 1][nowX].style.backgroundColor = str;
			} 
		}
		else if (boxInfo.direction === 1){
			if (checkIsWallOrBorder(nowY, nowX + 1) === true) {
				arrTd[nowY][nowX + 1].style.backgroundColor = str;
			}
		}
		else if (boxInfo.direction === 2){
			if (checkIsWallOrBorder(nowY + 1, nowX) === true) {
				arrTd[nowY + 1][nowX].style.backgroundColor = str;
			}
		}
		else if (boxInfo.direction === 3){
			if (checkIsWallOrBorder(nowY, nowX - 1) === true) {
				arrTd[nowY][nowX - 1].style.backgroundColor = str;
			}
		}
	}
	//每个按钮的执行语句
	for (let i = 0; i <= 11; i++) {
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
			}
		}
	}
	

	//键盘上下左右/WASD控制移动
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

	//点击任意td格子移动到当前位置（有墙则不可移动）
	for (var i = 0, len = aTd.length; i < len; i++) {
		aTd[i].onclick = function () {
			if (this.className != "wall") {
				box.style.left = this.offsetLeft + "px";
				box.style.top = this.offsetTop + "px";
				boxInfo.rows = box.offsetTop / 50;
				boxInfo.cols = box.offsetLeft / 50;
			}
		}
	}

	/*for (var i = 0, len = aTd.length; i < len; i++) {
		aTd[i].onrightclick= function () {
			console.log(1)
			if (this.className != "wall") {
				box.style.left = this.offsetLeft + "px";
				box.style.top = this.offsetTop + "px";
				boxInfo.rows = box.offsetTop / 50;
				boxInfo.cols = box.offsetLeft / 50;
			}
			return false;
		}
	}
	table.onrightclick = function () {
		console.log("ta")
	}*/



	var run = document.getElementById('run');
	var index = document.getElementById('index');
	var commandList = document.getElementById('commandList');
	
	/**
	 * 检查我们输入的指令，给其加上对应的序号。对于不合法的指令，根据要求判断是否标识出来。
	 * @param  {[type]} flag [对于需要执行指令的时候，听过flag参数，代表需要标识不合法的指令。
	 */
	function renderIndexAndCheckValidity(flag) {
		var commandArr = commandList.value.split(/\n/);
		var str = "<li>";
		var arr = [];
		for (let i = 0, len = commandArr.length; i < len; i++) {
			commandArr[i] = commandArr[i].trim()
			//在有需求验证命令是否合法的情况下，并且该项指令不合法才标识为不合法。否则同意正常显示。
			if (!checkCommand(commandArr[i]) && flag) {   
				arr.push("<li class='wrong'>" + (i+1))  //这样的话略微有点小问题。因为写到HTML里是，遇到<li>缺少对应的闭合标签</li>的时候会自动补齐。所以一这样写，经过join加入到str时经过HTML会多一个空的<li></li>.但是因为整个ol具有list-style：none的属性，所以看不出来。也可以直接累加str去解决。
			}
			else {
				arr.push((i+1));
			}
		}
		str += arr.join("<li>") + "<li>";
		index.innerHTML = str;
	}
	renderIndexAndCheckValidity();

	//在命令面板里输入指令的时候，就重新刷新序号。并且关闭当前定时器。
	commandList.oninput = function () {
		renderIndexAndCheckValidity();
		clearInterval(commandTimer);
	}

	var refresh = document.getElementById('refresh');
	//清空命令面板
	refresh.onclick = function () {
		index.innerHTML = "<li>" + 1 + "</li>";
		commandList.value = "";  
		clearInterval(commandTimer);
	}

	//验证单个指令是否合法的正则。
	function checkCommand(strc) {
		var commandReg = /^GO\s*\d?\s*$|^TUN LEF\s*\d?$|^TUN RIG\s*\d?$|^TUN BAC\s*\d?$|^MOV TOP\s*\d?\s*$|^MOV RIG\s*\d?\s*$|^MOV BOT\s*\d?\s*$|^MOV LEF\s*\d?\s*$|^TRA TOP\s*\d?\s*$|^TRA RIG\s*\d?\s*$|^TRA BOT\s*\d?\s*$|^TRA LEF\s*\d?\s*$|^MOVE TO\s*\d\s*,\s*\d\s*\s*$|^BUILD\s*$|^BRU\s*/i
		if (commandReg.test(strc)) {
			return true;
		}
		else {
			return false;
		}
	}

	//滚动事件。指令序号同步滚动
	commandList.onscroll = function () {
		index.scrollTop = commandList.scrollTop;
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


	//随机建墙。
	var bulid = document.getElementById('build');
	build.onclick = function () {
		var x = Math.floor(Math.random() * 10);
		var y = Math.floor(Math.random() * 10);
		createWall(x,y);
	}
	function createWall(x, y) {
		let index = x + 10 * y;
		aTd[index].className = "wall"
	}

	var commandTimer = null;
	//执行所有合法的指令
	run.onclick = function () {
		var arr = commandList.value.trim().split("\n");
		//保证每条指令前方有空格也能正常执行
		for (let i = 0; i < arr.length; i++) {
			arr[i] = arr[i].trim()
		}
		var aLi = index.getElementsByTagName("li");
		var flag = true;
		renderIndexAndCheckValidity("flag");   //执行验证函数。看所有指令是否合法。因为带有参数，自带验证效果

		//经过验证后，如果找到一个不合法的指令（标志指令不合法的是对应的li具有wrong的class），就将flag设置为false，不会执行所有指令
		for (let i = 0, len = aLi.length; i < len; i++) {
			if (aLi[i].className == "wrong") {
				flag = false;
				break;
			}
		}

		commandList.scrollTop = 0;
		//当所有指令都是合法的话，执行指令
		if (flag) {
			clearInterval(commandTimer)
			let i = 0; 
			aLi[0].className = "active";  //立即将第一个指令标志位正在执行状态
			//开个定时器，定时去验证当前是否没有进行旋转或者移动操作
			commandTimer = setInterval(function () { 
				//当指令未完成就不会关闭这个定时器
				if (i < arr.length) {
					//确保move和rotate方法都没有在执行。因为有的命令是需要两个方法同时进行的，如果只是检验其一的话，会导致错误执行下一个命令
					if (moveFlag && rotateFlag) {
						//执行完一屏的任务之后就滚动到下一屏（一屏30条指令高度为540PX）
						if (i % 30 == 0) {
							commandList.scrollTop = i / 30 * 540  //因为之前写了个当comandList滚动的时候，序号也会跟着滚动的函数。所以不用再写
						}
						//动态标志出当前正在执行的指令，从1开始，否则j-1的下标会越界。
						if (i != 0) {
							aLi[i - 1].className = "";
						}
						aLi[i].className = "active";
						
						//每个合法指令对应的执行函数,即使这个函数并不被执行也会继续执行下一条指令
						if (/^GO/i.test(arr[i])) {
							getDirectionAndGo(50 * getUnitLength(arr[i]))
						}
						else if (/^TUN LEF/i.test(arr[i])){
							boxInfo.rotate(-90 * getUnitLength(arr[i]))
						}
						else if (/^TUN RIG/i.test(arr[i])) {
							boxInfo.rotate(90 * getUnitLength(arr[i]))
						}
						else if (/^TUN BAC/i.test(arr[i])) {
							boxInfo.rotate(180 * getUnitLength(arr[i]))
						}
						else if (/^MOV TOP/i.test(arr[i])) {
							boxInfo.rotate(culculateNeedAngle(0));  //culculateNeedAngle这个函数帮我们计算在当前这个位置。我们需要到达各个方向所需旋转的角度
							boxInfo.move("top", -50 * getUnitLength(arr[i]))
						}
						else if (/^MOV RIG/i.test(arr[i])) {
							boxInfo.rotate(culculateNeedAngle(90));
							boxInfo.move("left", 50 * getUnitLength(arr[i]));
						}
						else if (/^MOV BOT/i.test(arr[i])) {
							boxInfo.rotate(culculateNeedAngle(180));
							boxInfo.move("top", 50 * getUnitLength(arr[i]));
						}
						else if (/^MOV LEF/i.test(arr[i])) {
							boxInfo.rotate(culculateNeedAngle(270));
							boxInfo.move("left", -50 * getUnitLength(arr[i]));
						}
						else if (/^TRA TOP/i.test(arr[i])) {
							boxInfo.move("top", -50 * getUnitLength(arr[i]));
						}
						else if (/^TRA RIG/i.test(arr[i])) {
							boxInfo.move("left", 50 * getUnitLength(arr[i]));
						}
						else if (/^TRA BOT/i.test(arr[i])) {
							boxInfo.move("top", 50 * getUnitLength(arr[i]));
						}
						else if (/^TRA LEF/i.test(arr[i])) {
							boxInfo.move("left", -50 * getUnitLength(arr[i]));
						}
						else if (/^MOVE TO\s*\d{0,2}/i.test(arr[i])) {
							var targetSite = arr[i].match(/\d/g)
							if (targetSite.length === 2) {
								boxInfo.moveTo(targetSite[0], targetSite[1])
							}
						}
						else if (/^BUILD/i.test(arr[i])) {
							getDirectionAndBuildWall(boxInfo.rows, boxInfo.cols);
						}
						else if (/^BRU/i.test(arr[i])) {
							getDirectionAndBruWall(boxInfo.rows, boxInfo.cols, arr[i].slice(3).trim());
						}
						i++;
					}	
				}
				else {
					//执行完所有指令关闭这个定时器
					clearInterval(commandTimer);
				}
			}, 10)
		}
	}
}


//Q：
//onrightclick事件。