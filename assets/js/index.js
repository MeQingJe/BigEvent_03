$(function() {
    let layer = layui.layer;
    // 获取用户信息
    getUserInfo();
    // 退出登陆
    $('#btnLogOut').on('click', function() {
        layer.confirm('您确定要退出吗?', { icon: 3, title: '提示' }, function(index) {
            localStorage.removeItem('token');
            location.href = '/login.html';
            layer.close(index);
        });
    });
});

function getUserInfo() {
    $.ajax({
        url: '/my/userinfo',
        success: function(res) {
            if (res.status != 0) return layer.msg(res.message);
            // 获取头像信息并渲染
            renderAvatar(res.data);
        }
    });
};

function renderAvatar(Avatar) {
    // 渲染昵称
    let name = Avatar.nickname || Avatar.username;
    $('#welcome').html('欢迎&emsp;' + name);
    // 渲染用户头像
    if (Avatar.user_pic) {
        $('.userinfo img').show().attr('src', Avatar.user_pic);
        $('.text-avatar').hide();
    } else {
        let text = name[0].toUpperCase();
        $('.userinfo img').hide();
        $('.text-avatar').show().html(text);
    };
};