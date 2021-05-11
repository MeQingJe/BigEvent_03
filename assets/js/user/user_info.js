$(function() {
    // 用户昵称的校验规则
    let form = layui.form;
    let layer = layui.layer;
    form.verify({
        nickname: function(value) { //value：表单的值、item：表单的DOM对象
            if (value.length > 6) return '昵称长度必须在 1 - 6 个字符之间！';
        }
    });
    // 获取用户信息并渲染
    initUserInfo();

    function initUserInfo() {
        $.ajax({
            url: '/my/userinfo',
            success: function(res) {
                if (res.status != 0) return layer.msg(res.message);
                form.val('get_userinfo', res.data);
            }
        });
    };
    // 重置按钮功能
    $('#reset').click(function(e) {
        e.preventDefault();
        initUserInfo();
    });
    // 更新用户信息并渲染
    $('#formUserInfo').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status != 0) return layer.msg(res.message);
                layer.msg(res.message);
                initUserInfo();
                window.parent.getUserInfo();
            }
        });
    })
});