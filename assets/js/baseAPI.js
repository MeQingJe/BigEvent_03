let baseUrl = 'http://api-breakingnews-web.itheima.net';

$.ajaxPrefilter(function(params) {
    params.url = baseUrl + params.url;
    if (params.url.indexOf('/my/') >= 0) {
        params.headers = {
            Authorization: localStorage.getItem('token') || '',
        };
    };

    // 登录拦截
    params.complete = function(res) {
        let obj = res.responseJSON;
        if (obj.message == "身份认证失败！") {
            localStorage.removeItem('token');
            location.href = '/login.html';
        };
    };
});