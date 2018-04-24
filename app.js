var express = require('express');
var expressValidator = require('express-validator');
var busboy = require('connect-busboy');
var bodyParser = require('body-parser');
var jwt = require("jsonwebtoken");
var app = express();
var apiRoutes = express.Router();
var pool = require(__dirname + '/config/db.js');
var config = require(__dirname + '/config/config');
var restaurant = require(__dirname + "/api/restaurant.js");

app.set('port', process.env.PORT || 3000);
app.use(bodyParser.urlencoded({
    limit: '500mb',
    extended: true,
    parameterLimit: 50000
}));
app.use(expressValidator());
app.use(bodyParser.json());
app.use(busboy());
app.use(express.static(__dirname + '/public'));

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,token');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
app.use('/npm', express.static(__dirname + '/node_modules'));


apiRoutes.use(function(req, res, next) {
    var token = req.body.token || req.query.token || req.headers['token'];
    if (token) {
        jwt.verify(token, config.secret, function(err, decoded) {
            if (err) {
                return res.json({ "code": 200, "status": "Error", "message": "Failed to authenticate token" });
            } else {
                req.user = decoded;
                next();
            }
        });
    } else {
        return res.json({ "code": 200, "status": "Error", "message": "No token provided" });
    }
});

// will Use for authentication
app.use('/api', apiRoutes);

app.get('/', function(req, res) {
    res.sendFile('index.html', { 'root': "view" });
});

//  1.RESTAURANT INFO
app.post('/restaurant/add', restaurant.addRestaurant);
app.get('/restaurant/get', restaurant.getRestaurant);
app.post('/restaurant/update', restaurant.updateRestaurant);
app.get('/restaurant/delete', restaurant.removeRestaurant);
// 2.MENU CATEGORIES
app.post('/menu_category/add', restaurant.addMenuCat);
app.get('/menu_category/get', restaurant.getMenuCat);
app.post('/menu_category/update', restaurant.updateMenuCat);
app.get('/menu_category/delete', restaurant.removeMenuCat);
// 3.MENU ITEMS
app.post('/menu_items/add', restaurant.addMenuItem);
app.get('/menu_items/get', restaurant.getMenuItem);
app.post('/menu_items/update', restaurant.updateMenuItem);
app.get('/menu_items/delete', restaurant.removeMenuItem);
//4.RESTAURANT CUSTOMERS 
app.post('/customer/add', restaurant.addCustomers);
app.get('/customer/get', restaurant.getCustomers);
app.post('/customer/update', restaurant.updateCustomers);
app.get('/customer/delete', restaurant.removeCustomers);
// 5.TABLE RESERVATIONS
app.post('/table/add', restaurant.addTableRese);
app.get('/table/get', restaurant.getTableRese);
app.post('/table/update', restaurant.updateTableRese);
// 6.TAKE AWAY ORDERS
app.post('/takeorder/add', restaurant.addTakeOrder);
app.get('/takeorder/get', restaurant.getTakeOrder);
app.post('/takeorder/update', restaurant.updateTakeOrder);
// 7.HOME DELIVERY ORDERS
app.post('/homeorder/add', restaurant.addHomeOrder);
app.get('/homeorder/get', restaurant.getHomeOrder);
app.post('/homeorder/update', restaurant.updateHomeOrder);
// 8.ORDER DETAILS
app.post('/order/add', restaurant.addOrder);
app.get('/order/get', restaurant.getOrder);
app.post('/order/update', restaurant.updateOrder);
// 9. OFFER DETAILS
app.post('/offer/add', restaurant.addOffer);
app.get('/offer/get', restaurant.getOffer);
app.post('/offer/update', restaurant.updateOffer);
// 10.BULK BOOKINGS
app.post('/booking/add', restaurant.addBooking);
app.get('/booking/get', restaurant.getBooking);
app.post('/booking/update', restaurant.updateBooking);
// 11.PUSH NOTIFICATIONS
app.post('/notification/add', restaurant.addNotification);
app.get('/notification/get', restaurant.getNotification);
// 12.RESTAURANT EVENTS
app.post('/event/add', restaurant.addEvent);
app.get('/event/get', restaurant.getEvent);
app.post('/event/update', restaurant.updateEvent);
// 13.CUSTOMER REVIEWS
app.post('/review/add', restaurant.addReview);
app.get('/review/get', restaurant.getReview);


app.listen(app.get('port'));
console.log("Started on Port No. ", app.get('port'));