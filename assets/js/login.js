$(function() {
    $('#link_reg').on('click', function() {
        $('.login_box').hide();
        $('.reg_box').show();
    });
    $('#link_login').on('click', function() {
        $('.login_box').show();
        $('.reg_box').hide();
    });

    let form = layui.form;
    form.verify({
        pwd: [/^[\S]{6,16}$/, '密码必须6到16位，且不能出现空格'],
        repwd: function(value) {
            if (value != $('.reg_box input[name = password]').val())
                return '两次输入的密码不一致！';
        }
    });

    $('#form_reg').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/api/reguser',
            data: {
                username: $('.reg_box input[name = username]').val(),
                password: $('.reg_box input[name = password]').val(),
            },
            success: function(res) {
                if (res.status != 0) return layer.msg(res.message, { icon: 5 });
                layer.msg(res.message, { icon: 6 });
                $('.reg_box input').val('');
                $('#link_login').click();
            }
        });
    });

    $('#form_login').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/api/login',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status != 0) return layer.msg(res.message, { icon: 5 });
                layer.msg(res.message, { icon: 6 });
                localStorage.setItem('token', res.token);
                location.href = '/index.html';
            }
        });
    });
});