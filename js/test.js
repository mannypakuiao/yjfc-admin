
$(function() {
    layui.use(['form', 'element', "table", 'layer', 'laydate'], function() {
        var layer = layui.layer;
        var laydate = layui.laydate;
        var pageNo = 1;//当前页
        var totalPage = 0;//总页数
        laydate.render({
            elem: '#dateAll',
            range: true
        });

        $.get({
            url: "http://127.0.0.1:8111/api/test/getImgs",
            success: function (res) {
                console.log(res)
                if(res.code=="0"){
                    var imgs=res.data;
                    if(imgs!=""){
                        var img=imgs.split(",");
                        for(var i=0;i<img.length;i++){

                            var str="<img class='ig' src='"+img[i]+"' class='lazy' style='width:120px; height:120px;padding:10px'>"
                            str+=" <img  src='../images/del.png'  class='del' style='width:20px;'/>";
                            $("#imgs").append(str)
                        }
                    }
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
        })

       

        var options = {
            url:"http://127.0.0.1:8111/api/test/saveImg",
            type:"POST",
            success: function (res) {
                if(res.code=="0"){
                    alert("保存成功")
                }else {
                    alert("保存失败")
                }
            }
        };
        $("#form").ajaxForm(options);


    });


});

