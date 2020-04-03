//JavaScript代码区域
$(function() {
	layui.use(['form', 'element', "table", 'layer','laypage', 'laydate'], function() {
		var layer = layui.layer;
		var laydate = layui.laydate;
		var laypage=layui.laypage;
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
		function find(pageNo) {
			//查找合同列表
			var loading = layer.load(2);
			var data = {
				"pageNumber":pageNo,
				"pageSize":pageSize,
                "contractCoding": $("#contractCoding").val(),
                "phone": $("#phone").val()
			};
		data = JSON.stringify(data);
		$.post({
			url: url + "/api/contract/getContractList",
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
							var tr= "<tr>" +
								"<td hidden='true' class='id'>" + content.id + "</td>" +
								"<td hidden='true' class='num'>" + i + "</td>" +
								"<td  class='xuhao'>" + j + "</td>" +
                                "<td  class='title'>"+content.title+"</td>" +
								"<td  class='contractCoding'>"+content.contractCoding+"</td>" +
                                "<td  class='name'>"+content.name+ "</td>" +
								"<td  class='phone'>"+content.phone+ "</td>" +
								"<td  class='addTime'>"+formatDateTime(content.addTime)+ "</td>" +
								"<td  class='del'><p style='cursor: pointer;' class='personState delete'>删除</p>&nbsp;&nbsp;&nbsp;&nbsp;<p style='cursor: pointer;' class='personState btnMain'>修改</p>&nbsp;&nbsp;&nbsp;&nbsp;<p style='cursor: pointer;' class='personState state'>状态</p></td>" +
								"</tr>";
							$(".tableContent tbody").append(tr);
							j++;
						}
						$("#num").val(pageNo);
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

									$.get({
										url: url + "/api/contract/delContract/"+id,
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
                                  title: "修改合同信息",
                                  area: ['500px', '600px'],
                                  content: 'hetongguanliAdd.html'
                              });

                          })

                        //修改状态
                        $(".state").click(function(){
                            var id = $(this).parents("tr").find(".id").text();
                            sessionStorage.setItem("id", id);
                            var num = $(this).parents("tr").find(".num").text();
                            sessionStorage.setItem("content", JSON.stringify(res.data.list[num]));
                            layer.open({
                                type: 2,
                                title: "修改状态信息",
                                area: ['800px', '600px'],
                                content: 'hetongzhuangtai.html'
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
				title: "添加合同",
				area: ['600px', '600px'],
				content: 'hetongguanliAdd.html',
			});
		})
		/*//保存
		$("#save").click(function(){

			$("#save").attr("disabled", 'disabled');
			setTimeout(function(){
				$("#save").attr("disabled", false);
			}, 2000);
			var loading = layer.load(2);
			var data = {
				"contractId": $("#id").val(),
                "state": $("select[name='state']").val()
			};
			data = JSON.stringify(data);
			layer.close(loading);
			$.post({
				url: url + "/api/contract/saveContractState",
				data: data,
				dataType: "json",
				contentType: 'application/json;charset=UTF-8',
				success: function(res) {
					if(res.code == 0) {
						layer.msg('添加成功', {
							time: 1000
						});
					} else {
						layer.msg(res.msg, {
							time: 1000
						});
					}
					layer.close(loading);
				}
			});
		})*/
/*        var obj=sessionStorage.getItem("content");
        if(obj==null || obj==""){
            return false;
        }else {
            var json = JSON.parse(obj);
            $("#contractId").val(json.id);
            var obj = document.getElementById("state");
            for (var i = 0; i < obj.length; i++) {
                if (json.state == obj[i].value) {
                    obj[i].selected = true;
                }
            }
        }*/
	});
});