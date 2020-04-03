//JavaScript代码区域
$(function() {
    layui.use(['form', 'element', "table",'laypage', 'layer', 'laydate'], function() {
        var layer = layui.layer;
        var laydate = layui.laydate;
        var laypage=layui.laypage;
        var pageNo = 1;
        var pageSize = 10;
        laydate.render({
            elem: '#appointmentDate',
            type: 'datetime'
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
            //查找预约登记列表
            $("#search").attr("disabled", 'disabled');
            setTimeout(function () {
                $("#search").attr("disabled", false);
            }, 2000);
            $("#page").show();
            var loading = layer.load(2);
            var data = {
                "pageNumber":pageNo,
                "pageSize":pageSize,
                "userName": $("#name").val(),
                "userPhone": $("#phone").val(),
                "state": $("#state option:selected").val()
            };
            data = JSON.stringify(data);
            console.log(data)
            $.post({
                url: url + "/api/appointment/getAppointmentList",
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
                                var str="";
                                if(content.state==0){
                                    str="未处理";
                                }
                                if(content.state==1){
                                    str="已处理";
                                }
                                var tr= "<tr>" +
                                    "<td hidden='true' class='id'>" + content.id + "</td>" +
                                    "<td hidden='true' class='num'>" + i + "</td>" +
                                    "<td  class='xuhao'>" + j + "</td>" +
                                    "<td  class='userName'>"+content.userName+"</td>" +
                                    "<td  class='userPhone'>"+content.userPhone+ "</td>" +
                                    "<td  class='houseName'>"+content.houseName+ "</td>" +
                                    "<td  class='appointmentDate'>"+formatDateTime(content.appointmentDate)+ "</td>" +
                                    "<td  class='content'>"+content.content+ "</td>" +
                                    "<td  class='state'>"+str+ "</td>" +
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
                                            url: url + "/api/appointment/delAppointment/"+id,
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
                                    title: "修改预约信息",
                                    area: ['400px', '500px'],
                                    content: 'yuyuedengjiAdd.html',
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
                title: "添加预约信息",
                area: ['400px', '500px'],
                content: 'yuyuedengjiAdd.html',
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
            var data = {
                "id": $("#id").val(),
                "userName": $("#userName").val(),
                "userPhone": $("#userPhone").val(),
                "houseName": $("#houseName").val(),
                "appointmentDate": $("#appointmentDate").val(),
                "state":$("#state option:selected").val(),
                "content":$("#content").val()
            };
            if(data.userName==""){
                msg("请填写预约人称呼");
                return false;
            }
            if(data.appointmentDate==""){
                msg("请选择预约时间");
                return false;
            }
            if(data.userPhone==""){
                msg("请填写预约联系方式");
                return false;
            }
            if(data.houseName==""){
                msg("请填写预约房屋信息");
                return false;
            }
            var loading = layer.load(2);
            data = JSON.stringify(data);
            $.post({
                url: url + "/api/appointment/saveAppointment",
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
                        }, 2000);
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
            console.log(obj)
            var json=JSON.parse(obj);
            $("#id").val(json.id);
            $("#userName").val(json.userName);
            $("#userPhone").val(json.userPhone);
            $("#houseName").val(json.houseName);
            $("#appointmentDate").val(formatDateTime(json.appointmentDate));
            $("#state").val(json.state);
            $("#content").val(json.content);
            var obj = document.getElementById("state");
            for (var i = 0; i < obj.length; i++) {
                if (json.state == obj[i].value) {
                    obj[i].selected = true;
                }
            }
        }
    });
    function msg(msg) {
        layer.msg(msg, {
            time: 1000
        });
    }
});