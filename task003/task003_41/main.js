//初始化页面
!function () {
	//生成table格子
	var tbody = document.getElementById('tbody');
	for (let i = 0; i < 6; i++) {
		var tr = document.createElement("tr");
		for (let j = 0; j < 7; j++) {
			var td = document.createElement("td");
			tr.appendChild(td);
		}
		tbody.appendChild(tr);
	}

	//生成“年”select
	var year = document.getElementById('year');
	var yearCount = 2050 - 1970;
	for (var i = 0; i <= yearCount; i++) {
		year.innerHTML += "<option>" + (i+1970) + "年</option>"
	}
	
	//生成“月”select
	var month = document.getElementById('month');
	for (var i = 0; i < 12; i++) {
	month.innerHTML += "<option>" + (i+1) + "月</option>"
	}
}()

window.onload = function () {
	var aTd =document.getElementsByTagName('td');
	var tbody = document.getElementById('tbody');
	var now = new Date()  //获得当前正确Date
	var nowDate = now.getDate()  //获得当前Date的日期
	var clickDate = nowDate;

	//初始化接口（dateText用来显示日期各个属性值）
	var dateText = document.getElementById('dateText');
	var week = ["日", "一", "二", "三", "四", "五", "六", "日"]
	dateText.innerHTML = now.getFullYear() + "年" + (now.getMonth() + 1) + "月" + now.getDate() + "日" + " 星期" + week[now.getDay()];
	var calendar = document.getElementById('calendar');
	dateText.onclick = function () {
		if (calendar.style.display == "block") {
			calendar.style.display = "none";
		}
		else {
			calendar.style.display = "block";
		}
	}
	//年和月的select元素
	var yearSelect = document.getElementById('year');
	var monthSelect = document.getElementById('month');
	//初始化默认选择年月和日历表
	function initialNowDate() {
		yearSelect.options[now.getFullYear() - 1970].selected = true;
		monthSelect.options[now.getMonth()].selected = true;
		render(now.getFullYear(), now.getMonth() + 1, nowDate)
	}
	initialNowDate();

	document.getElementById('button').onclick = initialNowDate;  //返回今天
	
	//select改变和触发生成日历的函数
	yearSelect.onchange = function () {
		var year = yearSelect.selectedIndex + 1970;
		render(year);
	}
	monthSelect.onchange = function () {
		var month = monthSelect.selectedIndex + 1;
		render("",month)
	}

	//这里因为要用到当前各自所属的索引，所以不用能事件委托。
	for (let i = 0, len = aTd.length; i < len; i++) {
		aTd[i].onclick = function () {
			if (this.dataset.month == (monthSelect.selectedIndex + 1)) {
				for (let j = 0, len = aTd.length; j < len; j++) {
					//点击的时候，如果有搜索到元素的className含有active，则将active类去掉
					if (aTd[j].className.search("active") >= 0) {
						aTd[j].className = aTd[j].className.replace(/active/,"")
						break;
					}
				}
				this.className += " active";
				clickDate = this.innerHTML;
				dateText.innerHTML = yearSelect.value + monthSelect.value +this.innerHTML +"日 星期" + week[i % 7 + 1]   //直接改变当前dateText，执行了渲染日历表的函数的话就在函数最后显示
			}
			else {
				//点击跳转到的月份为下一年一月或者上一年12月的情况处理
				if (this.dataset.month == 13) {
					monthSelect.options[0].selected = true;
					yearSelect.options[yearSelect.selectedIndex + 1].selected = true;
					render(yearSelect.selectedIndex + 1970,monthSelect.selectedIndex + 1)
				}
				else if (this.dataset.month == 0) {
					monthSelect.options[11].selected = true;
					yearSelect.options[yearSelect.selectedIndex - 1].selected = true;
					render(yearSelect.selectedIndex + 1970,monthSelect.selectedIndex + 1)
				}
				else {
					monthSelect.options[this.dataset.month - 1].selected = true;
					clickDate = this.innerHTML  //此时得到当前点击的日期。当一下渲染日历表的时候会用到这个日期
					render("",+this.className)
				}
			}
			calendar.style.display = "none";
		}
	}

	/**
	 * [渲染日历表格]
	 * @param  {[number]} year  [由yearSelecte获得]
	 * @param  {[type]} month [由monthSelecte获得]
	 * 当传入第三个参数现实时间的getDate时，则clickDate取值有分歧
	 */
	function render(year,month) {
		for (var i = 0; i < aTd.length; i++) {
			aTd[i].innerHTML = "";
			aTd[i].className = "";
		}
		//获得传进来（当前）的年月和点击（之前）的日期
		year = year || yearSelect.selectedIndex + 1970;
		month = month || monthSelect.selectedIndex + 1;
		//传参数个数分歧,为3个时候代表为回到（初始化）当天
		if (arguments.length == 3) {
			clickDate = nowDate;
		}
		
		var monthBegin = new Date(year+"-"+month+"-1")  //定义初始当前月份的开头日期
		var monthBeginDay = monthBegin.getDay();	//获得当前月份开头那天是星期几
		monthBegin.setDate(monthBegin.getDate(monthBegin.setMonth(monthBegin.getMonth() + 1)) - 1)   //得到这个月份的结束日期。
		var monthEnd = new Date(monthBegin.getFullYear() + "-" + (monthBegin.getMonth() + 1) + "-" + monthBegin.getDate())
		monthBegin = new Date(monthBegin.getFullYear() + "-" + (monthBegin.getMonth() + 1) + "-" + "1");
		var monthEndDate = monthEnd.getDate()   //得到这个月份有多少天

		if (monthBeginDay == 0) {
			monthBeginDay = 7;   //当月初为星期天的一个特殊情况的处理
		}

		//当点击（跳转）的日期大约当月最大日期，则将点击的日期设置为1
		if (clickDate > monthEndDate) {
			clickDate = 1;
		}
		var weekDay = null;
		for (let i = monthBeginDay - 1; i < (monthBeginDay -1 + monthEndDate); i++) {
			aTd[i].innerHTML = i - monthBeginDay + 2;
			if (aTd[i].innerHTML == clickDate) {
				weekDay = i;
				aTd[i].className = "active";
			}
			if (i % 7 == 0 || ((i + 1) % 7 ==0 ) ){
				aTd[i].className += " holiday"  //假期标红
			}
			aTd[i].dataset.month = monthSelect.selectedIndex + 1;
		}
		for (let i = monthBeginDay - 2; i >= 0; i--) {
			aTd[i].innerHTML = monthBegin.getDate(monthBegin.setDate(monthBegin.getDate() - 1));
			aTd[i].dataset.month = monthSelect.selectedIndex;
			aTd[i].className = "unNowMonth";
		}
		for (let i = monthBeginDay -1 + monthEndDate; i < aTd.length; i++) {
			aTd[i].innerHTML = monthEnd.getDate(monthEnd.setDate(monthEnd.getDate() + 1));
			aTd[i].dataset.month = monthSelect.selectedIndex + 2;
			aTd[i].className = "unNowMonth";
		}
		dateText.innerHTML = yearSelect.value + monthSelect.value +clickDate +"日 星期" + week[weekDay % 7 + 1]
	}
}
