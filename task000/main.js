$(document).ready(function(){
	$("#fullPage").fullpage({
		controlArrows:false,
		scrollingSpeed:1400,
		recordHistory:false,
		
		//header部分置顶
		paddingTop:"100px",
		fixedElements:"header",  
		anchors:["page1","page2","page3"],
		menu:"#fullpageMenu",

		// 项目导航
		navigation:true,
		navigationPosition:"right",
		slidesNavigation:true,		
		slidesNaviPosition:"bottom",
		loppHorizontal:true,

		//补充header导航的active状态
		afterLoad:function(link,index){
			switch(index){
				case 1: $("#fullpageMenu > li:eq(0)").css("background","red");
				break;
				case 2: $("#fullpageMenu > li:eq(1)").css("background","green")
				break;
				case 3:$("#fullpageMenu > li:eq(2)").css("background","orange")
				break;
			}
		},

		//header导航的正常状态
		onLeave:function(index,nextindex){
			switch(index){
				case 1: $("#fullpageMenu > li:eq(0)").css("background","#999");
				break;
				case 2: $("#fullpageMenu > li:eq(1)").css("background","#999")
				break;
				case 3:$("#fullpageMenu > li:eq(2)").css("background","#999")
				break;
			}
		}
		

	})
})
