'use strict'

var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var cors = require('cors');
var app = express();
var mysql = require('mysql');

var port = 3000;
var ip = '127.0.0.1';

var connection = mysql.createConnection({
    host: '103.18.6.83',
    port: 3306,
    user: 'b14717_thien',
    password: '123456',
    database: 'b14717_thien'
});

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());
app.use(cors());

function isExpireDay(end_date){
    var a = new Date(end_date);
    var b = new Date(Date.now());
    var total = a - b;

    if(total <=  0)
        return true;
    else
        return false;
}

function ChangeWasSold(productInfo){
    var sql = 'UPDATE product SET was_sold = 1 WHERE product_id = ' + productInfo.product_id;
    connection.query(sql, function(err, results) {
        if (err) {
            console.log(err);
        }
    });
}

function AddToResult(productInfo){
    connection.query('SELECT user_id, date, price FROM list_bid WHERE product_id = ' + productInfo.product_id + ' ORDER BY price DESC', function(err, response) {
        if (err) {
            res.send('Lỗi khi lấy danh sách sản phẩm');
        } else {
            var userBidInfo = response[0];
            if (userBidInfo != null && userBidInfo.user_id != null){
                connection.query('SELECT * FROM result WHERE product_id = ' + productInfo.product_id, function(err, response) {
                    var resultInfo = response;
                    if(resultInfo.length == 0){
                        var params = {
                        product_id: productInfo.product_id,
                        winer_id: userBidInfo.user_id,
                        owner_id: productInfo.owner_id,
                        price: userBidInfo.price,
                        win_date: userBidInfo.date,
                        was_delivered: 0
                        };

                        connection.query('INSERT INTO result SET ?', params, function(err, res) {
                            if (err) {
                                console.log(err);
                            }
                        });
                    }
                });
            }
        }
    });
}

function HanleExpireDay(productData){
    var newProData = [];
    for (var i = 0; i < productData.length; i++) {
        if(isExpireDay(productData[i].end_day) == false){
            newProData.push(productData[i]);
        }
        else {
            ChangeWasSold(productData[i]);
            AddToResult(productData[i]);
        }
    }
    return newProData;
}

/**
 * Lấy danh sách sản phẩm
 *
 * Method: GET
 */
app.get('/products', function(req, res) {
    connection.query('SELECT * FROM product WHERE product.was_activated = 1 and product.was_sold = 0 ORDER BY product.start_day DESC', function(err, response) {
        if (err) {
            res.send('Lỗi khi lấy danh sách sản phẩm');
        } else {
            var data = HanleExpireDay(response);
            res.send(data);
        }
    });
});

/**
 * Lấy danh sách sản phẩm
 *
 * Method: GET
 */
app.get('/products/all/:filter', function(req, res) {
    var filter = req.params.filter;
    var sql;
    if(filter == "highest_rating"){
        sql = 'SELECT product.product_id, product.name, product.price, product.end_day, product.type_product, product.was_activated, product.was_sold, rate.ratio '+
              'FROM product LEFT JOIN rate '+
              'ON product.product_id = rate.product_id '+
              'ORDER BY product.product_id ASC';
    }
    else if(filter == "low_to_high"){
        sql = 'SELECT * FROM product '+
              'WHERE product.was_activated = 1 and product.was_sold = 0 '+
              'ORDER BY product.price ASC';
    }
    else if(filter == "high_to_low"){
        sql = 'SELECT * FROM product '+
              'WHERE product.was_activated = 1 and product.was_sold = 0 '+
              'ORDER BY product.price DESC';
    }

    connection.query(sql, function(err, response) {
        if (err) {
                console.log(err);
            res.send('Lỗi khi lấy danh sách sản phẩm');
        } else {
            var data = HanleExpireDay(response);
            res.send(data);
        }
    });
});

/**
 * Lấy thông tin một sản phẩm theo loại sản phẩm
 *
 * Method: GET
 */
app.get('/products/type_product/:type_product', function(req, res) {
    var typeProduct = req.params.type_product;
    var sql = 'SELECT * FROM product '+
              'WHERE type_product = "' + typeProduct + '" and product.was_activated = 1 and product.was_sold = 0 '+
              'ORDER BY product.start_day DESC';

    connection.query(sql, function(err, response) {
        if (err) {
                console.log(err);
            res.send('Lỗi khi lấy danh sách sản phẩm');
        } else {
            var data = HanleExpireDay(response);
            res.send(data);
        }
    });
});

/**
 * Lấy thông tin sản phẩm theo loại sản phẩm sắp xếp theo giá thấp đến cao
 *
 * Method: GET
 */
app.get('/products/low_to_high/:type_product', function(req, res) {
    var typeProduct = req.params.type_product;
    var sql = 'SELECT * FROM product '+
              'WHERE type_product = "' + typeProduct + '" and product.was_activated = 1 and product.was_sold = 0 '+
              'ORDER BY product.price DESC';

    connection.query(sql, function(err, response) {
        if (err) {
                console.log(err);
            res.send('Lỗi khi lấy danh sách sản phẩm');
        } else {
            var data = HanleExpireDay(response);
            res.send(data);
        }
    });
});

/**
 * Lấy thông tin sản phẩm theo loại sản phẩm sắp xếp từ giá cao xuống thấp
 *
 * Method: GET
 */
app.get('/products/high_to_low/:type_product', function(req, res) {
    var typeProduct = req.params.type_product;
    var sql = 'SELECT * FROM product '+
              'WHERE type_product = "' + typeProduct + '" and product.was_activated = 1 and product.was_sold = 0 '+
              'ORDER BY product.price ASC';

    connection.query(sql, function(err, response) {
        if (err) {
                console.log(err);
            res.send('Lỗi khi lấy danh sách sản phẩm');
        } else {
            var data = HanleExpireDay(response);
            res.send(data);
        }
    });
});

/**
 * Lấy danh sách sản phẩm theo chuỗi tìm kiếm
 *
 * Method: GET
 */
app.get('/products/search/:value', function(req, res) {
    var strname = req.params.value;
    var sql = 'SELECT * ' + 
              'FROM product '+
              'WHERE product.was_activated = 1 and product.was_sold = 0 and product.name LIKE '+ '\'' + '%' + strname + '%' + '\'';
              'ORDER BY product.date DESC';

    connection.query(sql, function(err, response) {
        if (err) {
                console.log(err);
            res.send('Lỗi khi lấy danh sách sản phẩm');
        } else {
            var data = HanleExpireDay(response);
            res.send(data);
        }
    });
});

/**
 * Lấy thông tin một sản phẩm theo id sản phẩm
 *
 * Method: GET
 */
app.get('/product/id/:product_id', function(req, res) {
    var productID = req.params.product_id; 
    var sql = 'SELECT product.product_id, product.name, product.price, product.start_day, product.end_day, product.viewers, detail.content, user.username ' + 
    'FROM product, vip_user, user, detail ' + 
    'WHERE product.product_id='+productID+' and detail.product_id=product.product_id and product.owner_id=vip_user.user_id and vip_user.user_id=user.user_id';

    connection.query(sql, function(err, response) {
        if (err) {
                console.log(err);
            res.send('Lỗi khi lấy danh sách sản phẩm');
        } else {
            res.send(response);
        }
    });
});

/**
 * Lấy thông tin username
 *
 * Method: GET
 */
app.get('/user/:username', function(req, res) {
    var username = req.params.username; 
    var sql = 'SELECT user_id, username, password, type_user, phone , email ' + 
              'FROM user ' + 
              'WHERE user.username = "' + username + '"';

    connection.query(sql, function(err, response) {
        if (err) {
                console.log(err);
            res.send('Lỗi khi lấy danh sách sản phẩm');
        } else {
            res.send(response);
        }
    });
});


/**
 * Lấy thông tin một đánh giá theo id sản phẩm
 *
 * Method: GET
 */
app.get('/rate/:product_id', function(req, res) {
    var productID = req.params.product_id;
    var sql = 'SELECT * FROM rate WHERE rate.product_id = ' + productID;

    connection.query(sql, function(err, response) {
        if (err) {
                console.log(err);
            res.send('Lỗi khi lấy danh sách sản phẩm');
        } else {
            res.send(response);
        }
    });
});

/**
 * Lấy thông tin comment theo id sản phẩm
 *
 * Method: GET
 */
app.get('/comment/:product_id', function(req, res) {
    var productID = req.params.product_id;
    var sql = 'SELECT comment.content, comment.date, user.username '+
              'FROM comment, user '+
              'WHERE comment.product_id = ' + productID + ' and comment.user_id = user.user_id '+
              'ORDER BY comment.date DESC';

    connection.query(sql, function(err, response) {
        if (err) {
                console.log(err);
            res.send('Lỗi khi lấy danh sách sản phẩm');
        } else {
            res.send(response);
        }
    });
});

/**
 * Lấy danh sách đấu giá theo id sản phẩm
 *
 * Method: GET
 */
app.get('/list_bid/:product_id', function(req, res) {
    var productID = req.params.product_id;
    var sql = 'SELECT user.username, list_bid.price, list_bid.date ' + 
              'FROM list_bid, user '+
              'WHERE list_bid.product_id = ' + productID + ' and list_bid.user_id = user.user_id ' +
              'ORDER BY list_bid.date DESC';

    connection.query(sql, function(err, response) {
        if (err) {
                console.log(err);
            res.send('Lỗi khi lấy danh sách sản phẩm');
        } else {
            res.send(response);
        }
    });
});

/**
 * Lấy danh sách kết quả
 *
 * Method: GET
 */
app.get('/result', function(req, res) {
    var sql = 'SELECT r.result_id, r.win_date, r.was_delivered, r.price, p.product_id, p.name, u1.username winer_name, u2.username owner_name '+
              'FROM result r JOIN user u1 ON r.winer_id=u1.user_id '+
              'JOIN user u2 ON r.owner_id=u2.user_id '+
              'JOIN product p ON r.product_id=p.product_id';

    connection.query(sql, function(err, response) {
        if (err) {
                console.log(err);
            res.send('Lỗi khi lấy danh sách sản phẩm');
        } else {
            res.send(response);
        }
    });
});

/**
 * Lấy danh sách hinh cua san pham
 *
 * Method: GET
 */
app.get('/image/:product_id', function(req, res) {
    var productID = req.params.product_id;
    var sql = 'SELECT * ' + 
              'FROM image '+
              'WHERE image.product_id = ' + productID;

    connection.query(sql, function(err, response) {
        if (err) {
                console.log(err);
            res.send('Lỗi khi lấy danh sách sản phẩm');
        } else {
            res.send(response);
        }
    });
});

/**
 * Thêm mới người dung
 *
 * Method: POST
 */
app.post('/user/add', function(req, res) {
    var params1 = {

        username: req.body.username,
        password: req.body.password,
        full_name: req.body.fullname,
        sex: req.body.gender,
        birthday: req.body.birthday,
        phone: req.body.phone,
        email: req.body.email,
        address: req.body.address,
        type_user: req.body.type_user
    };

    connection.query('INSERT INTO user SET ?', params1, function(err, results) {
        if (err) {
            res.send(err);
        } else {
            res.send(results);
        }
    });
});
/**
 * Đổi password
 *
 * Method: PUT
 */
app.put('/user/forgotpassword', function(req, res) {
    connection.query('UPDATE user SET password = ? WHERE username = ?', [req.body.password,req.body.username],function(err, results) {
        if (err) {
            res.send(err);
        } else {
            res.send(results);
        }
    });
});

/**
 * Thêm mới bid
 *
 * Method: POST
 */
app.post('/list_bid/add', function(req, res) {
    var params1 = {
        product_id: req.body.product_id,
        user_id: req.body.user_id,
        price: req.body.price,
        date: req.body.date,
    };

    connection.query('INSERT INTO list_bid SET ?', params1, function(err, results) {
        if (err) {
            res.send(err);
        } else {
            res.send(results);
        }
    });
});

/**
 * Thêm mới comment
 *
 * Method: POST
 */
app.post('/comment/add', function(req, res) {
    var params1 = {
        product_id: req.body.product_id,
        user_id: req.body.user_id,
        content: req.body.content,
        date: req.body.date,
    };

    connection.query('INSERT INTO comment SET ?', params1, function(err, results) {
        if (err) {
            res.send(err);
        } else {
            res.send(results);
        }
    });
});

app.listen(port, ip, function() {
    console.log('%s: Node server started on %s:%d ...', Date(Date.now() ), ip, port);
});