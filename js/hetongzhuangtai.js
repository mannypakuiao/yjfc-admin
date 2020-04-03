//JavaScript代码区域
$(function() {
    layui.use(['form', 'element', "table", 'layer', 'laydate'], function() {
        var layer = layui.layer;
        var laydate = layui.laydate;
        var pageNo = 1;
        var totalPage = 0;
        laydate.render({
            elem: '#updateTime',
            type: 'date'
        });
        $("#search").click(function() {
            find(1);
        });
        $("#last").click(function() {
            if(pageNo>1){
                pageNo--;
                find(pageNo);
            }else{
                layer.msg("已经是第一页", {
                    time: 1000
                });
            }
        });
        $("#next").click(function() {
            if(pageNo >= totalPage) {
                layer.msg("已经是最后一页", {
                    time: 1000
                });
            }else{
                pageNo++;
                find(pageNo);
            }
        });
        function find(pageNo) {
            //查找合同列表
            $("#search").attr("disabled", 'disabled');
            setTimeout(function () {
                $("#search").attr("disabled", false);
            }, 2000);
            $("#page").show();
            var loading = layer.load(2);
            var id=sessionStorage.getItem("id");
            $.post({
                url: url + "/api/contract/getContractStateList/"+id,
                dataType: "json",
                contentType: 'application/json;charset=UTF-8',
                success: function(res) {
                    if(res.code == 0) {
                        if(res.data.length > 0) {
                            $(".tableContent tbody").empty();
                            var j=1;
                            for(var i = 0; i < res.data.length; i++) {
                                var content= res.data[i];
                                if(content.state==0){
                                    stateName="验房中";
                                }
                                if(content.state==1){
                                    stateName="订房中";
                                }
                                if(content.state==2){
                                    stateName="已定房";
                                }
                                if(content.state==3){
                                    stateName="过户中";
                                }
                                if(content.state==4){
                                    stateName="已过户";
                                }
                                if(content.state==5){
                                    stateName="已完成";
                                }
                                if(content.state==null){
                                    stateName=" ";
                                }
                                var tr= "<tr>" +
                                    "<td hidden='true' class='id'>" + content.id + "</td>" +
                                    "<td hidden='true' class='num'>" + i + "</td>" +
                                    "<td  class='xuhao'>" + j + "</td>" +
                                    "<td  class='stateName'>"+stateName+ "</td>" +
                                    "<td  class='addTime'>"+formatDate(content.updateTime)+ "</td>" +
                                    "<td  class='del'><p style='cursor: pointer;' class='personState delete'>删除</p></td>" +
                                    "</tr>";
                                $(".tableContent tbody").append(tr);
                                j++;
                            }
                            $("#num").val(pageNo);

                            //删除
                            $(".delete").click(function () {
                                var id = $(this).parents("tr").find(".id").text();
                                $("#delete").attr("disabled", 'disabled');
                                setTimeout(function () {
                                    $("#delete").attr("disabled", false);
                                }, 2000);
                                var tr = $(this).parents("tr");
                                layer.open({
                                    type: 1,
                                    content: '确认删除吗',
                                    area: ['250px', '140px'],
                                    skin: 'layui-layer-molv',
                                    shade: 0,
                                    title: '提示信息',
                                    btn: ['删除'],
                                    yes: function (index, layero) {
                                        $.post({
                                            url: url + "/api/contract/delContractState/" + id,
                                            dataType: "json",
                                            data: content,
                                            contentType: 'application/json;charset=UTF-8',
                                            success: function (res) {
                                                if (res.code == 0) {
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
                        }else {
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
                    layer.close(loading);
                }
            });
        }
        //添加
        $("#add").click(function(){
            $("#yue").css("display","none");
            sessionStorage.setItem("content", "");
            layer.open({
                type: 2,
                title: "添加合同状态",
                area: ['500px', '500px'],
                content: 'hetongzhuangtaiAdd.html',
            });
        })

        //保存
		$("#save").click(function(){

			$("#save").attr("disabled", 'disabled');
			setTimeout(function(){
				$("#save").attr("disabled", false);
			}, 2000);
			var data = {
				"contractId": $("#contractId").val(),
                "state": $("select[name='state']").val(),
                "updateTime": $("#updateTime").val()
			};
            if(data.updateTime==""){
                layer.msg("请选择时间", {
                    time: 1000
                });
                return false
            }
            if(data.state=="") {
                layer.msg("请选择当前合同状态", {
                    time: 1000
                });
                return false
            };
			data = JSON.stringify(data);
            var loading = layer.load(2);
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

          var id=sessionStorage.getItem("id");
           $("#contractId").val(id);

    });
});