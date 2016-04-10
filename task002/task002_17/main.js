// 定义时间初始值这里用引号括起来，不然因为当前时间的月份是从0开始计数的，会影响计算结果
var beginTime = new Date("2016, 1, 1")
var endTime = new Date()
window.onload = function() {
	// 获取操作元素
	var fieldset=document.getElementById("form-gra-time")
	var aSpan = fieldset.getElementsByTagName("span")
	var oSelect = document.getElementById("city-select");
	var aqiChartWrap = document.getElementById("aqi-chart-wrap")
	var aDiv = aqiChartWrap.getElementsByTagName("div")
	
	//定义随机颜色
	var colors = ["#146464", "#17a5a3", "#11cc7c", "#58e4e3", "#a4c1c1", "#8c9696", "#1386d4", "#0b56c1", "#94a727"]

	// 切换选项,这里本来是用display:block/none来控制div的显示和隐藏的，但是会影响到display:flex的布局，就改成了修改透明度。不控制
	for (var i = 0; i < aSpan.length; i++) {
		aSpan[i].index = i;
		aSpan[i].onclick = function() {
			for (var i = 0; i < aSpan.length; i++) {
				aSpan[i].className = ""
				//还是改成了用位置改变。这里不能仅仅只用opacity,那么当移动当其他元素，如月份柱子上，即使看不见月份柱子，title还是会出现，同样也不能单独用Z-index，否则点击span的时候，title是正确的，但是看见的只有每日柱子
				aDiv[i].style.top = "600px"
			}
			this.className = "active"
			aDiv[this.index].style.top = "0"
		}
	}

	getTime()	
	// 初始渲染页面
	function getTime() {
		var disTime = parseInt((endTime.getTime() - beginTime.getTime())/1000)

		//得到有多少天,向上取整截至到今天
		var day = Math.ceil(disTime/3600/24)
		
		// 初始的时候输入北京的数值
		render(day,500)	

		// 当城市改变的时候，改变Aqi的峰值并渲染，这样就导致了重复渲染
		oSelect.onchange = function() {	
			switch (oSelect.selectedIndex) {
				case 0:
				case 5:
				case 8:
					render(day, 500);
					break;
				case 1:
				case 4:
					render(day, 300)
					break;	
				case 2:
					render(day, 200)
					break;
				default:
					render(day, 100)
					break;	
			}
		}
	}

	// 传入了从16年头到现在的天数，和每个城市的aqi峰值。通过这个函数能得到要渲染的每周/月数据（柱子高度，柱子个数）再进行渲染
	function render(day ,aqi) {
		// 获取操作元素
		var oDay = document.getElementById("days")
		var oWeek = document.getElementById("weeks")
		var oMonth = document.getElementById("months")

		// 每次切换城市的时候，清空span内容，否则生成的柱子会叠加
		oDay.innerHTML = ""
		oWeek.innerHTML = ""
		oMonth.innerHTML = ""

		//timeTitle定义日期,好进行渲染 compare是和timeTitle进行比较，看月份是否变化
		var timeTitle = new Date("2015, 12, 31")
		var compare = new Date("2016, 1, 1")

		//AQI值累加和
		weekTotal = 0
		monthTotal = 0

		//创建数组，存储每周/月柱子高度（AQI值）
		var weekHeight =new Array()
		var monthHeight =new Array()
		

		//这个时间来进行第一周（不满7天的）和每个月柱子高度处理的日期判断条件
		var firstSunday= new Date("2016, 1, 3")
		var Jan = new Date ("2016, 1, 31")
		var Feb = new Date ("2016, 2, 29")
		var Mar = new Date ("2016, 3, 31")

		// 渲染每日空气质量
		for (var i = 0; i < day; i++) {
			var oP = document.createElement("p")
			// 获得随机的高度值，并将高度值量化为AQI值显示在title里
			var height = Math.round(Math.random() * aqi)
			oP.style.width = (oDay.offsetWidth)/day/2 + "px"
			oP.style.height = height + "px"
			oP.style.backgroundColor = colors[Math.round(Math.random() * 8)]

			// 给每个柱子加title，title的值由timeTitle的各个方法获得
			timeTitle.setDate(timeTitle.getDate() + 1)
			compare.setDate(compare.getDate() + 1)
			oP.title = timeTitle.getFullYear() + "-" + (timeTitle.getMonth()+1) + "-"  +timeTitle.getDate() + "\n" +"[AQI]:" + height
  			oDay.appendChild(oP)
  			
  			//将每日柱子的高度值累加求和方便进行每周每月的换算,遇到每周/月结束时就清空它们
  			weekTotal += height
  			monthTotal += height

  			//判断有几周，将每周平均AQI值存储为数组，这是之前没做截至日期的比较
      		/*if (timeTitle.getDay() == 0 ) {	
      			// 日期不可以直接比较，差值比下好了	
      			if (timeTitle - firstSunday == 0) {
      				height = Math.round((Total / 3)) 
      			}
      			else {
      				// 这次的累加和减去上次的累加和除以天数可以得到平均值
      				height = Math.round((Total - weekTotal[weekTotal.length - 1]) / 7)    			
      			}
      			weekHeight.push(height) 
      			weekTotal.push(Total)
      		}*/
      		var nowTime =new Date(endTime.getFullYear() + "," + (endTime.getMonth()+1) + "," + endTime.getDate() + ",")
      		//得到每周的AQI数据
      		if ( timeTitle.getDay() == 0  || (timeTitle - nowTime == 0)) {
      			// 日期不可以直接比较，差值比下好了	
      			if (timeTitle - firstSunday == 0) {	

      				height = Math.round(weekTotal / 3)
      			} else if (timeTitle - nowTime == 0) {
      				if (nowTime.getDay == 0) {
      					height = Math.round(weekTotal / 7) 
      				} else {
      					height = Math.round(weekTotal / (timeTitle.getDay()))
      				}
      			}
      			else {
      				height = Math.round(weekTotal / 7)    			
      			}
   				weekTotal = 0
   				weekHeight.push(height) 
      		}

  			//判断有几月,将每月平均AQI值存储为数组
  			if (timeTitle.getMonth() != compare.getMonth() || (timeTitle - nowTime == 0)) {
  				if (timeTitle - Jan == 0) {
  					height = Math.round(monthTotal / 31)
  				}
  				else if (timeTitle - Feb == 0) {
  					height = Math.round(monthTotal  / 29)
  				}
  				else if (timeTitle - Mar == 0) {
  					height = Math.round(monthTotal  / 31)
  				}
  				else {
  					height = Math.round(monthTotal / timeTitle.getDate())
  				}
  				monthTotal = 0
  				monthHeight.push(height)
  			}	
		}
		
		// 渲染每周空气质量
		for (var i =0; i <weekHeight.length; i++) {
			var oP = document.createElement("p")
			oP.style.width = (oDay.offsetWidth)/14/2 + "px"
			oP.style.height = weekHeight[i] + "px"
			oP.style.backgroundColor = colors[Math.round(Math.random() * 8)]
			oP.title = "第" + (i+1) + "周的平均" + "\n[AQI]：" + weekHeight[i] 
			oWeek.appendChild(oP)
		}

		//渲染每月空气质量
		for (var i = 0; i < monthHeight.length; i++) {
			var oP = document.createElement("p")
			oP.style.width = (oDay.offsetWidth)/3/2 + "px"
			oP.style.height = monthHeight[i] + "px"
			oP.style.backgroundColor = colors[Math.round(Math.random() * 8)]
			oP.title = "第" + (i+1) + "月的平均\n[AQI]：" + monthHeight[i]
			oMonth.appendChild(oP) 		
		}	
	}
}