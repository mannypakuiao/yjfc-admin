//JavaScript代码区域
$(function() {
	layui.use(['form', 'element', "table", 'layer', 'laydate'], function() {
		var layer = layui.layer;
		var laydate = layui.laydate;
		laydate.render({
			elem: '#dateAll',
			range: true
		});
		$("#search").click(function() {
			find();
		});
		function find() {
			//查找关于我们列表
			$("#search").attr("disabled", 'disabled');
			setTimeout(function () {
				$("#search").attr("disabled", false);
			}, 2000);
			$("#page").show();
			var loading = layer.load(2);
		$.post({
			url: url + "/api/aboutUs/getAboutUsList",
			contentType: 'application/json;charset=UTF-8',
			success: function(res) {
				console.log(res)
				layer.close(loading);
				if(res.code == 0) {
						$(".tableContent tbody").empty();
							var content= res.data;
                    		if(content!=null){
                        		$("#add").hide();
                                var tr= "<tr>" +
                                    "<td hidden='true' class='id'>" + content.id + "</td>" +
                                    "<td  class='name'>"+content.name+"</td>" +
                                    "<td  class='address'>"+content.address+ "</td>" +
                                    "<td  class='phone'>"+content.phone+ "</td>" +
                                    "<td  class='del'><p style='cursor: pointer;' class='personState btnMain'>修改</p></td>" +
                                    "</tr>";
                                $(".tableContent tbody").append(tr);
                    		}
						//修改
						 $(".btnMain").click(function(){
							  sessionStorage.setItem("content", JSON.stringify(res.data));
                              layer.open({
                                  type: 2,
                                  title: "修改关于我们",
                                  area: ['500px', '500px'],
                                  content: 'guanyuwomenAdd.html'
                              });

                          })
				} else {
					layer.msg(res.retMsg, {
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
				title: "添加关于我们",
				area: ['500px', '500px'],
				content: 'guanyuwomenAdd.html'
			});
		})
		//保存
		$("#save").click(function(){

			$("#save").attr("disabled", 'disabled');
			setTimeout(function(){
				$("#save").attr("disabled", false);
			}, 2000);
			console.log(url)
            var loading = layer.load(2);
            $("#regform").ajaxSubmit({
                url: url + "/api/aboutUs/saveAboutUs",
                type: "post",
                enctype: 'multipart/form-data',
                success: function (res)
                {
                	console.log(res)
                    if (res.code == "0") {
                        layer.msg('保存成功', {
                            time: 1000
                        });
                        $("#search").trigger("click");
                        setTimeout(function () {
                            var index = parent.layer.getFrameIndex(window.name);
                            parent.layer.close(index);
                        }, 1000);
                    } else {
                        layer.msg('保存失败', {
                            time: 1000
                        });
                    }
                    layer.close(loading);
                },
                error: function (data)
                {
                    alert("出错");//msg.errCode
                }
            })
		})

		var obj=sessionStorage.getItem("content");
        if(obj==null || obj==""){
            return false;
        }else{
			var json=JSON.parse(obj);
            $("#id").val(json.id);
			$("#name").val(json.name);
			$("#about").val(json.about);
			$("#address").val(json.address);
			$("#phone").val(json.phone);
            if (json.img != null && json.img !="") {
                var str = "<img  src='" +url+ json.img + "' class='lazy' style='width:180px; height:120px;padding:10px'>"
                $("#mainImg").append(str)
            }
		}
	});
});