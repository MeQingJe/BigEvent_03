$(function() {
    // 0.时间过滤
    template.defaults.imports.dateFormat = function(dt) {
        let newDt = new Date(dt);
        let y = newDt.getFullYear();
        let m = padZero(newDt.getMonth() + 1);
        let d = padZero(newDt.getDate());
        let hh = padZero(newDt.getHours());
        let mm = padZero(newDt.getMinutes());
        let ss = padZero(newDt.getSeconds());
        return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
    };

    function padZero(n) {
        return n > 10 ? n : '0' + n;
    };
    // 1.定义查询参数（过滤和分页都要用）
    let layer = layui.layer;
    let form = layui.form;
    let q = {
        pagenum: 1, //是 int 页码值
        pagesize: 10, //是 int 每页显示多少条数据
        cate_id: '', //否 string 文章分类的 Id
        state: '', //否 string 文章的状态， 可选值有： 已发布、 草稿
    };
    // 2.获取文章列表
    initTable();

    function initTable() {
        $.ajax({
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status != 0) return layer.msg(res.message);
                let str = template('art-list', res);
                $('tbody').empty().html(str);
                renderPage(res.total);
            }
        });
    };
    // 3.初始化文章分类
    initCate();

    function initCate() {
        $.ajax({
            url: '/my/article/cates',
            success: function(res) {
                // console.log(res);
                if (res.status != 0) return layer.msg(res.message);
                let str = template('tpl-cate', res);
                $('[name=cate_id]').html(str);
                form.render();
            }
        });
    };
    // 4.筛选
    $('#form-search').on('submit', function(e) {
        e.preventDefault();
        let cate_id = $('[name=cate_id]').val();
        let state = $('[name=state]').val();
        q.cate_id = cate_id;
        q.state = state;
        initTable();
    });
    //5.分页
    function renderPage(total) {
        let laypage = layui.laypage;
        laypage.render({
            elem: 'pageBox', //注意，这里的pageBox是ID，不用加#号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize,
            //自定义排版
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10, 20],
            curr: q.pagenum,
            jump: function(obj, first) {
                q.pagenum = obj.curr;
                q.pagesize = obj.limit;
                //首次不执行
                if (!first) {
                    initTable();
                };
            }
        });
    };
    // 6.删除
    $('tbody').on('click', '.btn_del', function() {
        let Id = $(this).attr('data-id');
        layer.confirm('确认删除吗?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                url: '/my/article/delete/' + Id,
                success: function(res) {
                    if (res.status != 0) return layer.msg(res.message);
                    if ($('.btn_del').length == 1 && q.pagenum > 1) q.pagenum--;
                    initTable();
                    layer.msg('删除成功！');
                }
            });
            layer.close(index);
        });
    })
});