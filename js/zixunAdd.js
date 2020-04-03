//JavaScript代码区域
$(function() {
    layui.use(['form', 'element', "table", 'layer', 'laydate'], function() {
        var layer = layui.layer;


        $("#save").click(function () {
            var content=document.getElementById('content').innerHTML;
            var data={
                "id":$("#id").val(),
                "title":$("#title").val(),
                "content":content
            }
            console.log(data)
            var loading = layer.load(2);
            data = JSON.stringify(data);
            $.post({
                url: url + "/api/news/saveNews",
                data: data,
                dataType: "json",
                contentType: 'application/json;charset=UTF-8',
                success: function(res) {
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
            });
            layer.close(loading);
        })
        var loading = layer.load(2);
        var id=sessionStorage.getItem("id");
        $.get({
            url: url + "/api/news/getNewsById/"+id,
            contentType: 'application/json;charset=UTF-8',
            success: function(res) {

                $("#id").val(res.data.id);
                $("#title").val(res.data.title);
                document.getElementById('content').innerHTML=res.data.content;
            }
        });
        layer.close(loading);

    });


});