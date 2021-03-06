var rootPath = getRootPath();
/**
 *
 * @param target 表单对象
 * @param targetelemnet 表单元素对象
 * @param tipmsg 提示信息
 */
function appendvalid(target, targetelemnet, tipmsg) {
    var tipdiv = $('<div  id="toast-container" class="toast-top-full-width" aria-live="polite" style="display: none">' +
        '<div  class="toast toast-info toastdiv" style="opacity: 0.866;">');
    targetelemnet = $(targetelemnet);
    if ($('.toastdiv').length <= 0) {
        target.append(tipdiv);
    }

    $('.toastdiv').append('<div class="toast-message">' + tipmsg + '</div>');
    $('.toastdiv').parent('.toast-top-full-width').show('slow');
    setTimeout(function () {
        $('.toastdiv').html("").parent('.toast-top-full-width').hide('slow');
    }, 3000)
}
/**
 * 验证表单
 * @param roleSelector 表单对象
 * @returns {boolean}
 */
function validform(roleSelector) {
    var target = $(roleSelector);
    var alltxt = target.serializeArray();//获取所有的子元素
    var flag = true;
    for (var i = 0; i < alltxt.length; i++) {
        var targetinput = $('input[name=' + '"' + alltxt[i].name + '"' + ']');
        var targetselect = $('select[name=' + '"' + alltxt[i].name + '"' + ']');

        if (target != undefined) {
            if (targetinput.attr("requierd") == "yes" && targetinput.val() == "") {
                appendvalid(target, targetinput, targetinput.attr('tip'));
                flag = false;

            }
            if (targetinput.attr('regix') != "" && targetinput.attr('regex') != undefined && targetinput.val() != "") {
                var regexp = targetinput.attr('regex');
                var regexptip = targetinput.attr('regextip');
                var re = new RegExp(regexp);
                var txt = targetinput.val();
                if (!re.test(txt)) {
                    appendvalid(target, targetinput, regexptip);
                    flag = false;
                }
            }
        }
        if (targetselect != undefined) {
            if (targetselect.attr("requierd") == "yes" && targetselect.val() == "") {
                appendvalid(target, targetselect,targetselect.attr('tip'));
                flag = false;
            }
        }
    }
    return flag;
}


//获取请求参数
function getQueryParamValue(key) {
    var uri = window.location.search;
    var reg = new RegExp("" + key + "=([^&?]*)", "ig");
    return (uri.match(reg)) ? (uri.match(reg)[0].substr(key.length + 1)) : null;
}

//空值转换
function emptyValConvert(val) {
    if (val != undefined && val != '') {
        return val;
    } else {
        return '';
    }
}

//配置值替换
function packageValReplace(val) {
    if (val == '有') {
        return '●';
    } else if (val == '无') {
        return '-';
    } else if (val == '选配') {
        return '○';
    } else {
        return emptyValConvert(val);
    }

}
function getcookie(objname){//获取指定名称的cookie的值
    var arrstr = document.cookie.split("; ");
    for(var i = 0;i < arrstr.length;i ++){
        var temp = arrstr[i].split("=");
        if(temp[0] == objname) return unescape(temp[1]);
    }
}
function getRootPath(){
    var currentPath = window.document.location.href;
    var pathName = window.document.location.pathname;
    var pos = currentPath.indexOf(pathName);
    var localhostPaht = currentPath.substring(0,pos);
    return (localhostPaht);
    // return (localhostPaht );
}
var myAjax = {
    myRequest : function(murl, mdata, method, isAsync, success, error, mtimeout) {
        mdata = urlEncode(mdata);
        $.ajax({
            url: murl.indexOf("?")!=-1 ? murl + "&randomNum=" + parseInt(10000 * Math.random()) + mdata : murl + "?randomNum=" + parseInt(10000 * Math.random()) + mdata,
            dataType : "json",
            type: method || "POST",
            async: isAsync || false,
            timeout: mtimeout || 100000,
            contentType:"application/json",
            // headers:{'Cookie':document.cookie},
            success: function (data) {
                // hideLoadding();
                success ? success(data):function(){};
            },
            error: function (data) {
                error ? error(data):function(){
                    toastrErrorMessage("请求失败,请联系系统管理员");
                };
            },
            beforeSend: function(){
                showLoadding();
            },
            complete : function(XMLHttpRequest,textStatus){
                hideLoadding();
                if(textStatus == 'timeout'){
                    toastrErrorMessage("请求超时,请检查网络设置");
                } else if(textStatus == 'error'){
                    toastrErrorMessage("请求异常,请联系系统管理员");
                }
            }
        });
    },

    myRequestNotLoadding : function(murl, mdata, method, isAsync, success, error, mtimeout, notLoadding) {
        mdata = urlEncode(mdata);
        $.extend(mdata,mdata,{"openid":localStorage.openid});
        $.ajax({
            url: murl.indexOf("?")!=-1 ? murl + "&randomNum=" + parseInt(10000 * Math.random()) + mdata : murl + "?randomNum=" + parseInt(10000 * Math.random()) + mdata,
            dataType : "json",
            type: method || "POST",
            async: isAsync || false,
            timeout: mtimeout || 10000,
            contentType:"application/json",
            // headers:{'Cookie':document.cookie},
            success: function (data) {
                success ? success(data):function(){};
            },
            error: function (data) {
                error ? error(data):function(){
                    toastrErrorMessage("请求失败,请联系系统管理员");
                };
            },
            beforeSend: function(){

            },
            complete : function(XMLHttpRequest,textStatus){
                if(textStatus == 'timeout'){
                    toastrErrorMessage("请求超时,请检查网络设置");
                } else if(textStatus == 'error'){
                    toastrErrorMessage("请求异常,请联系系统管理员");
                }
            }
        });
    },
    myFileRequest : function(murl, mdata, method, isAsync, success, error, mtimeout, mformId) {
        var formData = new FormData($("#" + mformId));
        $.ajax({
            url: murl.indexOf("?")!=-1 ? murl + "&randomNum=" + parseInt(10000 * Math.random()) : murl + "?randomNum=" + parseInt(10000 * Math.random()),
            data: formData,
            dataType : "json",
            contentType: false,
            processData: false,
            type: method || "POST",
            async: isAsync || false,
            timeout: mtimeout || 10000,
            headers:{'Cookie':document.cookie},
            success: function (data) {
                success ? success(data):function(){};
            },
            error: function (data) {
                error ? error(data):function(){
                    showAlert("请求失败,请联系系统管理员",abort());
                };
            },
            beforeSend: function(){
                showLoadding();
            },
            complete : function(XMLHttpRequest,textStatus){
                hideLoadding();
                if(textStatus == 'timeout'){
                    showAlert("请求超时,请检查网络设置",abort());
                } else if(textStatus == 'error'){
                    showAlert("请求异常,请联系系统管理员",abort());
                }
            }
        });
    },
    myJump : function(murl, mtype, mdata) {
        mdata = urlEncode(mdata);
        var url = murl.indexOf("?")!=-1 ? murl + "&randomNum=" + parseInt(10000 * Math.random()) + mdata : murl + "?randomNum=" + parseInt(10000 * Math.random()) + mdata;
        $.ajax({
            url: url,
            dataType : "json",
            type: "GET",
            timeout: 10000,
            error: function (data) {
                showAlert("请求地址错误,请联系系统管理员");
            },
            complete : function(XMLHttpRequest, textStatus){
                if(textStatus == 'timeout'){
                    showAlert("请求超时,请检查网络设置",abort());
                } else if(textStatus == 'error'){
                    showAlert("请求异常,请联系系统管理员",abort());
                } else {
                    if("replace" == mtype)
                        window.location.replace(url)
                    else
                        window.location.href = url;
                }
            }
        });
    }
};

var urlEncode = function (param, key, encode) {
    if(param==null || param=='') return '';
    var paramStr = '';
    var t = typeof (param);
    if (t == 'string' || t == 'number' || t == 'boolean') {
        paramStr += '&' + key + '=' + ((encode==null||encode) ? encodeURIComponent(param) : param);
    } else {
        for (var i in param) {
            var k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i);
            paramStr += urlEncode(param[i], k, encode);
        }
    }
    return paramStr;
};


function getParams(key) {
    var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
};

function showLoadding() {

    var tip = '<div id="loadingToast">'+
        '<div class="weui-mask_transparent"></div>'+
        '<div class="weui-toast">'+
        '<i class="weui-loading weui-icon_toast"></i>'+
        '<p class="weui-toast__content">数据加载中</p>'+
        '</div>'+
        '</div>';
    $('#loadingToast').remove();
    $('body').append(tip);

}
function hideLoadding() {
    setTimeout(function () {
        $('#loadingToast').hide();
    },1000)

   // $('#loadingToast').css('display','none');
   //  $('#loadingToast').css('opacity',0);
}