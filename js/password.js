$(function() {
	layui.use(['element', 'table', 'form', 'laydate', 'layer', 'laypage'], function() {
		var layer = layui.layer;
		var userId = sessionStorage.getItem("userId");
		$("#change").click(function() {
			var passwordok = $("input[name='passwordok']").val()
			var newpassword = $("input[name='newpassword']").val()
			if(passwordok === newpassword){
				var data = {
					"id": userId,
					"password": $("input[name='passwordok']").val()
				};
				data = JSON.stringify(data);
				$.post({
					url: url + "/api/admin/updatePassword",
					dataType: "json",
					data: data,
					contentType: 'application/json;charset=UTF-8',
					success: function(res) {
						if(res.code == 0) {
							layer.msg('修改成功', {
								time: 1000
							});
							setTimeout(
							function(){
							/*var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
							parent.layer.close(index);*/
							window.parent.location= 'login.html'
							sessionStorage.clear();
							}, 1000);
						} else {
							layer.msg(res.msg, {
								time: 1000
							});
						}
					}
				});
			}else{
				layer.msg('两次输入密码不一致', {
					time: 1000
				});
			}
			
		})

	});
});