
var url = "https://house.zhongguohanyuan.com";
//var url = "http://127.0.0.1:8666";

//时间戳格式化年月日时分秒
function formatDateTime(inputTime) {
	if(inputTime == "" || inputTime == null) {
		return "";
	} else {
		var date = new Date(inputTime);
		var y = date.getFullYear();
		var m = date.getMonth() + 1;
		m = m < 10 ? ('0' + m) : m;
		var d = date.getDate();
		d = d < 10 ? ('0' + d) : d;
		var h = date.getHours();
		h = h < 10 ? ('0' + h) : h;
		var minute = date.getMinutes();
		var second = date.getSeconds();
		minute = minute < 10 ? ('0' + minute) : minute;
		second = second < 10 ? ('0' + second) : second;
		return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
	}
};
//时间戳格式化年月日
function formatDate(inputTime) {
	if(inputTime == "" || inputTime == null) {
		return "";
	} else {
		var date = new Date(inputTime);
		var y = date.getFullYear();
		var m = date.getMonth() + 1;
		m = m < 10 ? ('0' + m) : m;
		var d = date.getDate();
		d = d < 10 ? ('0' + d) : d;
		return y + '-' + m + '-' + d;
	}

};

