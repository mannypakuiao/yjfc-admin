$(function () {
    layui.use(['element', 'table', 'form', 'laydate', 'layer', 'laypage'], function () {
        var form = layui.form;
        //委托出售 0平台发布 1委托
        $("#releaseType").change(function () {
            var releaseType=$("#releaseType option:selected").val();
            if(releaseType==0){
                $("#query").hide(),
                $("#release").hide()
            }
            if(releaseType==1){
                $("#query").show()
            }
        })
        //房屋类型
        $("#type").change(function () {
            var type=$("#type option:selected").val();
            if(type==0||type==1||type==2){
                $("#xiaoqu").show(),
                $("#huxing").show()
            }
            if(type==3||type==4||type==5){
                $("#xiaoqu").hide(),
                $("#huxing").hide()
            }
            if(type==2){
                $("#divprice").hide()
            }else {
                $("#divprice").show()
            }
        })
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
                        $("#city").children().remove();
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
                    layer.close(loading);

                }
            });
        }

        $("#province").change(function () {
            var cityCode=$("#province option:selected").val();
            if(cityCode==0){
                $("#city").children().remove();
                $("#city").append("<option  value='0'>请选择区/县</option>");
                return false;
            }
            //查找区
            province(cityCode,null);

        })
        //查询委托人
        $("#findRelease").click(function () {
            var data = {
                "phone":$("#weituo").val()
            };
            if(data.phone==""){
                layer.msg("请输入手机号或昵称", {
                    time: 1000
                });
                return false;
            }
            var loading = layer.load(2);
            data = JSON.stringify(data);
            $.post({
                url: url + "/api/build/getReleaseList",
                data:data,
                dataType: "json",
                contentType: 'application/json;charset=UTF-8',
                success: function (res) {
                    $("#releaseTable tbody tr").remove();
                    if (res.code == 0) {
                        var content = res.data;
                        if (content.length > 0) {
                            $("#release").show();
                            for (var i = 0; i < content.length; i++) {
                                var tr = "<tr>" +
                                    "<th style='text-align: center;width: 50px' ><input name='rcheckbox' type='radio'  value='" + content[i].id + "' /></th>" +
                                    "<td style='text-align: center' class='nickName'>" + content[i].nickName + "</td>" +
                                    "<td style='text-align: center' class='phone'>" + content[i].phone + "</td>" +
                                    "</tr>";
                                $("#releaseTable tbody").append(tr);
                            }
                            form.render();
                        } else {
                            $("#release").hide();
                            layer.msg("未查询到委托人", {
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
        })


     //查询经纪人
        $("#findUser").click(function () {

            var data = {
                "phone":$("#jingjiren").val()
            };
            data = JSON.stringify(data);
            var loading = layer.load(2);
            $.post({
                url: url + "/api/build/buildingBrokerList",
                data:data,
                dataType: "json",
                contentType: 'application/json;charset=UTF-8',
                success: function (res) {

                    $("#userTable tbody tr").remove();
                    if (res.code == 0) {
                        var content = res.data;
                        if (content.length > 0) {
                            $("#sys").show();
                            // $("#userTable tbody").empty();
                            for (var i = 0; i < content.length; i++) {
                                var tr = "<tr>" +
                                    "<th style='text-align: center;width: 50px' ><input name='checkbox' style='display: none' type='checkbox' value='" + content[i].id + "' /></th>" +
                                    "<td style='text-align: center' class='name'>" + content[i].name + "</td>" +
                                    "<td style='text-align: center' class='phone'>" + content[i].phone + "</td>" +
                                    "</tr>";
                                $("#userTable tbody").append(tr);
                            }

                        } else {
                            $("#sys").hide();
                            layer.msg("未查询到经纪人", {
                                time: 1000
                            });
                        }
                        form.render();
                    } else {
                        layer.msg(res.msg, {
                            time: 1000
                        });
                    }
                    layer.close(loading);
                }
            });
        })

        //查找房屋所属小区
        var loading = layer.load(2);
        $.post({
            url: url + "/api/build/buildingsHouseList",
            dataType: "json",
            contentType: 'application/json;charset=UTF-8',
            success: function (res) {
                if (res.code == 0) {
                    var data = res.data;
                    $("#oldHouseId").append("<option  value='0'>请选择小区</option>");
                    for (var m in data) {
                        $("#oldHouseId").append("<option  value='" + data[m].id + "'>" + data[m].houseName + "</option>");
                    }
                    var obj = document.getElementById("oldHouseId");
                    for (var i = 0; i < obj.length; i++) {
                        if (oldHouseId == obj[i].value) {
                            obj[i].selected = true;
                        }
                    }
                } else {
                    layer.msg(res.msg, {
                        time: 1000
                    });
                }
                layer.close(loading);
            }
        });

    //保存
        $("#save").click(function () {
            var oldHouseId=$("#oldHouseId option:selected").val();
            var houseName=$("#oldHouseId option:selected").text();
            $("#houseId").val(oldHouseId);
            $("#houseName").val(houseName);
            var province=$("#province option:selected").val();
            var city=$("#city option:selected").val();
            $("#areaCode").val(city);
            $("#cityCode").val(province);
            var title=$("#title").val();
            var layout=$("#layout").val();
            var housingArea=$("#housingArea").val();
            var money=$("#money").val();
            var lon=$("#lon").val();
            var lat=$("#lat").val();
            var type=$("#type option:selected").val();
            var mode=$("#mode option:selected").val();
            var oldHouseId=$("#oldHouseId option:selected").val();
            var customerName=$("#customerName").val();
            var phoneNumber=$("#phoneNumber").val();
            var unitNumber=$("#unitNumber").val();
            if(type==""){
                msg("请选择房屋类型");
                return false;
            }
            if(mode==""){
                msg("请选择交易类型");
                return false;
            }
            if(title==""){
                msg("请填写标题");
                return false;
            }
            if((type==0 || type==1 || type==2) && oldHouseId==0){
                msg("请选择小区");
                return false;
            }
            //经纪人ID
            var arr =[];
            $('input[name="checkbox"]:checked').each(function(){
                arr.push($(this).val());
            });
            if(arr.length==0){
                layer.msg("请选择经纪人", {
                    time: 1000
                });
                return false;
            }
            ids=arr.toString();
            $("#ids").val(ids)
            if((type==0 || type==1 || type==2) && layout==""){
                msg("请填写户型");
                return false;
            }
            if(housingArea==""){
                msg("请填写面积");
                return false;
            }
            if(money==""){
                msg("请填写售价");
                return false;
            }
            if(lon=="" || lat=="" ){
                msg("请填写经纬度");
                return false;
            }
            var longrg =  /^-?(((\d|[1-9]\d|1[0-7]\d|0)\.\d{0,10})|(\d|[1-9]\d|1[0-7]\d|0{1,3})|180\.0{0,10}|180)$/i;
            if(!longrg.test(lon)){
                msg("经度不合法");
                return false;
            }
            var latreg =  /^-?([0-8]?\d{1}\.\d{0,10}|90\.0{0,10}|[0-8]?\d{1}|90)$/i;
            if(!latreg.test(lat)) {
                msg("纬度不合法");
                return false;
            }
            var arr =[];
            $('input[name="checkbox2"]:checked').each(function(){
                arr.push($(this).val());
            });
            var releaseType=$("#releaseType option:selected").val();
            if(releaseType==1 && arr.length==0){
                layer.msg("请选择委托人", {
                    time: 1000
                });
                return false;
            }
            rids=arr.toString();
            $("#userId").val(rids)

            var loading = layer.load(2);
            var options = {
                url: url + "/api/build/saveBuildings",
                type: 'POST',
                success: function (res) {
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
                }
            };
            $("#regform").ajaxForm(options);
        })



    //修改文本框赋值
        var id = sessionStorage.getItem("id");
        if (id == null || id == "") {
            return false;
        } else {
            var loading = layer.load(2);
            $.get({
                url: url + "/api/build/getBuildingsById/"+id,
                dataType: "json",
                contentType: 'application/json;charset=UTF-8',
                success: function (res) {
                    console.log(res)
                    var json=res.data.buildings;
                    $("#id").val(json.id);
                    $("#layout").val(json.layout);
                    $("#title").val(json.title);
                    $("#housingArea").val(json.housingArea);
                    $("#orientation").val(json.orientation);
                    $("#money").val(json.money);
                    $("#lon").val(json.lon);
                    $("#lat").val(json.lat);
                    $("#imgUrl").val(json.img);
                    $("#niandai").val(json.niandai);
                    $("#zhaungxiu").val(json.zhaungxiu);
                    $("#dianti").val(json.dianti);
                    $("#louceng").val(json.louceng);
                    $("#content").val(json.content);
                    $("#price").val(json.price);

                    $("#fangchan").val(json.fangchan);
                    $("#fanghao").val(json.fanghao);
                    $("#nianxian").val(json.nianxian);
                    $("#weiyi").val(json.weiyi);
                    $("#customerName").val(json.customerName);
                    $("#phoneNumber").val(json.phoneNumber);
                    $("#unitNumber").val(json.unitNumber);
                    if(json.type==2){
                        $("#divprice").hide()
                    }else {
                        $("#divprice").show()
                    }
                    //经纪人
                    var brokerList=res.data.brokerList;
                    for (var i = 0; i < brokerList.length; i++) {
                        var tr = "<tr>" +
                            "<th style='text-align: center;width: 50px' ><input name='checkbox' style='display: none' type='checkbox' checked value='" + brokerList[i].id + "' /></th>" +
                            "<td style='text-align: center' class='name'>" + brokerList[i].name + "</td>" +
                            "<td style='text-align: center' class='phone'>" + brokerList[i].phone + "</td>" +
                            "</tr>";
                        $("#userTable tbody").append(tr);
                        $("#sys").show();
                        form.render();
                    }
                    //委托人
                    var user=res.data.user;
                    if(user!=null){
                        var tr = "<tr>" +
                            "<th style='text-align: center;width: 50px' ><input name='checkbox2' style='display: none' type='radio' checked value='" + user.id + "' /></th>" +
                            "<td style='text-align: center' class='nickName'>" + user.nickName + "</td>" +
                            "<td style='text-align: center' class='phone'>" + user.phone + "</td>" +
                            "</tr>";
                        $("#releaseTable tbody").append(tr);
                        $("#release").show();
                        form.render();
                    }
                    //区域
                    var obj = document.getElementById("province");
                    for (var i = 0; i < obj.length; i++) {
                        if (json.cityCode == obj[i].value) {
                            obj[i].selected = true;
                            province(json.cityCode,json.areaCode)
                        }
                    }

                    var obj = document.getElementById("mode");
                    for (var i = 0; i < obj.length; i++) {
                        if (json.mode == obj[i].value) {
                            obj[i].selected = true;
                        }
                    }
                    var obj = document.getElementById("releaseType");
                    for (var i = 0; i < obj.length; i++) {
                        if (json.releaseType == obj[i].value) {
                            obj[i].selected = true;
                        }
                    }
                    if(json.releaseType==1){
                        $("#query").show();
                        $("#release").show();
                    }
                    oldHouseId = json.houseId;
                    var obj = document.getElementById("oldHouseId");
                    for (var i = 0; i < obj.length; i++) {
                        if (json.houseId == obj[i].value) {
                            obj[i].selected = true;
                        }
                    }

                    var obj = document.getElementById("type");
                    for (var i = 0; i < obj.length; i++) {
                        if (json.type == obj[i].value) {
                            obj[i].selected = true;
                        }
                    }

                    if (json.mainImg != null && json.mainImg !="") {
                        var str = "<img  src='" +url+ json.mainImg + "' class='lazy' style='width:120px; height:120px;padding:10px'>"
                        $("#mainImg").append(str)
                    }

                    if (json.img != null && json.img !="") {
                        var img = json.img.split(",");
                        for (var i = 0; i < img.length; i++) {
                            var str = "<img class='ig' src='" + url+img[i] + "' class='lazy' style='width:150px; height:100px;padding:10px'>"
                            str += " <img  src='../../images/del.png'  class='del' style='width:20px;'/>";
                            $("#imgs").append(str)
                        }
                        $(".del").click(function () {
                            $(this).prev().remove();
                            $(this).remove("");

                            var imgUrl = "";
                            $(".ig").each(function (r) {
                                var url = $(this).attr("src");
                                imgUrl += url + ",";
                            });
                            $("#imgUrl").val(imgUrl);
                        })
                    }
                }
            });
            layer.close(loading);
        }
    })

    function msg(msg) {
        layer.msg(msg, {
            time: 1000
        });
    }
})
