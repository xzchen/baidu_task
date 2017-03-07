//生成table
!function () {
	var tablePanel = document.getElementById('table-panel');
	var arrOl = tablePanel.getElementsByTagName('ol');
	for (var i = 0; i < arrOl.length; i++) {
		for (var j = 0; j < 10; j++) {
			arrOl[i].innerHTML += "<li>" + (j+1) + "</li>";
		}
	}
	var tbody = document.createElement("tbody");
	var tbodyInnerHTML = "";
	var tbodyArr = [];
	for (var i = 0; i < 10; i++) {
		tbodyInnerHTML += "<td></td>";
	}
	for (var i = 0; i < 10; i++) {
		tbodyArr.push(tbodyInnerHTML);
	}
	tbodyInnerHTML = "";
	tbodyInnerHTML += "<tr>" + tbodyArr.join("</tr><tr>") + "</tr>";
	tbody.innerHTML = tbodyInnerHTML;
	var body = document.getElementsByTagName('table')[0];
	body.appendChild(tbody)
}()

//生成我们要操作的小方块并进行定位
!function () {
	var box = document.createElement("div");
	box.innerHTML = "<div class='box-head'></div>";
	box.id = "box";
	//因为序号也占据了空间。所以坐标+1。
	box.style.top = Math.floor(Math.random()*10+1)*50 + "px";
	box.style.left = Math.floor(Math.random()*10+1)*50 + "px";
	document.getElementsByTagName('table')[0].appendChild(box);
}()

//获取所有td格子。让我们方便操作。给并给所有td格子加点击事件。
function getArrTd() {
	var boxLength = document.getElementById('box').offsetWidth;
	var arrTd = [];

	for (var i = 1; i <= 10; i++) {
		arrTd[i] = [];
		arrTd[i].push("");
	}
	var allTd = document.getElementsByTagName('table')[0].getElementsByTagName('td');
	for (var i = 1; i <= 10; i++) {
		for (var j = 1; j <= 10; j++) {
			//保证td序号符合我们常规认知。（1-10而非0-9);
			arrTd[i].push(allTd[i*10+j-11])
			arrTd[i][j].x = i;
			arrTd[i][j].y = j;
			//左击就把盒子瞬移到某个不为墙的格子
			arrTd[i][j].onclick = function (ev) {
				if (arrTd[this.x][this.y].className != "wall") {
					box.x = this.x;
					box.y = this.y;
					box.style.left = box.x * boxLength + "px";
					box.style.top = this.y * boxLength + "px";
				}
			}
			//右击就去掉墙
			arrTd[i][j].oncontextmenu = function (ev) {
				this.className = "";
				this.style.background = "#fff";
				this.style.borderColor = "#ccc";			
				return false;
			}
		}
	}
	return arrTd;
}
var arrTd = getArrTd();  //获取所有可以操作的td格子
var table = document.getElementsByTagName('table')[0];

//处理用户输入指令的前后空格。为了兼容，写个trim函数。原生的trimIE9+才有。
function trim(str) {
	str = String(str);
	return str.replace(/(^\s*)|(\s*$)/g,"");
}

/**
 * 根据用户textarea文本域内输入的指令去渲染出指令序号来。并且判断是否有不符合要求的指令。如果有，就不能够去执行文本域内的所有指令。
 * @param  {[object]}  cmdText  		[用户输入指令的文本域]
 * @param  {[object]}  cmdIndex 		[操作ol的innerHTML来渲染出指令序号]
 * @return {[object]}  cmd  [包含2个属性。validity:boolean类型 是否有不合法的指令，有则值为false。list，将所有的指令都去掉了前后空格返回，方便之后的正则判断]
 */
function renderIndexAndCheckValidity(cmdText, cmdIndex) {
	var cmdValidity = true; 
	var cmdList = cmdText.value.split(/\n|\r/); 
	var cmdIndexText = "";
	
	var cmdReg = /^Go\s*\d?$|^TUN LEF\s*\d?$|^TUN RIG\s*\d?$|^TUN BAC\s*\d?$|^MOV TOP\s*\d?$|^MOV RIG\s*\d?$|^MOV BOT\s*\d?$|^MOV LEF\s*\d?$|^TRA TOP\s*\d?$|^TRA RIG\s*\d?$|^TRA BOT\s*\d?$|^TRA LEF\s*\d?$|^BUILD$|^BRU\s+|^MOVE TO\s*(\[|\(|（)?\s?([1-9]|10)\s?(,|，|\s)\s?([1-9]|10)\s?(\]|\))?$/i;
	for (var i in cmdList) {
		cmdList[i] = trim(cmdList[i])
		if (cmdReg.test(cmdList[i])) {
			cmdIndexText += "<li>" + (+i+1) + "</li>"  
		}
		else {
			cmdIndexText += '<li class="wrong">' + (+i+1) + "</li>"; //不合法的指令标志出来
			cmdValidity = false;
		}
	}
	cmdIndex.innerHTML = cmdIndexText;
	return cmd = {
		validity:cmdValidity,
		list:cmdList
	};
}

//建墙指令
function buildWall() {
	switch(box.direction) {
		case 1: 
			if (box.y > 1) {
				arrTd[box.x][box.y-1].className = "wall";
			}
			break;
		case 2:
			if (box.x < 10) {
				arrTd[box.x+1][box.y].className = "wall";
			}
			break;
		case 3:
			if (box.y < 10) {
				arrTd[box.x][box.y+1].className = "wall";
			}
			break;
		case 4:
			if (box.x > 1) {
				arrTd[box.x-1][box.y].className = "wall";
			}
			break;
	}
	
}

/**
 * 判断我们需要粉刷（bru指令）为墙的td格子的时候判断box小方块的下个格子是否是墙。是的话返回要粉刷的td格子的坐标值
 * @param  {[number]}  direction [当前小方块的方向。根据它来决定下1个格子。若是上。则y坐标-1。类推]
 * @param  {[number]}  x         [当前小方块的x坐标]
 * @param  {[number]}  y         [当前小方块的x坐标]
 * @return {Object}           [返回的x属性:要粉刷的格子的x坐标。y同理。如果不是墙。return false]
 */
function isWall(direction, x, y) {
	if (direction === 1 && y>1 && arrTd[x][y-1].className === "wall") {
		return bruTdIndex = {
			x:x,
			y:y-1
		};
	}
	else if (direction === 2 && x<10 && arrTd[x+1][y].className === "wall") {
		return bruTdIndex = {
			x:x+1,
			y:y
		};
	}
	else if (direction === 3  && y<10 && arrTd[x][y+1].className === "wall") {
		return bruTdIndex = {
			x:x,
			y:y+1
		};
	}
	else if (direction === 4 && x>1 && arrTd[x-1][y].className === "wall") {
		return bruTdIndex = {
			x:x-1,
			y:y
		};
	}
	return false;
}

//将开启列表中的格子的F值从小至大排序。
function sortF(a, b) {
	return a.F - b.F;
}

//得到当前格子周围的格子（上右下左）
function SurroundPoint(currentPoint) {
	var x = currentPoint.x;
	var y = currentPoint.y;
	return [
		{x:x, y:y-1},
		{x:x+1, y:y},
		{x:x, y:y+1},
		{x:x-1, y:y}
	]
}

// 判断某点（某格子）是否在某个（开启/闭合）列表里面
function existList(x, y, openList) {
	for (i in openList) {
		if(x === openList[i].x && y === openList[i].y) {
			return i;
		}
	}
	return false;
}

// 根据当前位置和目标位置。得到行进路线
function getPathResult(startX, startY, endX, endY) {
	var openList = [];
	var closeList = [];
	var pathResult = [];
	var resultIndex;
	openList.push({x:startX, y:startY, G:0});
	//当目标位置不存在于开启列表（代表还没找到路径）时。
	while (!(resultIndex=existList(endX, endY, openList))) {
		//把开启列表中F值最小的提取出来作为当前要遍历的周围节点的父节点
		var currentPoint = openList.shift();
		closeList.push(currentPoint)//当前点加入闭合列表
		var surroundPoint = SurroundPoint(currentPoint); //得到当前点周围的点
		for (var i in surroundPoint) {
			var item = surroundPoint[i];
			if(item.x>=1 && item.y >=1 && item.x <= 10 && item.y <= 10) {
				//不存在于闭合列表。并且不是墙
				if (!existList(item.x, item.y, closeList) && arrTd[item.x][item.y].className != "wall") {
					var g = currentPoint.G + 10;
					//如果不存在在开启列表中
					if (!existList(item.x, item.y, openList)) {
						item.H = Math.abs(endX - item.x) * 10 + Math.abs(endY - item.y) * 10;
						item.G = g;
						item.F =item.H + item.G;
						item.parent = currentPoint;
						openList.unshift(item) //我们是从开启列表的的队首提取当前点的。也往队首加入满足要求的点。
					}
				}
			}
		}
		if (openList.length === 0) {
			//开启列表空了。没有通路。结果为空。退出循环。
			break;
		}
		openList.sort(sortF);
	}

	//如果目标位置在openList找不到。序号为false
	if (!resultIndex) {
		pathResult = [];
	}
	else {
		//取到openList中的点。
		var currentObj = openList[resultIndex];
		// 一层一层往上推到父节点，加入result中
		while (currentObj.x!==startX || currentObj.y!==startY) {
			pathResult.unshift({
				x:currentObj.x,
				y:currentObj.y
			});
			currentObj = currentObj.parent;
		}
		currentObj = currentObj.parent;
	}
	return pathResult;
}

//限制运动时间的文本框只让输入数字
document.getElementById('time').onkeyup = function () {
	this.value = this.value.replace(/\D|[\b]/g,"")
}
document.getElementById('time').onblur = function () {
	this.value = this.value.replace(/\D|[\b]/g,"")
}


window.onload = function () {
	var box = document.getElementById('box');
	var boxLength = box.offsetWidth;
	//给这个盒子的一些属性赋值。
	box.x = box.offsetLeft / boxLength;
	box.y = box.offsetTop / boxLength;
	box.direction = 1;  //指示当前方向1-4为上-左
	box.angle = 0;  //这里改明看用box.style.transfrom来写看能不能更好。
	
	var moveTimer,  //运动的定时器
		rotateTimer,
		moveToTimer,
		moveFlag = false,   //运动是否正在进行，是则true
		rotateFlag = false,
		moveToFlag = false,
		commandTimer //定时执行文本域中的所有指令
	var timeDom = document.getElementById('time');
	var time = timeDom.value; //定时器的间隔时间

	/**
	 * 控制小方块运动的函数
	 * @param  {[number]} direction [确定当前小方块头部所在方向1-4分别为上-左]
	 * @param  {[number]} long      [确定当前小方块此次运动需要移动的坐标值（移动几个格子）指令传入的值∈[0,9]。如果没有传入， 则默认为1]
	 * @param  {[number]} time      [每次运动的快慢。]
	 */
	function move(direction, long, time) {
		//没有传入合适的long（坐标偏移值）就不执行这个move函数了。
		if (long == 0) {
			return;
		}
		clearInterval(moveTimer);
		moveFlag = true; //运动开启时设置moveFlag为true
		if (long == null) {
			long = 1;
		}
		var startCoord,   //开始的坐标的值（取值1-10）
		 	coord,		  //我们要改变的坐标是x还是y坐标
		 	property,	  //改变根据方向确定改变的是方块的top还是left值
		 	propertyValue;//赋值为offsetTop/Left 方便我们写1个语句根据方向得到值
		if (direction === 1 || direction === 3) {
			startCoord = box.y;
			coord = "y";
			coordOpposite = "x";
			property = "top";
			propertyValue = "offsetTop";
		}
		else {
			startCoord = box.x;
			coord = "x";
			coordOpposite = "y";
			property = "left";
			propertyValue = "offsetLeft";
		}
	
		//如果执行move运动的时候小方块box并不处于每个td的边界上，就把我们要开始的位置默认设置到边界上（不改变其实际位置），可以使得停止的位置是td的边界。
		if (box.x % 1 != 0 || box.y % 1 != 0) {
			startCoord = Math.ceil(startCoord);
			startCoord = direction == 1 || direction == 2?Math.ceil(startCoord):Math.floor(startCoord);
			//如果此时是左右移动（此时coord为x），就把盒子的纵坐标移到最近的整数上，反之。
			if (coord == "x") {
				box.y = Math.round(box.y);
				box.style.top = box.y * boxLength + "px";
			}
			else {
				box.x = Math.round(box.x);
				box.style.left = box.x * boxLength + "px";
			}
		}

		var endCoord = direction == 1 || direction == 4?startCoord - long:+long + startCoord; //获得结束的坐标的值
		var step = (endCoord - startCoord) * boxLength / 10;  //单次移动的步长（px）
		
		moveTimer = setInterval(function () {
			//满足单次移动所造成的坐标的改变小于目标坐标和当前坐标的差值 或者 将要超越table边界 或者遇到障碍（墙）的时候结束move运动
			if (Math.abs(box[coord] - endCoord) < Math.abs(step/boxLength) || (box[coord] < 1 - step/boxLength) || (box[coord] > 10 - step/boxLength)) {
				clearInterval(moveTimer)
				box[coord] = Math.round(box[coord]);
				box.style[property] = box[coord] * boxLength + "px";
				moveFlag = false; //运动定时器如果关闭就把moveFlag设置为false。
			}
			else {

				// 判断下一次运动碰倒障碍（墙）也关闭运动定时器
				if(coord === "x") {  
					if (step > 0) {
						nextTdIsWall = arrTd[Math.ceil(box.x + step/boxLength)][box.y].className == "wall";
					}
					else {
						nextTdIsWall = arrTd[Math.floor(box.x + step/boxLength)][box.y].className == "wall";
					}
				}
				else {
					if (step > 0) {
						nextTdIsWall = arrTd[box.x][Math.ceil(box.y + step/boxLength)].className == "wall";
					}
					else {
						nextTdIsWall = arrTd[box.x][Math.floor(box.y + step/boxLength)].className == "wall";
					}
				}
				
				if (nextTdIsWall) {   
					clearInterval(moveTimer)
					box[coord] = step < 0?Math.floor(box[coord]):Math.ceil(box[coord]);
					box.style[property] = box[coord] * boxLength + "px";
					moveFlag = false;
					return;
				}	

				//不会碰倒障碍物的话就直接改变box的坐标和实际位置
				box.style[property] = box[propertyValue] + step + "px";
				box[coord] = box[propertyValue] / boxLength;
			}
		},time)
	}

	/**
	 * 控制小方块选择的函数
	 * @param  {[number]} angle [确定当前小方块需要旋转的角度。（90的倍数）]
	 * @param  {[number]} time  [决定旋转的快慢]
	 * @return {[type]}       [description]
	 */
	function rotate(angle, time) {
		clearInterval(rotateTimer)
		rotateFlag = true;
		//同move函数一样，我们需要确定每次进行旋转操作时。小方块的起始角度。（小方块的上-左方向对应的角度分别为 0deg 90deg 180deg -90deg。方向向上和向左的角度比较特殊）
		//如果确定小方块时顺时针旋转（angle>0）的话，起始角度设置为当前角度/90的数值向下取整后 * 90，反之则向上取整。
		var startRotate = angle >= 0?Math.floor(box.angle / 90) * 90:Math.ceil(box.angle / 90) * 90; 
		//同样确定小方块时顺时针旋转（angle>0）的话，要旋转的角度因为改变了startRotate，所以要向计算出的值/90向上取整后 * 90，反之亦然。
		angle = angle >= 0? Math.ceil(angle / 90) * 90: Math.floor(angle / 90) * 90;
		var endRotate = startRotate + angle;
		var step = (endRotate - startRotate) / 10;
		
		rotateTimer = setInterval(function (){
			if (Math.abs(endRotate - box.angle) <= Math.abs(step)) {
				rotateFlag = false;
				clearInterval(rotateTimer)
				box.angle = endRotate % 360;
				if (box.angle < 0) {
					box.angle = 360 + box.angle;
				}
				box.direction = box.angle / 90 + 1;
				box.style.transform = "rotate(" + box.angle + "deg)";
			}
			else {
				box.angle = box.angle + step;
				box.style.transform = "rotate(" + box.angle + "deg)";
			}
		}, time)
	}

	function moveTo(startX, startY, endX, endY) {
		//运行getPathResult得到从当前格子到目标格子的行进路线
		var pathResult = getPathResult(startX, startY, endX, endY)
		var length = pathResult.length;
		if (!length) {
			console.log("没有通路可去")
			return;
		}
		moveToFlag = true;
		var index = 0;
		//因为每行进一次可能包括move和rotate函数。所以我要保证move和rotate都执行完了才执行从i到i+1个格子的方法
		moveToTimer = setInterval(function () {
			if (!moveFlag && !rotateFlag) {
				if (index === length) {
					clearInterval(moveToTimer)
					moveToFlag = false;
				}
				else {   //分别执行至上-至左的操作
					if (pathResult[index].y - box.y === -1) {  //至上
						if (box.angle === 270) {
							rotate(360 - box.angle, time);
						}
						else {
							rotate(0 - box.angle, time)
						}
						move(1, 1, time)
					}
					else if (pathResult[index].x - box.x === 1) {
						rotate(90 - box.angle, time)
						move(2, 1, time)
					}
					else if (pathResult[index].y - box.y === 1) {
						rotate(180 - box.angle, time)
						move(3, 1, time);
					}
					else {
						if (box.angle === 0) {
							rotate(270 - 360, time)
						}
						else {
							rotate(270 - box.angle, time);
						}
						move(4, 1, time)
					}
				}
				index++;
			}
		},30)
	}
	
	var arrCmd = document.querySelector(".command-button").getElementsByTagName('button');
	// 给执行某个指令的按钮添加事件
	for (var i = 0; i < arrCmd.length; i++) {
		arrCmd[i].index = i+1;
		arrCmd[i].onclick = function () {
			time = timeDom.value;
			switch (this.index) {	
				case 1:
					move(box.direction, 1, time);
					break;
				case 2:
				 	rotate(-90, time);
					break;
				case 3:
				 	rotate(90, time);
					break;
				case 4:
				 	rotate(180, time);
					break;
				case 5:
					if (box.angle === 270) {
						rotate(360 - box.angle, time);
					}
					else {
						rotate(0 - box.angle, time)
					}
					move(1, 1, time);
					break;
				case 6:
					rotate(90-box.angle, time);
					move(2, 1, time);
					break;
				case 7:
					rotate(180-box.angle, time);
					move(3, 1, time);
					break;
				case 8:
					if (box.angle === 0) {
						rotate(270 - 360, time)
					}
					else {
						rotate(270 - box.angle, time);
					}
					move(4, 1, time);
					break;
				case 9:
					move(1, 1, time);
				case 10:
					move(2, 1, time);
					break;
				case 11:
					move(3, 1, time);
					break;
				case 12:
					move(4, 1, time);
					break;
			}
		}
	}

	var cmdPanel = document.getElementById('command-panel');     //指令面板
	var cmdText = cmdPanel.getElementsByTagName('textarea')[0];  //用户输入指令的文本域
	var cmdIndex = cmdPanel.getElementsByTagName('ol')[0];		 //渲染指令的序号 

	//command-panel下几个按钮的事件
	var runCmd = document.getElementById('run-cmd');
	var reset = document.getElementById('reset');
	var resetStr="go 4\ntun lef 3\n mov top 3\n tra rig 2\nmove to (9,9)\ntun bac\n mov lef 4\n go 5\n tra bot\n go 2\n move to 3,3\n mov lef 3"
	var refresh = document.getElementById('refresh');
	var createWall = document.getElementById('create-wall');

	
	createWall.onclick = function () {
		if(!moveToFlag) {
			arrTd[Math.floor(Math.random()*10)+1][Math.floor(Math.random()*10)+1].className = "wall";
		}
	}
	reset.onclick = function () {
		cmdText.value = resetStr;
		renderIndexAndCheckValidity(cmdText, cmdIndex)
		clearInterval(commandTimer)
	}
	reset.onclick()
	refresh.onclick = function () {
		cmdText.value = "";
		cmdIndex.innerHTML = "<li>1</li>";
		clearInterval(commandTimer)
	}
	runCmd.onclick = function () {
		time = timeDom.value;
		clearInterval(moveToTimer)
		moveToFlag = false;
		clearInterval(commandTimer)
		var cmd = renderIndexAndCheckValidity(cmdText, cmdIndex);
		//如果指令列表里存在不合法的指令。就不开始执行所有指令
		if (!cmd.validity) {
			return;
		}
		cmdText.scrollTop = 0;
		var cmdList = cmd.list;
		var command;//每次需要执行的指令
		var cmdIndexLi = cmdIndex.getElementsByTagName('li');
		var index = 0;//当前执行指令的index
		var count = cmdList.length //总计有多少个指令
		var liHeight = cmdIndexLi[0].offsetHeight;//每个指令占据的高度。据此
		var screenLiLength = Math.floor(cmdIndex.offsetHeight / liHeight); //一个cmdIndex能包含多少个指令。
		commandTimer = setInterval(function () {
			//未执行完所有执行。
			if (index < count) {
				//当一个执行的move和rotate和moveTo都完成时。开始执行下1个指令
				if (!moveFlag && !rotateFlag && !moveToFlag) {
					cmdIndexLi[index].className = "active";//标记当前正在执行的指令序号
					if (index) {
						cmdIndexLi[index - 1].className = ""; //去掉之前的标记
					}
					if (/^Go/i.test(cmdList[index])) {
						move(box.direction, cmdList[index].match(/\d/g), time)
					}
					else if (/^Tun lef/i.test(cmdList[index])) {
						var per = cmdList[index].match(/\d/g) === null?1:cmdList[index].match(/\d/g);
						rotate(per * -90, time)
					}
					else if (/^Tun rig/i.test(cmdList[index])) {
						var per = cmdList[index].match(/\d/g) === null?1:cmdList[index].match(/\d/g);
						rotate(per * 90, time)
					}
					else if (/^Tun bac/i.test(cmdList[index])) {
						var per = cmdList[index].match(/\d/g) === null?1:cmdList[index].match(/\d/g);
						rotate(per * 180, time)
					}
					else if (/^Mov top/i.test(cmdList[index])) {
						if (box.angle === 270) {
							rotate(360 - box.angle, time);
						}
						else {
							rotate(0 - box.angle, time)
						}
						move(1, cmdList[index].match(/\d/g), time);
					}
					else if (/^Mov rig/i.test(cmdList[index])) {
						rotate(90 - box.angle, time);
						move(2, cmdList[index].match(/\d/g), time);
					}
					else if (/^Mov bot/i.test(cmdList[index])) {
						rotate(180 - box.angle, time);
						move(3, cmdList[index].match(/\d/g), time);
					}
					else if (/^Mov lef/i.test(cmdList[index])) {
						if (box.angle === 0) {
							rotate(270 - 360, time)
						}
						else {
							rotate(270 - box.angle, time)
						}
						move(4, cmdList[index].match(/\d/g), time);
					}
					else if (/^Tra top/i.test(cmdList[index])) {
						move(1, cmdList[index].match(/\d/g), time);
					}
					else if (/^Tra rig/i.test(cmdList[index])) {
						move(2, cmdList[index].match(/\d/g), time);
					}
					else if (/^Tra bot/i.test(cmdList[index])) {
						move(3, cmdList[index].match(/\d/g), time);
					}
					else if (/^Tra lef/i.test(cmdList[index])) {
						move(4, cmdList[index].match(/\d/g), time);
					}
					else if (/^Build$/i.test(cmdList[index])) {
						buildWall()
					}
					else if (/^Bru/i.test(cmdList[index])) {
						if (isWall(box.direction, box.x, box.y)) {
							arrTd[bruTdIndex.x][bruTdIndex.y].style.background = trim(cmdList[index].slice(3))
							arrTd[bruTdIndex.x][bruTdIndex.y].style.borderColor = trim(cmdList[index].slice(3))
						}
					}
					else {
						var targetPos = cmdList[index].match(/\d+/g)
						moveTo(box.x, box.y, +targetPos[0], +targetPos[1])
					}
					index++;
					if (index % screenLiLength == 0) {
						cmdText.scrollTop = liHeight * index;  //主屏滚动index
					}
				}
			}
			else {
				//等待所有指令完成了关闭这个定时器。并且把最后1项的active状态去掉
				if (!moveFlag && !rotateFlag && !moveToFlag) {
					clearInterval(commandTimer)
					cmdIndexLi[count - 1].className = "";
				}
			}
		},30)
	}

	cmdText.oninput = function (){
		renderIndexAndCheckValidity(cmdText, cmdIndex);  //即时输入指令即时渲染序号并检查指令合法性
	}
	//阻止输入指令的文本域的事件冒泡
	cmdText.onkeydown = function (ev) {
		ev = ev || window.event;
		window.event ? window.event.cancelBubble = true: ev.stopPropagation();
	}
	cmdText.onscroll = function () {
		cmdIndex.scrollTop = cmdText.scrollTop;	//指令序号和输入指令的文本域同步显示
	}

	window.onkeydown = function (ev) {
		ev = ev || window.event;
		keyCode = ev.keyCode || ev.which || ev.charCode;
		if (moveFlag || rotateFlag || moveToFlag) {
			ev.preventDefault()
			return;
		}
		if (keyCode === 37) {
			arrCmd[7].onclick();
			ev.preventDefault()
		}
		else if (keyCode === 38) {
			arrCmd[4].onclick();
			ev.preventDefault()
		}
		else if (keyCode === 39) {
			arrCmd[5].onclick();
			ev.preventDefault()
		}
		else if (keyCode === 40) {
			arrCmd[6].onclick();
			ev.preventDefault()
		}
		else if (keyCode === 32 || keyCode === 13) {
			buildWall();
			ev.preventDefault()
		}
	}
}

console.log("多个指令提取每次需要变化单位量（移动坐标/旋转角度）。可以提取为1个函数写下来")
