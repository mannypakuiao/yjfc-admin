$(function(){
    layui.use(['element', 'table', 'form', 'laydate', 'layer', 'laypage'], function () {
    $("#save").click(function () {
    var options = {
        url:url + "/api/broker/saveBroker",
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
    })
    var obj=sessionStorage.getItem("content");
    if(obj==null || obj==""){
        return false;
    }else{
        var json=JSON.parse(obj);
        $("#id").val(json.id);
        $("#name").val(json.name);
        $("#phone").val(json.phone);
        $("#mingyan").val(json.mingyan);
    }
})
})
