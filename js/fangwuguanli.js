$(function() {
    layui.use(['element', 'table', 'form', 'laydate', 'layer', 'laypage'], function() {
        var layer = layui.layer;
        var laypage = layui.laypage;
        var pageNo = 1;
        var pageSize=10;
        $("#search").click(function() {
            pageNo= sessionStorage.getItem("pageNo")
            if(pageNo=="null"){
                pageNo=1;
            }
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
                    console.log(pageNo+"-----")
                    sessionStorage.setItem("pageNo",pageNo)
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
            //查找房屋列表
            var loading = layer.load(2);
            var data = {
                "pageNumber":pageNo,
                "pageSize":pageSize,
                "houseName": $("#houseName").val(),
                "layout": $("#layout").val(),
                "minSquare": $("#minSquare").val(),
                "maxSquare": $("#maxSquare").val(),
                "minMoney": $("#minMoney").val(),
                "maxMoney": $("#maxMoney").val(),
                "type": $("select[name='type']").val(),
                "checkInOrNot": $("#checkInOrNot").val(),
            };
            data = JSON.stringify(data);
            $.post({
                url: url + "/api/build/getBuildingsList",
                data: data,
                dataType: "json",
                contentType: 'application/json;charset=UTF-8',
                success: function (res) {
                    layer.close(loading);
                    if (res.code == 0) {
                        if (res.data.list.length > 0) {
                            page(res.data.totalSize,pageNo,pageSize)
                            $(".tableContent tbody").empty();
                            for (var i = 0; i < res.data.list.length; i++) {
                                var content = res.data.list[i];
                               if(content.type==0){
                                   typeName="新房"
                               }
                                if(content.type==1){
                                    typeName="二手房"
                                }
                                if(content.type==2){
                                    typeName="租房"
                                }
                                if(content.type==3){
                                    typeName="商铺"
                                }
                                if(content.type==4){
                                    typeName="写字楼"
                                }
                                if(content.type==5){
                                    typeName="厂房仓库"
                                }
                                if(content.type==null){
                                    typeName=" "
                                }
                                var state="";
                                var mode="";
                                if(content.mode==0){
                                    mode="出租";
                                    if(content.checkInOrNot==0){
                                        state="未出租";
                                    }
                                    if(content.checkInOrNot==1){
                                        state="已出租";
                                    }
                                }
                                if(content.mode==1){
                                    mode="出售";
                                    if(content.checkInOrNot==0){
                                        state="未出售";
                                    }
                                    if(content.checkInOrNot==1){
                                        state="已出售";
                                    }
                                }
                                if(content.mode==2){
                                    mode="整租";
                                    if(content.checkInOrNot==0){
                                        state="未出租";
                                    }
                                    if(content.checkInOrNot==1){
                                        state="已出租";
                                    }
                                }
                                if(content.mode==3){
                                    mode="合租";
                                    if(content.checkInOrNot==0){
                                        state="未出租";
                                    }
                                    if(content.checkInOrNot==1){
                                        state="已出租";
                                    }
                                }

                                var tr = "<tr>" +
                                    "<td hidden='true' class='num'>" + i + "</td>" +
                                    "<td hidden='true' class='id'>" + content.id + "</td>" +
                                    "<td  class='houseName'>" + content.houseName + "</td>" +
                                    "<td  class='title'>" + content.title + "</td>" +
                                    "<td  class='layout'>" + content.layout + "</td>" +
                                    "<td  class='housingArea'>" + content.housingArea + "</td>" +
                                    "<td  class='typeName'>" + typeName + "</td>" +
                                    "<td  class='money'>" + content.money + "</td>" +
                                    "<td  class='mode'>" + mode + "</td>" +
                                    "<td  class='state'>" + state + "</td>" +
                                    "<td  class='addTime'>"+formatDateTime(content.addTime)+ "</td>" +
                                    "<td  class='del'><p style='cursor: pointer;' class='personState delete'>删除</p>&nbsp;&nbsp;&nbsp;<p style='cursor: pointer;' class='personState btnMain'>修改</p>&nbsp;&nbsp;&nbsp;";
                                    tr+="<p style='cursor: pointer;' class='personState checkIn'>交易状态</p>"
                                    tr+="</td>"
                                    "</tr>";
                                $(".tableContent tbody").append(tr);
                            }
                            $("#num").val(pageNo);
                            //修改
                            $(".btnMain").click(function () {
                                var num = $(this).parents("tr").find(".num").text();
                                sessionStorage.setItem("id", JSON.stringify(res.data.list[num].id));
                                layer.open({
                                    type: 2,
                                    title: "修改房屋信息",
                                    area: ['600px', '600px'],
                                    content: 'fangwuguanliAdd.html',
                                    end:function () {
                                        $("#search").trigger("click");
                                    }
                                });

                            })
                            //入住
                            $(".checkIn").click(function () {
                                var num = $(this).parents("tr").find(".num").text();
                                sessionStorage.setItem("content", JSON.stringify(res.data.list[num]));
                                layer.open({
                                    type: 2,
                                    title: "修改房屋入住状态",
                                    area: ['400px', '500px'],
                                    content: 'checkInAdd.html',
                                    end:function () {
                                        $("#search").trigger("click");
                                    }
                                });

                            })
                            //删除
                            $(".delete").click(function () {
                                var id = $(this).parents("tr").find(".id").text();
                                sessionStorage.setItem("id", id);
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
                                            url: url + "/api/build/delBuildings/" + id,
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
                            $(".tableContent tbody").empty();
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
            sessionStorage.setItem("id", "");
            layer.open({
                type: 2,
                title: "添加房屋",
                area: ['600px', '600px'],
                content: 'fangwuguanliAdd.html',
                end:function () {
                    $("#search").trigger("click");
                }
            });
        })
    });
});