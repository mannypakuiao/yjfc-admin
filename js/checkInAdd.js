$(function(){
    layui.use(['form', 'element', "table", 'layer', 'laydate'], function() {
        var layer = layui.layer;
        var laydate = layui.laydate;
        laydate.render({
            elem: '#checkInTime',
            type: 'date'
        });
//保存
$("#save").click(function(){
    $("#save").attr("disabled", 'disabled');
    setTimeout(function(){
        $("#save").attr("disabled", false);
    }, 2000);
    var loading = layer.load(2);
    var data = {
        "id": $("input[name='id']").val(),
        "checkInOrNot": $("#checkInOrNot option:selected").val(),
        "dealMoney": $("input[name='dealMoney']").val(),
        "userName": $("input[name='userName']").val(),
        "userPhone": $("input[name='userPhone']").val(),
        "checkInTime": $("#checkInTime").val()
    };
    data = JSON.stringify(data);
    $.post({
        url: url + "/api/build/saveCheckIn",
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
var obj = sessionStorage.getItem("content");
if (obj == null || obj == "") {
    return false;
} else {
    var json = JSON.parse(obj);
    $("#id").val(json.id);
    $("#checkInOrNot").val(json.checkInOrNot);
    $("#dealMoney").val(json.dealMoney);
    $("#userName").val(json.userName);
    $("#userPhone").val(json.userPhone);
    $("#checkInTime").val(formatDate(json.checkInTime));
}
    })
})