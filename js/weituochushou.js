//JavaScript代码区域
$(function() {
	layui.use(['form', 'element', "table", 'layer','laypage', 'laydate'], function() {
		var layer = layui.layer;
		var laydate = layui.laydate;
		var  laypage=layui.laypage;
		var pageNo = 1;
		var pageSize = 10;
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
			//查找委托出售列表
			$("#search").attr("disabled", 'disabled');
			setTimeout(function () {
				$("#search").attr("disabled", false);
			}, 2000);
			$("#page").show();
			var loading = layer.load(2);
			var data = {
				"pageNumber":pageNo,
				"pageSize":pageSize,
                "clientName": $("#name").val(),
                "clientPhone": $("#phone").val()
			};
		data = JSON.stringify(data);
		$.post({
			url: url + "/api/consigned/getConsignedSaleList",
			data:data,
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
							var typeName="";
                            var stateName="";
							if(content.type==0){
								typeName="出租";
							}
                            if(content.type==1){
                                typeName="出售";
                            }
                            if(content.state==0){
                                stateName="未处理";
                            }
                            if(content.state==1){
                                stateName="已处理";
                            }
							var tr= "<tr>" +
								"<td hidden='true' class='id'>" + content.id + "</td>" +
								"<td hidden='true' class='num'>" + i + "</td>" +
								"<td  class='xuhao'>" + j + "</td>" +
								"<td  class='clientName'>"+content.clientName+"</td>" +
								"<td  class='clientPhone'>"+content.clientPhone+ "</td>" +
                                "<td  class='houseName'>"+content.houseName+ "</td>" +
                                "<td  class='clientAddress'>"+content.clientAddress+ "</td>" +
                                "<td  class='typeName'>"+typeName+ "</td>" +
                                "<td  class='stateName'>"+stateName+ "</td>" +
								"<td  class='addTime'>"+formatDateTime(content.addTime)+ "</td>" +
								"<td  class='del'><p style='cursor: pointer;' class='personState delete'>删除</p>&nbsp;&nbsp;&nbsp;<p style='cursor: pointer;' class='personState btnMain'>修改状态</p></td>" +
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
								yes: function(index){

									$.post({
										url: url + "/api/consigned/delConsignedSale/"+id,
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
                                  title: "修改委托状态",
                                  area: ['400px', '400px'],
                                  content: 'weituochushouAdd.html',
								  end:function () {
									  $("#search").trigger("click")
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
		//保存
		$("#save").click(function(){

			$("#save").attr("disabled", 'disabled');
			setTimeout(function(){
				$("#save").attr("disabled", false);
			}, 2000);
			var loading = layer.load(2);
			var data = {
				"id": $("#id").val(),
				"state": $("select[name='state']").val()
			};
			data = JSON.stringify(data);
			layer.close(loading);
			$.post({
				url: url + "/api/consigned/saveConsignedSale",
				data: data,
				dataType: "json",
				contentType: 'application/json;charset=UTF-8',
				success: function(res) {
					if(res.code == 0) {
						layer.msg('保存成功', {
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

        if(obj==null || obj==""){
            return false;
        }else{
			var json=JSON.parse(obj);
			$("#id").val(json.id);
            var obj = document.getElementById("state");
            for (var i = 0; i < obj.length; i++) {
                if (json.state == obj[i].value) {
                    obj[i].selected = true;
                }
            }
		}
	});
});