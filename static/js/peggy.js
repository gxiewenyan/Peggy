var peggy = {
    ajax: function(opt){
        var ajaxOpt = $.extend({
            type: 'get',
            dataType: 'json'
        }, opt);

        $.ajax({
            url: opt.url,
            type: opt.type,
            dataType: opt.dataType,
            data: opt.data,
            success: function(data){
                if(data.status == 200){
                    if(opt.success && $.isFunction(opt.success)){
                        opt.success(data);
                    }
                }
            },
            error: function(){
                alert('出错了...');
            }
        });
    }
};