/**
 * Created by Administrator on 2017/2/28.
 */
var http=require('http'),url=require('url'),fs=require('fs'),mime=require('mime');
function readBooks(callback) {
    fs.readFile('./books.json','utf8',function (err,data) {
        if(err||data==''){
            callback([]);
        }else {
            callback(JSON.parse(data));
        }
    })
}
function writeBooks(data,callback) {
    fs.writeFile('./books.json',JSON.stringify(data),callback)
}
http.createServer(function (req,res) {
    //后台 只将首页返回即可
    var urlObj=url.parse(req.url);
    var pathname=urlObj.pathname;
    if(pathname=='/'){
        res.setHeader('Content-Type','text/html;charset=utf8');
        fs.createReadStream('./index.html').pipe(res);
    }else if(/^\/books(\/\d+)?$/.test(pathname)){
        // console.log(123)
        var id=pathname.match(/^\/books(\/\d+)?$/)[1];/*有全局的g就不行了*/
        switch (req.method){
            case 'GET':
                if(id){
                    readBooks(function (data) {
                        var book=data.find(function (item) {
                            return item.id==id.slice(1);
                        })
                        if(book){
                            res.end(JSON.stringify(book))
                        }else{
                            res.end(JSON.stringify([]))
                        }
                    })
                }else{
                    readBooks(function (data) {
                        res.end(JSON.stringify(data));
                    })
                }
                break;
            case 'POST':
                var str='';
                req.on('data',function (data) {
                    str+=data;
                });
                req.on('end',function () {
                    var book=JSON.parse(str);
                    readBooks(function (data) {//已经读取
                        book.id=data.length?parseInt(data[data.length-1].id)+1:1 ;
                        data.push(book);
                        writeBooks(data,function () {
                            res.end(JSON.stringify(book));//返回去一个新的
                        })
                    });
                });
                break;
            case 'DELETE':
                if(id){
                    readBooks(function (data) {
                        data=data.filter(function (item) {
                            return item.id!=id.slice(1);
                        })
                        writeBooks(data,function () {
                            res.end(JSON.stringify({}));
                        })
                    })
                }
                break;
            case 'PUT':
                if(id){
                    var str='';
                    req.on('data',function (data) {
                        str+=data;
                    })
                    req.on('end',function () {
                        var book=JSON.parse(str);
                        readBooks(function (data) {
                            data=data.map(function (item) {
                                if(item.id==id.slice(1)){
                                    return book
                                }
                                return item
                            });
                            writeBooks(data,function () {
                                res.end(JSON.stringify(book));
                            })
                        })
                    })
                }
                break;
        }
    }
    else{
        fs.exists('.'+pathname,function (flag) {
            if(flag){
                res.setHeader('Content-Type',mime.lookup(pathname)+';charset=utf8');
                fs.createReadStream('.'+pathname).pipe(res);
            }else{
                res.statusCode=404;
                res.end();
            }
        })
    }
}).listen(8080,function () {
    console.log('在浏览器中输入http://localhost:8080');
});