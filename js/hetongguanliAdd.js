$(function(){
    layui.use(['element', 'table', 'form', 'laydate', 'layer', 'laypage'], function () {
        var layer = layui.layer;
        var form = layui.form;
        var options = {
            url:url + "/api/contract/saveContract",
            type:'POST',
            success: function (res) {
                if(res.code=="0"){
                    layer.msg('保存成功', {
                        time: 1000
                    });
                    setTimeout(function () {
                        var index = parent.layer.getFrameIndex(window.name);
                        parent.layer.close(index);
                    }, 1000);
                }else {
                    layer.msg('保存失败', {
                        time: 1000
                    });
                }
            }
        };
        $("#regform").ajaxForm(options);

        //查询客户
        $("#findUser").click(function () {
            var data = {
                "phone":$("#kehu").val()
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
                    console.log(res)
                    $("#sys tbody tr").remove();
                    if (res.code == 0) {
                        var content = res.data;
                        if (content.length > 0) {
                            $("#sys").show();
                            for (var i = 0; i < content.length; i++) {
                                var tr = "<tr>" +
                                    "<th style='text-align: center;width: 50px' ><input name='rcheckbox' style='display: none' type='radio'  value='" + content[i].id + "' /></th>" +
                                    "<td style='text-align: center' class='nickName'>" + content[i].nickName + "</td>" +
                                    "<td style='text-align: center' class='phone'>" + content[i].phone + "</td>" +
                                    "</tr>";
                                $("#sys tbody").append(tr);
                            }
                        } else {
                            // $("#release").hide();
                            layer.msg("未查询到委托人", {
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

    var obj=sessionStorage.getItem("content");
    if(obj==null || obj==""){
        return false;
    }else{
        var json=JSON.parse(obj);
        $("#id").val(json.id);
        $("#title").val(json.title);
        $("#contractCoding").val(json.contractCoding);
        $("#phone").val(json.phone);
        $("#name").val(json.name);
        $("#imgUrl").val(json.contractImg);
        if(json.contractImg!=null){
            var img=json.contractImg.split(",");
            for(var i=0;i<img.length;i++){
                var str="<img class='ig' src='"+img[i]+"' class='lazy' style='width:120px; height:120px;padding:10px'>"
                str+=" <img  src='../../images/del.png'  class='del' style='width:20px;'/>";
                $("#imgs").append(str)
            }
            $(".del").click(function(){
                $(this).prev().remove();
                $(this).remove("");

                var imgUrl="";
                $(".ig").each(function(r){
                    var url=$(this).attr("src");
                    imgUrl+=url+",";
                });
                $("#imgUrl").val(imgUrl);
            })
        }
    }
    })
})
