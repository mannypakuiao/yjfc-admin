$(function() {
    var userId = sessionStorage.getItem("userId");
    layui.use(['form', 'element', "table", 'layer', 'laydate'], function() {
        var layer = layui.layer;
        var element = layui.element;
		//遍历匹配当前所选tabs并修改为选中样式
		element.on("tab(tabs)", function(data) {
			var tabText = this.innerText.substring(0, this.innerText.length - 1);
			$(".layui-nav-item a.tabs-a").each(function() {
				if($(this).text() == tabText) {
					$(".layui-nav-item .tabs-a").parent().removeClass("layui-this");
					$(this).parent().addClass("layui-this")
				}
			})
		});
		$(".layui-nav-item a.tabs-a").click(function() {
			var title = $(this).text();
			title = title.substring(0, title.length - 1);
			switch(title) {
					case "轮播图管理":
						judge(title, "pages/banner/banner.html");
						break;
					case "公告管理":
						judge(title, "pages/notice/notice.html");
						break;
					case "分类管理":
						judge(title, "fenleiguanli.html");
						break;
					case "小区管理":
						judge(title, "pages/xiaoquguanli/xiaoquguanli.html");
						break;
					case "房屋管理":
						judge(title, "pages/fangwuguanli/fangwuguanli.html");
						break;
					case "入住统计":
						judge(title, "pages/ruzhutongji/ruzhutongji.html");
						break;
					case "关于我们":
						judge(title, "pages/guanyuwomen/guanyuwomen.html");
						break;
					case "经纪人管理":
						judge(title, "pages/jingjirenguanli/jingjirenguanli.html");
						break;
					case "用户管理":
						judge(title, "pages/yonghuguanli/yonghuguanli.html");
						break;
					case "意见反馈":
						judge(title, "pages/xuqiubaogao/xuqiubaogao.html");
						break;
					case "合同管理":
						judge(title, "pages/hetongguanli/hetongguanli.html");
						break;
					case "计算公式":
						judge(title, "jisuangongshi.html");
						break;
					case "预约登记":
						judge(title, "pages/yuyuedengji/yuyuedengji.html");
						break;
					case "委托出售":
						judge(title, "pages/weituochushou/weituochushou.html");
						break;
					case "房源关注管理":
						judge(title, "pages/fangyuanguanzhu/fangyuanguanzhu.html");
						break;
					case "咨询管理":
						judge(title, "pages/zixun/zixun.html");
						break;

			}
		});

		function judge(title, url) {
			sessionStorage.setItem("pageNo",null)
			if($(".layui-tab-title li").length == 0) {
				$(".layui-tab").show();
				$(".body-content img").hide();
				element.tabAdd("tabs", {
					title: title,
					content: "<iframe src='" + url + "' frameborder='0' width='100%' height='100%'></iframe>",
					id: title
				});
				element.tabChange("tabs", title)
			} else {
				var array = [];
				$(".layui-tab-title li").each(function(index) {
					array.push($(".layui-tab-title li").eq(index).attr("lay-id"))
				});
				if(array.indexOf(title) >= 0) {
					element.tabChange("tabs", title)
				} else {
					element.tabAdd("tabs", {
						title: title,
						content: "<iframe src='" + url + "' frameborder='0' width='100%' height='100%'></iframe>",
						id: title
					});
					element.tabChange("tabs", title)
				}
			}
		}
		
		$("#exitbtnn").click(function() {
			layer.open({
				type: 2,
				title: "修改密码",
				area: ['400px', '300px'],
				content: 'password.html' //这里content是一个URL，如果你不想让iframe出现滚动条，你还可以content: ['http://sentsin.com', 'no']
			});
		});
	})

});