//JavaScript代码区域
$(function() {
    layui.use(['form', 'element', "table", 'layer','laypage', 'laydate'], function() {
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
        function find(pageNo) {
            //查找需求报告列表
            $("#search").attr("disabled", 'disabled');
            setTimeout(function () {
                $("#search").attr("disabled", false);
            }, 2000);
            $("#page").show();
            var loading = layer.load(2);
            var data = {
                "pageNo":pageNo,
                "pageSize":pageSize
            };
            data = JSON.stringify(data);
            $.post({
                url: url + "/api/demand/getDemandReportList",
                data:data,
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
                                if(content.type==0){
                                    str="未处理";
                                }else {
                                    str="已处理";
                                }
                                var tr= "<tr>" +
                                    "<td hidden='true' class='id'>" + content.id + "</td>" +
                                    "<td hidden='true' class='num'>" + i + "</td>" +
                                    "<td  class='name'>"+content.name+"</td>" +
                                    "<td  class='phone'>"+content.phone+ "</td>" +
                                    "<td  class='demandContent'>"+content.demandContent+ "</td>" +
                                    "<td  class='addTime'>"+formatDateTime(content.addTime)+ "</td>" +
                                    "<td  class='type'>"+str+ "</td>" +
                                    "<td  class='upTime'>"+formatDateTime(content.upTime)+ "</td>" +
                                    "<td  class='del'><p style='cursor: pointer;' class='personState btnMain'>处理</p></td>" +
                                    "</tr>";
                                $(".tableContent tbody").append(tr);
                                j++;
                            }
                            $("#num").val(pageNo);
                            layer.close(loading);

                            $(".btnMain").click(function() {
                                var id = $(this).parents("tr").find(".id").text();
                                sessionStorage.setItem("id", id);
                                layer.open({
                                    type: 1,
                                    content: '<div style="text-align:center;margin:15px auto;height:10px;">'+'确认改为已处理吗'+'</div>'  ,
                                    area: ['250px', '140px'],
                                    skin: 'layui-layer-molv',
                                    shade: 0,
                                    btnAlign: 'c',
                                    title :'提示信息',
                                    btn: ['确认'],
                                    yes: function(index, layero){
                                        $.get({
                                            url: url + "/api/demand/update/"+id,
                                            dataType: "json",
                                            contentType: 'application/json;charset=UTF-8',
                                            success: function(res) {
                                                if(res.code == 0) {
                                                    layer.msg('修改成功', {
                                                        time: 1000
                                                    });
                                                    layer.close(index);
                                                    $("#search").trigger("click");
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