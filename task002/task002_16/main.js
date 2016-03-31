window.onload = function() {
	var table = document.getElementById("aqi-table")
	// 获取添加的button元素
	var aBtn = table.getElementsByTagName("button")
	

	//在点击添加按钮的时候判断是否符合正则要求，成则渲染表格。否则显示提示
	function render() {
		//获取操作元素
		var cityName = document.getElementById("aqi-city-input").value
		var value = document.getElementById("aqi-value-input").value
		var citySpan = document.getElementById("aqi-city-span")
		var valueSpan = document.getElementById("aqi-value-span")

		//正则表达式,匹配规则
		var re_cityName = /[\u4e00-\u9fa5]/g;
		var re_value = /\d/g;
		
		
		// 判断语句
		if ( re_cityName.test(cityName) && re_value.test(value)) {
			var html = "";
			html = "<tr><td>" + cityName + "</td><td>" +value +"</td><td><button>删除</button></tr>"
			table.innerHTML += html;
		}
		
		else if (!re_cityName.test(cityName)) {
			// 为何两次打印的结果不一样
			console.log(!re_cityName.test(cityName))
			console.log(!re_cityName.test(cityName))
			citySpan.innerHTML = "请输入中文"
		}

		else  {
			valueSpan.innerHTML = "请输入数字"
		}

	}

	

	// 给按钮添加事件，并向其中渲染出来的button添加了click事件
	function btnHandle() {
		render();
		for (var i = 0; i < aBtn.length; i++) {
			aBtn[i].onclick = function () {
				this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode)
			}
		}
	}

	function init() {
		document.getElementById("add-btn").addEventListener("click", btnHandle)
	}

	init();
}

