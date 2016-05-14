'use strict'

var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var cors = require('cors');
var app = express();
var mysql = require('mysql');
var moment = require('moment');
var fs = require('fs');
var port = 3000;
var ip = '127.0.0.1';

var connection = mysql.createConnection({
    host: '103.18.6.83',
    port: 3306,
    user: 'b14717_thien',
    password: '123456',
    database: 'b14717_thien'
});
app.use(express.static(path.join(__dirname, 'public')));

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
 * Lấy danh sách sản phẩm not active
 *
 * Method: GET
 */
app.get('/products/notActive', function(req, res) {
    connection.query('SELECT * FROM product WHERE product.was_activated = 0', function(err, response) {
        if (err) {
            res.send('Lỗi khi lấy danh sách sản phẩm');
        } else {
            res.send(response);
        }
    });
});

/**
 * active san pham
 *
 * Method: PUT
 */
app.put('/products/updateActiveProduct/:product_id', function(req, res){
    var sql = 'UPDATE product SET was_activated = ' + 1 +'';
    sql += ' WHERE product_id = ' +  req.params.product_id;
    console.log(sql);

    connection.query(sql, function(err, results) {
        if (err) {
            res.send(err);
        } else {
            res.send(results);
        }
    });
});

/**
 * active adimin
 *
 * Method: PUT
 */
app.put('/users/updateActiveAdminUser/:user_id', function(req, res){
    var sql = 'UPDATE user SET type_user = "admin", status = 1 WHERE user_id =' + req.params.user_id;

    connection.query(sql, function(err, results) {
        if (err) {
            res.send(err);
        } else {
            res.send(results);
        }
    });
});

/**
 * block User
 *
 * Method: PUT
 */
app.put('/users/blockUser/:user_id', function(req, res){
    var sql = 'UPDATE user SET status = 0  WHERE user_id =' + req.params.user_id;
    console.log(sql);

    connection.query(sql, function(err, results) {
        if (err) {
            res.send(err);
        } else {
            res.send(results);
        }
    });
});
/**
 * unBlock User
 *
 * Method: PUT
 */
app.put('/users/unBlockUser/:user_id', function(req, res){
    var sql = 'UPDATE user SET status = 1  WHERE user_id =' + req.params.user_id;
    console.log(sql);

    connection.query(sql, function(err, results) {
        if (err) {
            res.send(err);
        } else {
            res.send(results);
        }
    });
});

/**
 * active Vip
 *
 * Method: PUT
 */
app.put('/users/updateActiveVipUser/:user_id', function(req, res){
    var sql = 'UPDATE vip_user SET status = 1  WHERE user_id =' + req.params.user_id;
    console.log(sql);

    connection.query(sql, function(err, results) {
        if (err) {
            res.send(err);
        } else {
            res.send(results);
        }
    });
});
/**
 * Lấy danh sách sản phẩm theo id_user
 *
 * Method: GET
 */
app.get('/products/byUser/:user_id', function(req, res) {
    console.log(req.params.user_id);
    connection.query('SELECT * FROM product WHERE product.owner_id = '+req.params.user_id, function(err, response) {
        console.log(response);
        if (err) {
            res.send('Lỗi khi lấy danh sách sản phẩm');
        } else {
            res.send(response);
        }
    });
});
/**
 * Lấy thông tin username theo admin unactive
 *
 * Method: GET
 */
 app.get('/user/getAdminUserUnActive', function(req, res) {
    connection.query('SELECT * FROM user WHERE user.type_user = "user"', function(err, response) {
        if (err) {
            res.send('Lỗi khi lấy danh sách sản phẩm');
        } else {
            res.send(response);
        }
    });
});
/**
 * Lấy thông tin username theo vip unactive
 *
 * Method: GET
 */
app.get('/user/getVipUserUnActive', function(req, res) { 
    var sql = 'SELECT * ' + 
              'FROM vip_user join user ' + 
              'WHERE vip_user.status = 0 AND vip_user.user_id = user.user_id';
    
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
 * Lấy thông tin username theo block
 *
 * Method: GET
 */
app.get('/user/getUserUnBlock', function(req, res) { 
    var sql = 'SELECT * ' + 
              'FROM user ' + 
              'WHERE user.status = 1 AND user.type_user = "user"';
    console.log(sql);
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
 * Lấy thông tin username theo block
 *
 * Method: GET
 */
app.get('/user/getUserBlock', function(req, res) { 
    var sql = 'SELECT * ' + 
              'FROM user ' + 
              'WHERE user.status = 0 AND user.type_user = "user"';
    console.log(sql);
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
 * Lấy thông tin username theo unAdmin user
 *
 * Method: GET
 */
app.get('/user/getUnAdiminUser', function(req, res) { 
    var sql = 'SELECT * ' + 
              'FROM user ' + 
              'WHERE user.type_user = "user"';

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
 * Lấy danh sách message theo user_id
 *
 * Method: GET
 */
app.get('/message/:user_id', function(req, res) {
    connection.query('SELECT * FROM message WHERE message.sendUser_id = '+ req.params.user_id +' OR message.receiveUser_id = ' +  req.params.user_id, function(err, response) {
        console.log(response);
        if (err) {
            res.send('Lỗi khi lấy danh sách sản phẩm');
        } else {
            res.send(response);
        }
    });
});
/**
 * Lấy danh sách message theo user_id
 *
 * Method: GET
 */
app.get('/messageSent/:user_id', function(req, res) {
    connection.query('SELECT * FROM message WHERE message.sendUser_id = '+ req.params.user_id, function(err, response) {
        console.log(response);
        if (err) {
            res.send('Lỗi khi lấy danh sách sản phẩm');
        } else {
            res.send(response);
        }
    });
});
/**
 * them moi message theo user_id
 *
 * Method: post
 */
app.post('/message/add', function(req, res) {
    var params1 = {
        sendUser_id: req.body.sendUser_id,
        receiveUser_id: req.body.receiveUser_id,
        content: req.body.content,
        isReceived: req.body.isReceived,
        subject: req.body.subject,
        receiveEmail: req.body.receiveEmail,
        sendEmail: req.body.sendEmail
    };
    
    connection.query('INSERT INTO message SET ?', params1, function(err, results) {
        console.log(results);

        if (err) {
            res.send(err);
        } else {
            res.send(results);
        }
    });
});
/**
 * update message
 *
 * Method: PUT
 */
app.put('/user/updateMessage/:message_id', function(req, res){
     var params = {
        isReceived: req.body.isReceived
    };
    
    var sql = 'UPDATE message SET isReceived = "' + params.isReceived + '" ';
    sql += ' WHERE message = ' + req.params.message_id ;

    connection.query(sql, function(err, results) {
        console.log(sql);
        console.log(results);
        if (err) {
            res.send(err);
        } else {
            res.send(results);
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
    var sql = 'SELECT user_id, username, password, type_user, full_name, sex, birthday, phone, email, address, status ' + 
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
 * Lấy danh sách hinh cua users
 *
 * Method: GET
 */
app.get('/image_user/:user_id', function(req, res) {
    var userID = req.params.user_id;
    var sql = 'SELECT * ' + 
              'FROM image_user '+
              'WHERE image_user.user_id = ' + userID;

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
 * Lấy danh sách đấu giá theo id user
 *
 * Method: GET
 */
app.get('/list_bid/byUser/:user_id', function(req, res) {
    var userID = req.params.user_id;
    var sql = 'SELECT * ' + 
              'FROM list_bid, product '+
              'WHERE list_bid.product_id = product.product_id AND list_bid.user_id = ' + userID;
    console.log(sql);
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
 * Lấy thông tin đánh giá của user_id
 *
 * Method: POST
 */
app.get('/rate/:product_id/:user_id', function(req, res) {
    var pro_id = req.params.product_id;
    var u_id = req.params.user_id;
    var sql= 'SELECT * FROM rate WHERE rate.product_id ='+ pro_id + ' and rate.user_id = ' + u_id;
    connection.query(sql, function(err, response) {
        if (err) {
            res.send('Lỗi khi lấy danh sách sản phẩm');
        } else {
            res.send(response);
        }
    });
});
app.get('/maxrateindex', function(req, res) {
    var sql= 'SELECT MAX(rate_id) as max_id FROM rate';
    connection.query(sql, function(err, response) {
        if (err) {
            res.send('Lỗi khi lấy danh sách sản phẩm');
        } else {
            res.send(response);
        }
    });
});
/**
 * Thêm mới đánh giá của user
 *
 * Method: POST
 */
app.post('/rate/add', function(req, res) {
    var params1 = {
        rate_id: req.body.rate_id,
        product_id: req.body.product_id,
        user_id: req.body.user_id,
        ratio: req.body.ratio,
    };

    connection.query('INSERT INTO rate SET ?', params1, function(err, results) {
        if (err) {
            res.send(err);
        } else {
            res.send(results);
        }
    });
});
/**
 * Thêm mới view sản phẩm
 *
 * Method: POST
 */
app.post('/addview/:product_id', function(req, res) {
    var pro_id = req.params.product_id;
    var query = 'UPDATE product SET viewers = viewers + 1 WHERE product.product_id = ' + pro_id;
    connection.query(query, function(err, results) {
        if (err) {
            res.send(err);
        } else {
            res.send(results);
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
        type_user: req.body.type_user,
        status: 1
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
 * Thêm mới người dung
 *
 * Method: POST
 */
app.post('/products/add', function(req, res) {
    var params1 = {
        name : req.body.name,
        price: req.body.price,
        type_product : req.body.type_product,
        owner_id: req.body.owner_id,
        posted_day: req.body.posted_day,
        start_day: "NULL",
        end_day:"NULL",
        viewers: 0,
        was_sold: 0,
        was_activated: 0

    };

    connection.query('INSERT INTO product SET ?', params1, function(err, results) {
        if (err) {
            res.send(err);
        } else {
            res.send(results);
        }
    });
});

/**
 * update user info
 *
 * Method: PUT
 */
app.put('/user/updateUserInfo/:username', function(req, res){
     var params = {
        username: req.params.username,
        full_name: req.body.full_name,
        phone: req.body.phone,
        email: req.body.email,
        address: req.body.address,
        birthday: req.body.birthday,
        sex: req.body.sex
    };
    
    var sql = 'UPDATE user SET full_name = "' + params.full_name + '", ';
    sql += ' phone = "' + params.phone + '", ';
    sql += ' birthday = "' + params.birthday + '", ';
    sql += ' email = "' + params.email + '", ';
    sql += ' sex = "' + params.sex + '", ';
    sql += ' address = "' + params.address + '"';
    sql += ' WHERE username = "' + params.username + '"';

    connection.query(sql, function(err, results) {
        console.log(sql);
        console.log(results);
        if (err) {
            res.send(err);
        } else {
            res.send(results);
        }
    });
});
/**
 * update user password
 *
 * Method: PUT
 */
app.put('/user/updateUserPassword/:username', function(req, res){
     var params = {
        username: req.params.username,
        password: req.body.password
    };

    var sql = 'UPDATE user SET password = "' + params.password + '"';
    sql += ' WHERE username = "' + params.username+'"';

    connection.query(sql, function(err, results) {
        if (err) {
            res.send(err);
        } else {
            res.send(results);
        }
    });
});
/**
 * update user type(admin - user)
 *
 * Method: PUT
 */
app.put('/user/updateUserType/:username', function(req, res){
     var params = {
        username: req.params.username,
        type_user: req.body.type_user
    };

    var sql = 'UPDATE user SET type_user = "' + params.type_user + '"';
    sql += ' WHERE username = "' + params.username + '"';

    connection.query(sql, function(err, results) {
        if (err) {
            res.send(err);
        } else {
            res.send(results);
        }
    });
});
/**
 * new vip user 
 *
 * Method: POST
 */
app.put('/user/appVip/:userid', function(req, res){
     var params = {
        user_id: req.params.user_id,
        end_date: req.body.end_date,
        detail: req.body.detail

    };

   connection.query('INSERT INTO vip_user SET ?', params, function(err, results) {
        if (err) {
            res.send(err);
        } else {
            res.send(results);
        }
    });
});
/**
 * check vip user 
 *
 * Method: get
 */
app.get('/user/checkVip/:userid', function(req, res){
     var params = {
        user_id: req.params.userid,
    };
    var sql = 'SELECT * ' + 
              'FROM vip_user '+
              'WHERE vip_user.user_id = ' + params.user_id;

    connection.query(sql, function(err, response) {
        if (err) {
                console.log(err);
                res.send(response);
        } else {
            res.send(response);
        }
    });
});
/**
 * check vip user 
 *
 * Method: get
 */
app.get('/user/checkEmail/:email', function(req, res){
     var params = {
        email: req.params.email,
    };
    var sql = 'SELECT * ' + 
              'FROM user '+
              'WHERE email = "' + params.email+'"';

    connection.query(sql, function(err, response) {
        if (err) {
                console.log(err);
                res.send(response);
        } else {
            res.send(response);
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

/**
 * Cập nhật sản phẩm
 *
 * Method: PUT
 */
app.put('/products/update/:product', function(req, res) {
    var params = {
        TenSanPham: req.body.name,
        LoaiSanPham: req.body.category,
        DonGia: req.body.price,
        MaSanPham: req.params.product
    };

    var sql = 'UPDATE SANPHAM SET TenSanPham = "' + params.TenSanPham + '", ';
    sql += ' LoaiSanPham = "' + params.LoaiSanPham + '", ';
    sql += ' DonGia = ' + params.DonGia;
    sql += ' WHERE MaSanPham = ' + params.MaSanPham;

    connection.query(sql, function(err, results) {
        if (err) {
            res.send(err);
        } else {
            res.send(results);
        }
    });
});

/**
 * Xóa sản phẩm
 *
 * Method: DELETE
 */
app.delete('/products/delete/:product', function(req, res) {
    var MaSanPham = req.params.product;
    var sql = 'DELETE FROM SANPHAM WHERE MaSanPham = ' + MaSanPham;

    connection.query(sql, function(err, results) {
        if (err) {
            res.send(err);
        } else {
            res.send(results);
        }
    });
});

/**
 * Xóa message
 *
 * Method: DELETE
 */
app.delete('/message/delete/:message_id', function(req, res) {
    var message_id = req.params.message_id;
    var sql = 'DELETE FROM message WHERE message_id = ' + message_id;
    connection.query(sql, function(err, results) {
        if (err) {
            res.send(err);
        } else {
            res.send(results);
        }
    });
});

/**
 * Xóa message
 *
 * Method: DELETE
 */
app.delete('/users/deleteUser/:user_id', function(req, res) {
    var user_id = req.params.user_id;
    var sql = 'DELETE FROM user WHERE user_id = ' + user_id;
    connection.query(sql, function(err, results) {
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