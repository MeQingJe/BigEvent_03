$(function() {
    initForm();

    function initForm() {
        // console.log(location.search);
        let Id = location.search.split('=')[1];
        $.ajax({
            url: '/my/article/' + Id,
            success: function(res) {
                if (res.status != 0) return layer.msg(res.message);
                form.val('form_edit', res.data);
                setTimeout(function() {
                    tinyMCE.activeEditor.setContent(res.data.content);
                }, 120);
                if (!res.data.cover_img) return layer.msg('用户未上传封面！');
                let newImgURL = baseUrl + res.data.cover_img;
                $image
                    .cropper('destroy') // 销毁旧的裁剪区域
                    .attr('src', newImgURL) // 重新设置图片路径
                    .cropper(options) // 重新初始化裁剪区域
            }
        });
    };

    // 初始化富文本域
    initEditor();

    // 初始化图片裁剪区域
    let $image = $('#image');
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview',
    };
    // 1.3 创建裁剪区域
    $image.cropper(options);


    // 获取文章分类
    let layer = layui.layer;
    let form = layui.form;
    initCate();

    function initCate() {
        $.ajax({
            url: '/my/article/cates',
            success: function(res) {
                if (res.status != 0) return layer.msg(res.message);
                let str = template('tpl-select', res);
                $('[name=cate_id]').html(str);
                form.render();
            }
        });
    };

    // 渲染图片
    $('#btnChooseImage').click(function() {
        $('#coverFile').click();
    });
    $('#coverFile').change(function(e) {
        let file = e.target.files[0];
        if (file == undefined) return layer.msg('请至少选择一张图片');
        let newImgURL = URL.createObjectURL(file);
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    });

    // 收集状态
    let state = '草稿';
    $('#btnSave1').click(function() {
        state = '已发布';
    });

    $('#form_pub').submit(function(e) {
        e.preventDefault();
        let fd = new FormData(this);
        // fd中只拿到了需求中的3/5 需要添加两个状态 
        fd.append('state', state);
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 添加最后一个属性，二进制文件
                fd.append('cover_img', blob);
                // console.log(...fd);
                //发布文章
                articlePublish(fd);
            });
    });

    function articlePublish(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status != 0) return layer.msg(res.message);
                layer.msg('发布文章成功！');
                // 解决bug (左侧列表不会跟着跳转，不弹出成功发布的提示)
                setTimeout(function() {
                    window.parent.document.getElementById('art_list').click();
                }, 1500);
            }
        });
    };
});