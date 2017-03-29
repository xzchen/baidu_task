var app = angular.module("app", []);
app.controller("form", function ($scope) {
	//第一个配置项进行ng-repeat的时候需要的repeat的完整数据
	$scope.inputTypes = [{value:"text", content:"文本域"}, {value:"password", content:"密码域"}, {value:"email", content:"邮箱"}, {value:"checkbox", content:"复选框"}, {value:"radio", content:"单选按钮"}]

	// , {value:"select", content:"下拉列表"}
	
	//用inputData记录我们要生成input控件的一些数据
	$scope.inputData = {
		type : "text",   //配置1：生成的input的类型
		label: "用户名", //配置2：生成的input前面关联label中前置文本
		required: true, //配置2：生成的input是否必须填选
		minlength: 4,	//配置3.1生成的input的长度限制之最小长度
		maxlength: 10,	//配置3.1同上，最大长度
		currentOption:"", //配置3.2 生成的input如果是checkbox/radio之类的。则需要输入我们可以选择的项目。这是记录当前正在输入的项目
		options: ["足球", "游戏", "漫画"]  //配置3.2同上，所有可选项目的集合
	}
	
	//监听第一个配置项，根据其所选要生成的input控件类型来决定一些配置
	$scope.$watch("inputData.type", listeningType)
	function listeningType() {
		switch ($scope.inputData.type) {
			case"text":
				$scope.inputData.label = "用户名";	//预设其关联label
				$scope.inputData.minlength = 4;		//预设其最小长度
				$scope.inputData.maxlength = 16;	//预设其最大长度
				break;
			case"password":
				$scope.inputData.label = "密码";
				$scope.inputData.minlength = 6;
				$scope.inputData.maxlength = 32;
				break;
			case"email":
				$scope.inputData.label = "邮箱";
				$scope.inputData.minlength = 4;
				$scope.inputData.maxlength = 32;
				break;
			case"checkbox":
				$scope.inputData.label = "爱好";
				$scope.inputData.options = ["足球", "游戏", "漫画"]
				break;
			case"radio":
				$scope.inputData.label = "性别";
				$scope.inputData.options = ["男", "女", "双性", "MTF", "FTM", "其它"]
				break;
			case"select":
				$scope.inputData.label = "下拉列表";
				break;
			case"button":
				$scope.inputData.label = "提交";
				break;
		}	
	}
	

	//监听第二个配置项。根据required的值直接修改字符串长度限制条件为空
	$scope.$watch("inputData.required", function () {
		if ($scope.inputData.required) {
			listeningType()
		}
		else {
			$scope.inputData.minlength = "";
			$scope.inputData.maxlength = "";
		}
	})

	//对于第三个配置项。的第二种情况。
	// 3.2.一。我们需要请支持键盘键入回车/空格将currentOption加入options
	$scope.addOption = function (event) {
		ev = window.event || event;
		var keyCode = ev.keyCode || ev.which || ev.charCode;
		var option = $scope.inputData.currentOption.trim();   //把当前的输入选项去空取出来，方便操作
		if ((keyCode === 13 || keyCode === 32) && option != "" && $scope.inputData.options.indexOf(option) < 0) {
			$scope.inputData.options.push(option);
			$scope.inputData.currentOption = "";
		}
		if ($scope.inputData.options.length > 6) {
			$scope.inputData.options.shift();
		}
	}
	// 3.2.二。我们生成的选项可以点击删除
	$scope.deleteOption = function (index) {
		$scope.inputData.options.splice(index, 1)
	}

	//3.2.三。对于生成选项的个数进行判断，如果不小于目标=2个。则不允许加入inputData去生成input
	$scope.checkOptionsLength = function () {
		if ($scope.inputData.options.length >= 2) {
			return false;
		}
		return true;
	}
	//配置完成。创建input。每成功一次就往inputs集合里添加一次inputData数据
	var count = 0;  //为了方便验证表单控件的$valid等属性，给每个input的生成1个不同name值。count用来区别。
	$scope.createInput = function () {
		//对于错误的配置，直接提示。不进行创建
		var input = $scope.inputData // 赋值给input的。方便多次操作
		var newOptions = input.options.slice(0) //复制options数组
		//给options的每项加个check属性。。嗯，为了以此来得到结果来设置伪装的input的合法性
		for (var j = 0; j < newOptions.length; j++) {
			newOptions[j] = {
				value: input.options[j],
				checked: false
			}
		}
		//成功的配置直接加入inputs数组里面。
		$scope.inputs.push({type: input.type, label: input.label, required: input.required, minlength: input.minlength, maxlength:input.maxlength, options: newOptions, name:"input"+count})
		count++;
	}

	// 表单展示区
	// inputs用来存储所有已经创建input的数据
	$scope.inputs = [];

	/**
	 * [验证多个选项的控件的合法性。checkbox/raido/select。看它们是否有1个选项勾选了，如果是的话，就把关联的那个伪装的input的required设置为false，这样就能通过验证。。。好蠢的方法]
	 * @param  {[string]} inputName  [传入的是input.name，根据我们之前设置的input.name可以提取出该项伪装的input关联的options是inputs中第几个options。（就是该项input的name的后面数字）（或者说第几个inputData数据）]
	 * @return {[boolean]}             [我们设置的伪装的input的ng-required属性就等于这个函数的返回值]
	 */
	$scope.checkOptionsValidity = function (inputName) {
		console.log(inputName)
		var inputIndex = inputName.slice(5)

		// 当本身这个input.required为false的时候。我们直接把这个input-required也设置返回值为false
		if(!$scope.inputs[inputIndex].required) {
			return false;
		}

		//当本身这个input.required为true的时候。只有当它关联的options里至少1个option被勾选了才设置为false。
		for (let i = 0; i < $scope.inputs[inputIndex].options.length; i++) {
			if ($scope.inputs[inputIndex].options[i].checked) {
				return false;
			}
		}
		return true;
	}
	
	//修改多选框得得状态。
	$scope.changeOptionsStatus = function (optionIndex, inputName) {
		var inputIndex = inputName.slice(5) 

		//本来可以用个event.target.type来判断所点击得是checkbox还是radio去设置的。但是我们是根据他们的checked值去判断合法与否。所以统一设置下吧。
		$scope.inputs[inputIndex].options[optionIndex].checked = event.target.checked;
	}

	//删除一个input项目
	/*$scope.deleteInput = function (inputName) {
		var inputIndex = inputName.slice(5)
		$scope.inputs.splice(inputIndex,1,"")
		console.log($scope.inputs)
		//待补充
	}*/
})

// Q1. 应该可以给类型为checkbox/radio下生成Option加移入（悬停）的提示消息，指示可以删除的事件，但是添加字符，更改数据后，视图也改。这个事件又执行了1次，这样会出问题。不懂解决。
// Q2. ng-model 命令为foo的记得找个合适的名称修改下。
// Q3. 添加1个方式去删除生成了的单个input。（）
// Q4. 添加校验图标
// Q5. 增加正则验证（手机。邮箱。）
// Q6.下拉框还没写。
// Q7。预定义某些定则特定性。（完成最小长度和最大长度的限制。大必须>=小。）
// 2016/10/10