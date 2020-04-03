//JavaScript代码区域
$(function() {
	layui.use(['form', 'element', "table",'laypage', 'layer', 'laydate'], function() {
		var layer = layui.layer;
		var laydate = layui.laydate;
		var laypage=layui.laypage;
		var pageNo = 1;
		var pageSize =10;
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
			//查找公告列表
			var loading = layer.load(2);
			var data = {
				"pageNumber":pageNo,
                "title": $("#str").val(),
				"pageSize":pageSize
			};
		data = JSON.stringify(data);
		$.post({
			url: url + "/api/notice/getNoticeList",
			data: data,
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
							if(content.link==null){
								content.link="";
							}
							var tr= "<tr>" +
								"<td hidden='true' class='id'>" + content.id + "</td>" +
								"<td hidden='true' class='num'>" + i + "</td>" +
								"<td  class='xuhao'>" + j + "</td>" +
								"<td  class='title'>"+content.title+"</td>" +
								"<td  class='addTime'>"+formatDateTime(content.addTime)+ "</td>" +
								"<td  class='del'><p style='cursor: pointer;' class='personState delete'>删除</p>&nbsp;&nbsp;&nbsp;&nbsp;<p style='cursor: pointer;' class='personState btnMain'>修改</p></td>" +
								"</tr>";
							$(".tableContent tbody").append(tr);
							j++;
						}
						$("#num").val(pageNo);
						layer.close(loading);
						$(".delete").click(function() {
							var id = $(this).parents("tr").find(".id").text();
							sessionStorage.setItem("id", id);
							$("#delete").attr("disabled", 'disabled');
							setTimeout(function(){
								$("#delete").attr("disabled", false);
							}, 2000);
							var tr = $(this).parents("tr");
							layer.open({
								type: 1,
								content: '<div style="text-align:center;margin:15px auto;height:10px;">'+'确认删除吗'+'</div>'  ,
								area: ['250px', '140px'],
								skin: 'layui-layer-molv',
								shade: 0,
								btnAlign: 'c',
								title :'提示信息',
								btn: ['删除'],
								yes: function(index, layero){

									$.post({
										url: url + "/api/notice/delNotice/"+id,
										dataType: "json",
										data: content,
										contentType: 'application/json;charset=UTF-8',
										success: function(res) {
											if(res.code == 0) {
												layer.msg('删除成功', {
													time: 1000
												});
												tr.remove();
												layer.close(index);
											} else {
												layer.msg(res.msg, {
													time: 1000
												});
											}
										}
									});
								}
							});
						});
						//修改
						 $(".btnMain").click(function(){
                              var num = $(this).parents("tr").find(".num").text();
							  sessionStorage.setItem("content", JSON.stringify(res.data.list[num]));//将数据解析成字符串，保存到session里面
									
                              layer.open({
                                  type: 2,
                                  title: "修改公告",
                                  area: ['400px', '400px'],
                                  content: 'noticeAdd.html',
								  end:function () {
									  $("#search").trigger("click");
                                  }
                              });

                          })
					}else {
						layer.close(loading);
						$(".tableContent tbody tr").remove();
						layer.msg("暂无数据", {
							time: 1000
						});
					}
				} else {
					layer.msg(res.msg, {
						time: 1000
					});
				}
			}
		});
		}
		//添加
		$("#add").click(function(){
			$("#yue").css("display","none");
			sessionStorage.setItem("content", "");
			layer.open({
				type: 2,
				title: "添加公告",
				area: ['400px', '400px'],
				content: 'noticeAdd.html',
				end:function () {
					$("#search").trigger("click")
                }
			});
		})
		//保存
		$("#save").click(function(){

			$("#save").attr("disabled", 'disabled');
			setTimeout(function(){
				$("#save").attr("disabled", false);
			}, 2000);
			var loading = layer.load(2);
			var today = new Date();
			var data = {
				"id": $("#id").val(),
				"title": $("#title").val(),
				"link": $("#link").val(),
				"addTime": today
			};
            if(data.title==""){
                layer.close(loading);
                msg("请填写标题")
                return false;
            }
            // if(data.link==""){
            //     layer.close(loading);
            //     msg("请填写公告内容")
            //     return false;
            // }
			data = JSON.stringify(data);
			$.post({
				url: url + "/api/notice/saveNotice",
				data: data,
				dataType: "json",
				contentType: 'application/json;charset=UTF-8',
				success: function(res) {
					if(res.code == 0) {
						layer.msg('添加成功', {
							time: 1000
						});
                        setTimeout(function () {
                            var index = parent.layer.getFrameIndex(window.name);
                            parent.layer.close(index);
                        }, 1000);
					} else {
						layer.msg(res.msg, {
							time: 1000
						});
					}
					layer.close(loading);
				}
			});
		})
		var obj=sessionStorage.getItem("content");
		
		if(obj!='' && obj!==null){
			var json=JSON.parse(obj);
			$("#id").val(json.id);
			$("#title").val(json.title);
			$("#link").val(json.link);
		}
	});
    function msg(msg) {
        layer.msg(msg, {
            time: 1000
        });
    }
});