
(function () {
    function ajax(options) {

        if (!tools.isType(options, 'Object')) {
            throw new TypeError('参数类型错误');
        }

        var xhr = tools.getXHR();


        var method = options.method || 'get';

        var url = options.url || '/';

        var async = !!(options.async === undefined ? true : options.async);

        var isGet = /^get|delete|head$/ig.test(method);


        var data = tools.param(options.data);

        if (isGet && data) {
            url = tools.appendToURL(url, data);

            data = null;
        }
        if (isGet && options.cache === false) {
            var rand = Math.random();
            url = tools.appendToURL(url, '_=' + rand);
        }


        xhr.open(method, url, async, options.username, options.password);
        if (xhr.setRequestHeader && tools.isType(options.headers, 'Object')) {
            for (var header in options.headers) {
                if (!options.headers.hasOwnProperty(header)) continue;
                xhr.setRequestHeader(header, options.headers[header]);
            }
        }

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                var responseText = xhr.responseText;
                if (/^2\d{2}/.test(xhr.status) || xhr.status === 304) {
                    if (options.dataType === 'json') {
                        try {
                            responseText = tools.JSONParse(responseText);
                        } catch (ex) {
                            typeof options.error === 'function'
                            && options.error(ex);
                            return;
                        }
                    }
                    typeof options.success === 'function'
                    && options.success(responseText);
                } else {
                    typeof options.error === 'function'
                    && options.error(xhr.status);
                }
            }
        };
        xhr.send(data);
        return xhr;
    }
    var tools = {
        getXHR: (function () {
            var list = [
                function () {
                    return new XMLHttpRequest();
                }, function () {
                    return new ActiveXObject('Microsoft.XMLHTTP');
                }, function () {
                    return new ActiveXObject('Msxml2.XMLHTTP');
                }, function () {
                    return new ActiveXObject('Msxml3.XMLHTTP');
                }];

            var xhr = null;
            while (xhr = list.shift()) {
                try {
                    xhr();
                    return xhr;
                } catch (ex) {

                }
            }
            throw new ReferenceError('当前浏览器不支持ajax功能');
        })(),

        isType: function (data, type) {
            return Object.prototype.toString.call(data) === '[object ' + type + ']';

        },

        param: function (data) {
            if (tools.isType(data, 'String')) {
                return data;
            }
            if (data === null || data === undefined) {
                return '';
            }
            if (this.isType(data, 'Object')) {
                var arr = [];
                for (var name in data) {
                    if (!data.hasOwnProperty(name)) continue;
                    arr.push(encodeURIComponent(name)
                        + '='
                        + encodeURIComponent(data[name]));
                }
                return arr.join('&');
            }
            return String(data);
        },
        appendToURL: function (url, padStirng) {
            padStirng = tools.param(padStirng);

            var hasQuery = /\?/.test(url);
            return url + (hasQuery ? '&' : '?') + padStirng;
        },
        JSONParse: function (jsonString) {
            if (window.JSON) {
                return JSON.parse(jsonString)
            }
            return eval('(' + jsonString + ')');
        }
    };
    this.ajax = ajax;
}());