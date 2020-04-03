//JavaScript代码区域
$(function() {
    layui.use(['form', 'element', "table", 'layer','laypage', 'laydate'], function() {
        var layer = layui.layer;
        var laydate = layui.laydate;
        var laypage=layui.laypage;
        var pageNo = 1;//当前页
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
            $("#search").attr("disabled", 'disabled');
            setTimeout(function () {
                $("#search").attr("disabled", false);
            }, 2000);
            var data={
                "pageNo":pageNo,
                "pageSize":pageSize
            }
            data=JSON.stringify(data);
        var loading = layer.load(2);
            $.post({
            url: url + "/api/banner/getBannerList",
            data:data,
            contentType: 'application/json;charset=UTF-8',
            success: function(res) {
                layer.close(loading);
                if(res.code == 0) {
                    if(res.data.list.length > 0) {
						  page(res.data.totalSize,pageNo,pageSize)
                        $(".tableContent tbody").empty();
                        var j=1;
                        for(var i = 0; i < res.data.list.length; i++) {
                            var content= res.data.list[i];
                            var tr= "<tr>" +
								"<td  hidden='true' class='id' >" + content.id + "</td>" +
                                "<td  class='xuhao'>" + j + "</td>" +
                                "<td  class='title'>" + content.title + "</td>" +
                                "<td  class='img'><img src='"+url+content.img+"'></img></td>" +
                                "<td  class='sort'>"+content.sort+ "</td>" +
                                "<td  class='del'><p style='cursor: pointer;' class='personState delete'>删除</p></td>" +
                                "</tr>";
                            $(".tableContent tbody").append(tr);
                            j++;
                        }
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
                                content: '<div style="text-align:center;margin:15px auto;height:10px;">'+'确认删除吗'+'</div>' ,
                                area: ['250px', '140px'],
                                skin: 'layui-layer-molv',
                                shade: 0,
								btnAlign: 'c',
                                title :'提示信息',
                                btn: ['删除'],
                                yes: function(index, layero){
                                    $.post({
                                        url: url + "/api/banner/delBanner/"+id,
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
                                                layer.msg(res.retMsg, {
                                                    time: 1000
                                                });
                                            }
                                        }
                                    });
                                }
                            });
                        });
                        //修改
                      /*  $(".btnMain").click(function(){
                            var id = $(this).parents("tr").find(".id").text();
                            var uname = $(this).parents("tr").find(".uname").text();
                            var phone = $(this).parents("tr").find(".phone").text();
                            var idNumber = $(this).parents("tr").find(".idNumber").text();
                            var goldBeans = $(this).parents("tr").find(".goldBeans").text();
                            var maxGoldBean = $(this).parents("tr").find(".maxGoldBean").text();
                            sessionStorage.setItem("id", id);
                            sessionStorage.setItem("uname", uname);
                            sessionStorage.setItem("phone", phone);
                            sessionStorage.setItem("idNumber", idNumber);
                            sessionStorage.setItem("goldBeans", goldBeans);
                            sessionStorage.setItem("maxGoldBean", maxGoldBean);
                            layer.open({
                                type: 2,
                                title: "修改会员",
                                area: ['400px', '400px'],
                                content: 'jindouadd.html'
                            });

                        })*/
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
        //添加
        $("#add").click(function(){
            $("#yue").css("display","none");
            sessionStorage.setItem("id", "");
            sessionStorage.setItem("title", "");
            sessionStorage.setItem("img", "");
            sessionStorage.setItem("sort", "");
            sessionStorage.setItem("link", "");
            layer.open({
                type: 2,
                title: "添加banner",
                area: ['400px', '400px'],
                content: 'bannerAdd.html',
                end:function () {
                    $("#search").trigger("click")
                }
            });
        })

        $("#save").click(function () {
            var file=document.querySelector("input[type=file]").files.length;
            if (file == 0) {
                msg("请选择图片");
                return false;
            }
            var options = {
                url: url + "/api/banner/saveBanner",
                type: 'POST',
                success: function (res) {
                    if (res.code == "0") {
                        layer.msg('保存成功', {
                            time: 2000
                        });
                        setTimeout(function () {
                            var index = parent.layer.getFrameIndex(window.name);
                            parent.layer.close(index);
                        }, 1000);
                    } else {
                        layer.msg('保存失败', {
                            time: 1000
                        });
                    }
                }
            };
            $("#regform").ajaxForm(options);
        })

        function msg(msg) {
            layer.msg(msg, {
                time: 1000
            });
        }
    });
    

    
});