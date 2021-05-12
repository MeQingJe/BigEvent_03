$(function() {
    let form = layui.form;
    let layer = layui.layer;
    initArtCateList();

    function initArtCateList() {
        $.ajax({
            url: '/my/article/cates',
            success: function(res) {
                // console.log(res);
                if (res.status != 0) return layer.msg(res.message);
                let str = template('pl-art-cate', res);
                $('tbody').empty().html(str);
            }
        });
    };

    let indexAdd;
    $('#btnAdd').on('click', function() {
        indexAdd = layer.open({
            type: 1,
            title: '添加文章分类',
            area: ['500px', '260px'],
            content: $('#dialog-add').html(),
        });
    });

    // 添加分类
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status != 0) return layer.msg(res.message);
                layer.msg('添加类别成功！');
                layer.close(indexAdd);
                initArtCateList();
            }
        });
    });

    // 编辑功能
    let indexEdit;
    $('tbody').on('click', '.btn_edit', function() {
        indexEdit = layer.open({
            type: 1,
            title: '修改文章分类',
            area: ['500px', '260px'],
            content: $('#dialog-edit').html()
        });
        let Id = $(this).attr('data-id');
        $.ajax({
            url: '/my/article/cates/' + Id,
            success: function(res) {
                if (res.status != 0) return layer.msg(res.message);
                form.val('form-edit', res.data);
            }
        });
    });
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status != 0) return layer.msg(res.message);
                layer.msg('修改类别成功！');
                layer.close(indexEdit);
                initArtCateList();
            }
        });
    });

    // 删除功能
    $('tbody').on('click', '.btn_del', function() {
        let Id = $(this).attr('data-id');
        layer.confirm('确认删除吗?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                url: '/my/article/deletecate/' + Id,
                success: function(res) {
                    if (res.status != 0) return layer.msg(res.message);
                    layer.msg('删除成功！');
                    initArtCateList();
                }
            });
            layer.close(index);
        });
    });
});