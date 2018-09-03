var peggy = {
    ajax: function(opt){
        var ajaxOpt = $.extend({
            method: 'GET',
            dataType: 'json'
        }, opt);

        $.ajax({
            url: ajaxOpt.url,
            method: ajaxOpt.method,
            dataType: ajaxOpt.dataType,
            data: ajaxOpt.data,
            success: function(data){
                if(data.status == 200){
                    if(ajaxOpt.success && $.isFunction(ajaxOpt.success)){
                        ajaxOpt.success(data);
                    }
                }else {
                    alert(data.msg);

                    if(data.status == 401) {
                        location.href = '/p/login';
                    }
                }
            },
            error: function(){
                alert('出错了...');
            },
            beforeSend: function(xhr) {
                var token = sessionStorage.getItem('token');
                xhr.setRequestHeader("Authorization", token);
            }
        });
    }
};