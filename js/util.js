function test(){
	alert("我是全局都可以调用的测试js的小方法^_^");
}
/** 自定义小方法 */
var smallMethods = function(){
	/** 获取ID属性 */
	this.MyG = function MyG(id){
		return document.getElementById(id);
	};
	
};

/** 检查浏览器信息 */
var checkBrowser = function(){
	/** 判断是否是IE  */
	this.isIE = function(){
		return navigator.userAgent.toUpperCase().indexOf("MSIE")>0?true:false;
	};
	/** 判断是否是火狐  */
	this.isFirefox = function(){
		return navigator.userAgent.toUpperCase().indexOf("FIREFOX")>0?true:false;
	};
};

/** 修改样式  */
var changeClass = function(){
	var checkBw = new checkBrowser();
	/** 根据ID修改对应标签的CLASS样式  */
	this.chg = function chg(id,cls){
		if(checkBw.isFirefox()){
			document.getElementById(id)
				.setAttribute("class", cls);
		}
		if(checkBw.isIE){
			document.getElementById(id)
				.setAttribute("className", cls);
		}
	};
};
/** 预处理项 */
var pretreatment = function(){
	/** 防止删除键返回上个页面 */
	this.RefreshProhibit = function RefreshProhibit(e){
		var doPrevent;
		if (e.keyCode == 8) {
				var d = e.srcElement || e.target;
			if (d.tagName.toUpperCase() == 'INPUT' || d.tagName.toUpperCase() == 'TEXTAREA') {
				doPrevent = d.readOnly || d.disabled;
			}else{
				doPrevent = true;
			}
		}else{
			doPrevent = false;
		}
	
		if (doPrevent){
			e.preventDefault();
		}
	};
	/** 禁止F5刷新 */
	this.RefreshF5 = function RefreshF5(e){
		var ev = window.event || e;
		var code = ev.keyCode || ev.which;
		if (code == 116) {
			if(ev.preventDefault) {
				ev.preventDefault();
			}else{
				ev.keyCode = 0;
				ev.returnValue = false;
			}
		}
	};
	/** 判断按下的键盘值是否是自己想要的 */
	this.checkKey = function checkKey(e,val2){
		var ev = window.event || e || e.which;
		var code = ev.keyCode;
		if (code == val2) {
			return true;
		}else{
			return false;
		}
	};
};

/** 处理json数据 */
var dealJson = function(){
	this.DataListJson = DataListJson(url);
};
/** 解析json数据生成dataList数据列表  */
function DataListJson(url){
	
}

/** 底部弹框 */
var myBottomAlert = function(){
	/** 右下角斜出 <br>title 标题<br>msg 信息 */
	this.show = function show(title,msg){
		$.messager.show({
			title:title,
			msg:msg,
			showType:'show'
		});
	};
	/** 右下角斜出 <br>msg 信息 */
	this.show = function show(msg){
		$.messager.show({
			title:"提示",
			msg:msg,
			showType:'show'
		});
	};
	
	/** 右下角自下而上弹出 <br>title 标题<br>msg 信息 */
	this.slide = function slide(title,msg){
		$.messager.show({
			title:title,
			msg:msg,
			timeout:5000,
			showType:'slide'
		});
	};
	
	/** 右下角自下而上弹出 <br>msg 信息 */
	this.slide = function slide(msg){
		$.messager.show({
			title:"提示",
			msg:msg,
			timeout:5000,
			showType:'slide'
		});
	};
	
	/** 中部弹出框,进度条 timeout关闭时间 */
	this.progress = function progress(title,timeout){
		var win = $.messager.progress({
			title:title,
			msg:'Loading data...'
		});
		setTimeout(function(){
			$.messager.progress('close');
		},timeout);
	};
};
//-----------------------------------------
/** 时间处理 */
var MyDate = function(){
	/** 将时间转换为yyyy-MM-dd HH:mm:ss */
	this.formateDate = function formateDate(value){
		var date = new Date(value); 
	     var year = date.getFullYear().toString(); 
	     var month = (date.getMonth() + 1); 
	     var day = date.getDate().toString(); 
	     var hour = date.getHours().toString(); 
	     var minutes = date.getMinutes().toString(); 
	     var seconds = date.getSeconds().toString(); 
	     if (month < 10) {
	    	 month = "0" + month;
	     }
	     if (day < 10) {
	    	 day = "0" + day;
	     }
	     if (hour < 10) {
	    	 hour = "0" + hour;
	     }
	     if (minutes < 10) {
	    	 minutes = "0" + minutes;
	     }
	     if (seconds < 10) {
	     }
	  return year + "-" + month + "-" + day + " " + hour + ":" + minutes + ":" + seconds;
	};
	
	/** 得到当前时间是星期几 */
	this.week = function week(date){
		var weekDay = ["星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
		var week = weekDay[date.getDay()];
		return week;
	};
	/** 输出当前时间到指定ID域 <br>time 刷新时间 -1-表示不刷新 */
	this.currTime = function currTime(id,time){
		if(time < 0){
			var d = new Date();
			document.getElementById(id).innerHTML = 
				myDate.formateDate(d)+"&nbsp;&nbsp;"+myDate.week(d);
		}else{
			setInterval(function(){
				var d = new Date();
				document.getElementById(id).innerHTML = 
					myDate.formateDate(d)+"&nbsp;&nbsp;"+myDate.week(d);
			},time);
		}
	};
};


