window.onload = function() {
	var table = document.getElementById("aqi-table")
	// 获取添加的button元素
	var aBtn = table.getElementsByTagName("button")
	
	//在点击添加按钮的时候判断是否符合正则要求，成则渲染表格。否则显示提示
	function render() {
		//获取数据和操作元素
		var cityName = document.getElementById("aqi-city-input").value.trim()
		// 这里要用到trim()方法去掉字符串两边空格，否则影响判断结果
		var value = document.getElementById("aqi-value-input").value.trim()
		var citySpan = document.getElementById("aqi-city-span")
		var valueSpan = document.getElementById("aqi-value-span")

		//正则表达式,匹配规则,这里还是特懵，边用边看吧
		var re_cityName = /^[A-Za-z\u4e00-\u9fa5]+$/;
		var re_value = /^\d{2,3}$/;
		
		//清空提示的内容
		citySpan.innerHTML = "";
		valueSpan.innerHTML = "";

		var reCity=false;
		// 判断语句，看是否符合输入规则，这是城市名和污染值都符合要求
		if ( re_cityName.test(cityName) && re_value.test(value)) {
			// 这里为了防止城市输入重复，写了比较复杂的判断。挺麻烦的，但是别人的自己又不太理解

			// 加入第一行数据，不进行判断是否重复
			if (aBtn.length == 0) {
				var html = "";
				html = "<tr><td>" + cityName + "</td><td>" +value +"</td><td><button >删除</button></tr>"
				// 用childern[1]获取tbody元素。不加这个的话，每次文档中会自动补入一个新的tbody
				table.children[1].innerHTML += html;
			}

			// 当表格已经渲染之后，判断是否重复
			else {
				//按照已经渲染的，选取每行下的button，通过节点切换？知晓城市是否重复，是则将重新输入的空气污染质量值替换之前的
				for (var i = 0; i < aBtn.length; i++) {
					if (aBtn[i].parentNode.parentNode.firstChild.innerHTML == cityName) {
						aBtn[i].parentNode.parentNode.children[1].innerHTML = value;	
						reCity = true;
						break;
					}
				}

				//City如果此刻还等于false，说明没有重复的从城市，那直接渲染就好了。
				if (reCity == false) {
				html = "<tr><td>" + cityName + "</td><td>" +value +"</td><td><button data-cityName = "+cityName+">删除</button></tr>"
				// 用childern[1]获取tbody元素。不加这个的话，每次文档中会自动补入一个新的tbody
				table.children[1].innerHTML += html;
				}		
			}
		}

		//城市名和污染值都不符合输入要求
		else if (!re_cityName.test(cityName) && (!re_value.test(value))) {
			// 为何两次打印的结果不一样，这里在用到了全局搜索的时候，记得注意lastIndex的问题。
			citySpan.innerHTML = "请输入中文或者英文字符，不可包含数字"
			valueSpan.innerHTML = "请输入2-3位的整数"
		} 

		else if (!re_cityName.test(cityName) && (re_value).test(value)) {	
			citySpan.innerHTML = "请输入中文或者英文字符"
		}

		else  {
			valueSpan.innerHTML = "请输入2-3位的整数"
		}

		// 给删除的button统一添加点击事件，删除加入的数据
		for (var i =0; i < aBtn.length; i++) {
			aBtn[i].onclick = function() {
				this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode)
			}
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