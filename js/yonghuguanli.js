//JavaScript代码区域
$(function() {
	layui.use(['form', 'element', "table",'laypage', 'layer', 'laydate'], function() {
		var layer = layui.layer;
		var laydate = layui.laydate;
		var laypage=layui.laypage;
		var pageNo = 1;
		var pageSize=10;
		laydate.render({
			elem: '#dateAll',
			range: true
		});
		$("#search").click(function() {
			find(pageNo,pageSize);
		});
        $("#search").trigger("click");
        function page(totalSize,pageNo,pageSize){
            laypage.render({
                elem: 'page', //注意，这里的 test1 是 ID，不用加 # 号
                curr:pageNo
                ,count: totalSize, //数据总数，从服务端得到
                layout: ['count', 'prev', 'page', 'next', 'limit', 'refresh', 'skip'],
                limit:pageSize,   //每页条数设置
                jump: function(obj, first){
                    //首次不执行
                    if(!first){
                        pageNo=obj.curr;  //改变当前页码
                        pageSize=obj.limit;
                        find(pageNo,pageSize)
                    }
                }
            });
        }
		function find(pageNo,pageSize) {
			//查找用户列表
			var loading = layer.load(2);
			var data = {
				"pageNumber":pageNo,
				"pageSize":pageSize,
                "nickName": $("#nickName").val(),
                "phone": $("#phone").val()
			};
		data = JSON.stringify(data);
		console.log(data)
            $.post({
			url: url + "/api/user/getUserList",
            data: data,
            dataType: "json",
			contentType: 'application/json;charset=UTF-8',
			success: function(res) {
				layer.close(loading);
				if(res.code == 0) {
					page(res.data.totalSize,pageNo,pageSize)
					if(res.data.list.length > 0) {
						$(".tableContent tbody").empty();
						var j=1;
						for(var i = 0; i < res.data.list.length; i++) {
							var content= res.data.list[i];
							var phone="";
							if(content.phone==null){
                                phone="";
							}else {
                                phone=content.phone;
							}
							var tr= "<tr>" +
								"<td hidden='true' class='id'>" + content.id + "</td>" +
								"<td hidden='true' class='num'>" + i + "</td>" +
								"<td  class='nickName'>"+content.nickName+"</td>" +
								"<td  class='phone'>"+phone+ "</td>" +
                                "<td  class='city'>"+content.city+ "</td>" +
                                "<td  class='img'><img style='width: 60px;height: 60px' src='"+content.img+"'></img></td>" +
								"<td  class='addTime'>"+formatDateTime(content.addTime)+ "</td>" +
								"</tr>";
							$(".tableContent tbody").append(tr);
							j++;
						}
						$("#num").val(pageNo);
						layer.close(loading);
					}else {
						layer.close(loading);
						$(".tableContent tbody tr").remove();
						layer.msg("暂无数据", {
							time: 1000
						});
					}
				} else {
					layer.msg(res.retMsg, {
						time: 1000
					});
				}
			}
		});
		}
	});
});