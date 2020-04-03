$(function(){
    layui.use(['element', 'table', 'form', 'laydate', 'layer', 'laypage'], function() {
        var layer = layui.layer;
        var form = layui.form;
        //查找市
        $.get({
            url: url + "/api/house/getAreaList",
            dataType: "json",
            contentType: 'application/json;charset=UTF-8',
            success: function(res) {
                if(res.code == 0) {
                    var data = res.data;
                    for(var m in data) {
                        $("#province").append("<option  value='" + data[m].cityCode + "'>" + data[m].houseName + "</option>");
                    }
                    form.render("select");
                } else {
                    layer.msg(res.msg, {
                        time: 1000
                    });
                }
                //修改赋值
                var obj=sessionStorage.getItem("content");
                if (obj == null || obj == "") {
                    return false;
                } else {
                    var json=JSON.parse(obj);
                    $("#id").val(json.id);
                    $("#houseName").val(json.houseName);
                    $("#lon").val(json.lon);
                    $("#lat").val(json.lat);
                    var obj = document.getElementById("province");
                    for (var i = 0; i < obj.length; i++) {
                        if (json.parentCode == obj[i].value) {
                            obj[i].selected = true;
                            province(json.parentCode,json.areaCode)
                        }
                    }
                }

            }
        });
        //查找区域
        function province(cityCode,code) {
            $.get({
                url: url + "/api/house/getCityList?cityCode="+cityCode,
                dataType: "json",
                contentType: 'application/json;charset=UTF-8',
                success: function(res) {
                    if(res.code == 0) {
                        var data = res.data;
                        for(var m in data) {
                            $("#city").append("<option  value='" + data[m].code + "'>" + data[m].name + "</option>");
                        }
                        form.render("select");
                    } else {
                        layer.msg(res.msg, {
                            time: 1000
                        });
                    }
                    var obj = document.getElementById("city");
                    for (var i = 0; i < obj.length; i++) {
                        if (code == obj[i].value) {
                            obj[i].selected = true;
                        }
                    }

                }
            });
        }

        $("#province").change(function () {
            var cityCode=$("#province option:selected").val();
            //查找区
            province(cityCode,null);

        })
        //保存
        $("#save").click(function(){
            $("#save").attr("disabled", 'disabled');
            setTimeout(function(){
                $("#save").attr("disabled", false);
            }, 2000);
            var loading = layer.load(2);
            var data = {
                "id": $("input[name='id']").val(),
                "houseName": $("input[name='houseName']").val(),
                "lon": $("input[name='lon']").val(),
                "lat": $("input[name='lat']").val(),
                "parentCode": $("#province option:selected").val(),
                "areaCode":$("#city option:selected").val()
            };
            if(data.houseName==""){
                msg("请填写小区名称");
                layer.close(loading);
                return false;
            }
            // if(data.parentCode==0 || data.areaCode==0){
            //     msg("请选择城市");
            //     layer.close(loading);
            //     return false;
            // }
            // if(data.lon=="" || data.lat==""){
            //     msg("请填写经纬度");
            //     layer.close(loading);
            //     return false;
            // }
            data = JSON.stringify(data);
            $.post({
                url: url + "/api/house/saveHouse",
                data: data,
                dataType: "json",
                contentType: 'application/json;charset=UTF-8',
                success: function(res) {
                    if(res.code == 0) {
                        layer.msg('操作成功', {
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
    })
    function msg(msg) {
        layer.msg(msg, {
            time: 1000
        });
    }
})


