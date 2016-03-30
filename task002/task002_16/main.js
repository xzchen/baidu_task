window.onload = function() {
	var table = document.getElementById("aqi-table")
	//获取数组数据。

	//渲染表格

	function btnHandle () {
		render();
	}
	
	function render () {
		var html = "";
		var cityName = document.getElementById("aqi-city-input").value
		var value = document.getElementById("aqi-value-input").value
		var newNode = document.createElement("tr")
		var newNodes = document.createElement("td")
		
		html += "<tr><td>" + cityName + "</td><td>" + value + "</td></tr>"
		table.innerHTML += html;
		alert(3)
          
	}

	function init() {
		document.getElementById("add-btn").addEventListener("click", btnHandle)
	}

	init();

}

