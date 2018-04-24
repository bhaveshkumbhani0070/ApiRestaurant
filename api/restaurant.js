const { rest_info } = require('./models/rest_info');
const { menu_categories } = require('./models/menu_categories');
const { menu_items } = require('./models/menu_items');
const { customers } = require('./models/customers');
const { table_reservations } = require('./models/table_reservations');
const { home_order } = require('./models/home_order');
const { take_order } = require('./models/take_order');
const { offer } = require('./models/offer');
const { booking } = require('./models/booking');
const { notification } = require('./models/notification');
const { events } = require('./models/events');
const { cust_review } = require('./models/cust_review');
const { orders } = require('./models/orders');

var bcrypt = require('bcrypt-nodejs');
var jwt = require("jsonwebtoken");
var validator = require('validator');

// CUSTOMER REVIEWS
exports.addReview = function(req, res) {
    receivedValues = req.body;
    if (JSON.stringify(receivedValues) === '{}') {
        res.status(400).json({ message: 'Body data is required' });
        return;
    } else {
        console.log("*** Validating User Details... ");
        usercolumns = [
            "rest_id", "cust_id", "date", "stars", "description", "image"
        ];
        for (var iter = 0; iter < usercolumns.length; iter++) {
            columnName = usercolumns[iter];
            if ((receivedValues[columnName] == undefined || receivedValues[columnName] == "")) {
                console.log("*** Redirecting: ", columnName, " field is required");
                res.json({ "code": 200, "status": "Error", "message": columnName + " field is undefined" });
                logger.error('*** Redirecting: ', columnName, ' field is required');
                return;
            }
        }
        var newEvents = cust_review(receivedValues);
        newEvents.save(function(err, ins) {
            if (!err) {
                res.status(200).json({ message: 'Review created succesfully' });
                console.log('Review created successfully', ins);
                return;
            } else {
                res.status(400).json({ message: 'Error for booking' });
                console.log('Error for insert into database', err);
                return;
            }
        })
    }
}
exports.getReview = function(req, res) {
    var id = req.query.id;
    var cust_id = req.query.cust_id
    if (id) {
        var q = { _id: id };
    } else if (cust_id) {
        var q = { cust_id: cust_id };
    } else {
        res.status(400).json({ message: 'cust_id id is required' });
        return;
    }
    cust_review.find({ cust_id: cust_id }).then((data) => {
        res.status(200).json({ message: 'events get successfully', data: data });
        console.log('data', data);
        return;
    }).catch((e) => {
        res.status(400).json({ message: 'Error for getting offer' });
        console.log('e', e);
        return;
    });
}


// RESTAURANT EVENTS
exports.addEvent = function(req, res) {
    receivedValues = req.body;
    if (JSON.stringify(receivedValues) === '{}') {
        res.status(400).json({ message: 'Body data is required' });
        return;
    } else {
        usercolumns = [
            "rest_id", "date", "name", "start_time",
            "end_time", "description", "image"
        ];
        for (var iter = 0; iter < usercolumns.length; iter++) {
            columnName = usercolumns[iter];
            if ((receivedValues[columnName] == undefined || receivedValues[columnName] == "")) {
                console.log("*** Redirecting: ", columnName, " field is required");
                res.json({ "code": 200, "status": "Error", "message": columnName + " field is undefined" });
                logger.error('*** Redirecting: ', columnName, ' field is required');
                return;
            }
        }
        var newEvents = events(receivedValues);

        newEvents.save(function(err, ins) {
            if (!err) {
                res.status(200).json({ message: 'events created succesfully' });
                console.log('events created successfully', ins);
                return;
            } else {
                res.status(400).json({ message: 'Error for booking' });
                console.log('Error for insert into database', err);
                return;
            }
        })
    }
}
exports.getEvent = function(req, res) {
    var id = req.query.id;
    var rest_id = req.query.rest_id;
    if (id) {
        var q = { _id: id };
    } else if (rest_id) {
        var q = { rest_id: rest_id };
    } else {
        res.status(400).json({ message: 'id or rest id is required' });
        return;
    }
    events.find(q).then((data) => {
        res.status(200).json({ message: 'events get successfully', data: data });
        console.log('data', data);
        return;
    }).catch((e) => {
        res.status(400).json({ message: 'Error for getting offer' });
        console.log('e', e);
        return;
    });
}
exports.updateEvent = function(req, res) {
    receivedValues = req.body
    if (JSON.stringify(receivedValues) === '{}') {
        res.status(400).json({ message: 'Body data is required' });
        return;
    } else {
        var id = req.body.event_id;
        if (!id) {
            res.status(401).json({ message: 'events id is required field' });
            return;
        }
        usercolumns = [
            "rest_id", "date", "name", "start_time",
            "end_time", "description", "image"
        ];
        var tmpcolumnName = {};
        for (var iter = 0; iter < usercolumns.length; iter++) {
            columnName = usercolumns[iter];
            if (columnName && usercolumns.includes(columnName)) {
                if (receivedValues[columnName] != undefined) {
                    tmpcolumnName[columnName] = receivedValues[columnName];
                }
            }
        }
        console.log('updateString', tmpcolumnName);
        events.findByIdAndUpdate(
            id,
            tmpcolumnName,
            function(err, data) {
                if (!err) {
                    res.status(200).json({ status: true, message: 'Update successfully' });
                    return;
                } else {
                    res.status(400).json({ status: false, message: 'Error for update home order' });
                    console.log('Error', err);
                    return;
                }
            });
    }
}

// PUSH NOTIFICATIONS
exports.addNotification = function(req, res) {
    receivedValues = req.body;
    if (JSON.stringify(receivedValues) === '{}') {
        res.status(400).json({ message: 'Body data is required' });
        return;
    } else {
        console.log("*** Validating User Details... ");
        usercolumns = [
            "rest_id", "cust_id", "title", "description"
        ];
        for (var iter = 0; iter < usercolumns.length; iter++) {
            columnName = usercolumns[iter];
            if ((receivedValues[columnName] == undefined || receivedValues[columnName] == "")) {
                console.log("*** Redirecting: ", columnName, " field is required");
                res.json({ "code": 200, "status": "Error", "message": columnName + " field is undefined" });
                logger.error('*** Redirecting: ', columnName, ' field is required');
                return;
            }
        }
        var newNotification = notification(receivedValues);

        newNotification.save(function(err, ins) {
            if (!err) {
                res.status(200).json({ message: 'notification added succesfully' });
                console.log('notification added successfully', ins);
                return;
            } else {
                res.status(400).json({ message: 'Error for booking' });
                console.log('Error for insert into database', err);
                return;
            }
        })
    }
}
exports.getNotification = function(req, res) {

    var cust_id = req.params.id;
    if (cust_id) {
        var query = { cust_id: cust_id };
    } else {
        var query = {};
    }
    notification.find(query).then((data) => {
        res.status(200).json({ message: 'booking get successfully', data: data });
        console.log('data', data);
        return;
    }).catch((e) => {
        res.status(400).json({ message: 'Error for getting offer' });
        console.log('e', e);
        return;
    });
}

// BULK BOOKINGS
exports.addBooking = function(req, res) {
    receivedValues = req.body;
    if (JSON.stringify(receivedValues) === '{}') {
        res.status(400).json({ message: 'Body data is required' });
        return;
    } else {
        console.log("*** Validating User Details... ");
        usercolumns = [
            "rest_id", "cust_id", "date", "time", "people",
            "comments", "status"
        ];
        var status = ["requested", "confirmed", "rejected", "completed"];

        for (var iter = 0; iter < usercolumns.length; iter++) {
            columnName = usercolumns[iter];
            if ((receivedValues[columnName] == undefined || receivedValues[columnName] == "")) {
                console.log("*** Redirecting: ", columnName, " field is required");
                res.json({ "code": 200, "status": "Error", "message": columnName + " field is undefined" });
                logger.error('*** Redirecting: ', columnName, ' field is required');
                return;
            }
            if (receivedValues[columnName] !== undefined && receivedValues[columnName] !== "" && columnName == 'status') {
                if (!status.includes(receivedValues[columnName])) {
                    res.json({ code: 200, status: 'error', message: 'status must be from requested/confirmed/rejected/completed' });
                    return;
                }
            }
        }
        var newBook = booking(receivedValues);

        newBook.save(function(err, ins) {
            if (!err) {
                res.status(200).json({ message: 'booking created succesfully' });
                console.log('booking created successfully', ins);
                return;
            } else {
                res.status(400).json({ message: 'Error for booking' });
                console.log('Error for insert into database', err);
                return;
            }
        })
    }
}
exports.getBooking = function(req, res) {
    var id = req.query.id;
    var cust_id = req.query.cust_id;
    if (id) {
        var q = { _id: id };
    } else if (cust_id) {
        var q = { cust_id: cust_id };
    } else {
        res.status(400).json({ message: 'cust_id is required' });
        return;
    }
    booking.find(q).then((data) => {
        res.status(200).json({ message: 'booking get successfully', data: data });
        console.log('data', data);
        return;
    }).catch((e) => {
        res.status(400).json({ message: 'Error for getting offer' });
        console.log('e', e);
        return;
    });
}
exports.updateBooking = function(req, res) {
    receivedValues = req.body
    if (JSON.stringify(receivedValues) === '{}') {
        res.status(400).json({ message: 'Body data is required' });
        return;
    } else {
        var id = req.body.id;
        if (!id) {
            res.status(401).json({ message: 'id is required field' });
            return;
        }
        usercolumns = [
            "rest_id", "cust_id", "date", "time", "people",
            "comments", "status"
        ];
        var status = ["requested", "confirmed", "rejected", "completed"];

        var tmpcolumnName = {};
        for (var iter = 0; iter < usercolumns.length; iter++) {
            columnName = usercolumns[iter];
            if (columnName && usercolumns.includes(columnName)) {
                if (receivedValues[columnName] != undefined) {
                    tmpcolumnName[columnName] = receivedValues[columnName];
                }
                if (receivedValues[columnName] !== undefined && receivedValues[columnName] !== "" && columnName == 'status') {
                    if (!status.includes(receivedValues[columnName])) {
                        res.json({ code: 200, status: 'error', message: 'status must be from requested/confirmed/rejected/completed' });
                        return;
                    }
                }
            }
        }
        console.log('updateString', tmpcolumnName);
        booking.findByIdAndUpdate(
            id,
            tmpcolumnName,
            function(err, data) {
                if (!err) {
                    res.status(200).json({ status: true, message: 'Update successfully' });
                    return;
                } else {
                    res.status(400).json({ status: false, message: 'Error for update home order' });
                    console.log('Error', err);
                    return;
                }
            });
    }
}

// ORDER DETAILS
exports.addOffer = function(req, res) {
    receivedValues = req.body;
    if (JSON.stringify(receivedValues) === '{}') {
        res.status(400).json({ message: 'Body data is required' });
        return;
    } else {
        usercolumns = [
            "rest_id", "name", "description", "image",
            "code", "status"
        ];
        var status = ["active", "inactive"];
        for (var iter = 0; iter < usercolumns.length; iter++) {
            columnName = usercolumns[iter];
            if ((receivedValues[columnName] == undefined || receivedValues[columnName] == "")) {
                console.log("*** Redirecting: ", columnName, " field is required");
                res.json({ "code": 200, "status": "Error", "message": columnName + " field is undefined" });
                logger.error('*** Redirecting: ', columnName, ' field is required');
                return;
            }
            if (receivedValues[columnName] !== undefined && receivedValues[columnName] !== "" && columnName == 'status') {
                if (!status.includes(receivedValues[columnName])) {
                    res.json({ code: 200, status: 'error', message: 'status must be from active/inactive' });
                    return;
                }
            }
        }
        // receivedValues ={}
        var newOffer = offer(receivedValues);
        newOffer.save(function(err, ins) {
            if (!err) {
                res.status(200).json({ message: 'Offer created succesfully' });
                console.log('offer created successfully', ins);
                return;
            } else {
                res.status(400).json({ message: 'Error for offer' });
                console.log('Error for insert into database', err);
                return;
            }
        })
    }
}
exports.getOffer = function(req, res) {
    var id = req.query.id;
    var cust_id = req.query.cust_id;
    if (id) {
        var q = { _id: id };
    } else if (cust_id) {
        var q = { cust_id: cust_id };
    } else {
        res.status(400).json({ message: 'rest_id is required' });
        return;
    }
    offer.find(id).then((data) => {
        res.status(200).json({ message: 'offer get successfully', data: data });
        console.log('data', data);
        return;
    }).catch((e) => {
        res.status(400).json({ message: 'Error for getting offer' });
        console.log('e', e);
        return;
    });
}
exports.updateOffer = function(req, res) {
    receivedValues = req.body
    if (JSON.stringify(receivedValues) === '{}') {
        res.status(400).json({ message: 'Body data is required' });
        return;
    } else {
        var id = req.body.id;
        if (!id) {
            res.status(401).json({ message: 'id is required field' });
            return;
        }
        usercolumns = [
            "rest_id", "name", "description", "image",
            "code", "status"
        ];
        var status = ["active", "inactive"];

        var tmpcolumnName = {};
        for (var iter = 0; iter < usercolumns.length; iter++) {
            columnName = usercolumns[iter];
            if (columnName && usercolumns.includes(columnName)) {
                if (receivedValues[columnName] != undefined) {
                    tmpcolumnName[columnName] = receivedValues[columnName];
                }
                if (receivedValues[columnName] !== undefined && receivedValues[columnName] !== "" && columnName == 'status') {
                    if (!status.includes(receivedValues[columnName])) {
                        res.json({ code: 200, status: 'error', message: 'status must be from active/inactive' });
                        return;
                    }
                }
            }
        }
        orders.findByIdAndUpdate(
            id,
            tmpcolumnName,
            function(err, data) {
                if (!err) {
                    res.status(200).json({ status: true, message: 'Update successfully' });
                    return;
                } else {
                    res.status(400).json({ status: false, message: 'Error for update home order' });
                    console.log('Error', err);
                    return;
                }
            });
    }
}


// ORDER DETAILS
exports.addOrder = function(req, res) {
    receivedValues = req.body;
    if (JSON.stringify(receivedValues) === '{}') {
        res.status(400).json({ message: 'Body data is required' });
        return;
    } else {
        usercolumns = [
            "rest_id", "cust_id", "date", "details", "cost",
            "type", "coupon", "pay_status"
        ];
        for (var iter = 0; iter < usercolumns.length; iter++) {
            columnName = usercolumns[iter];
            if ((receivedValues[columnName] == undefined || receivedValues[columnName] == "")) {
                console.log("*** Redirecting: ", columnName, " field is required");
                res.json({ "code": 200, "status": "Error", "message": columnName + " field is undefined" });
                logger.error('*** Redirecting: ', columnName, ' field is required');
                return;
            }
        }
        // receivedValues ={}
        var newTackOrder = orders(receivedValues);
        newTackOrder.save(function(err, ins) {
            if (!err) {
                res.status(200).json({ message: 'Order tack successfully succesfully' });
                console.log('Order tack successfully successfully', ins);
                return;
            } else {
                res.status(400).json({ message: 'Error for Order' });
                console.log('Error for insert into database', err);
                return;
            }
        })
    }
}
exports.getOrder = function(req, res) {
    var id = req.query.id;
    var cust_id = req.query.cust_id;
    if (id) {
        var q = { _id: id };
    } else if (cust_id) {
        var q = { cust_id: cust_id };
    } else {
        res.status(400).json({ message: 'cust_id is required' });
        return;
    }
    orders.find(q).then((data) => {
        res.status(200).json({ message: 'orders get successfully', data: data });
        console.log('data', data);
        return;
    }).catch((e) => {
        res.status(400).json({ message: 'Error for getting orders' });
        console.log('e', e);
        return;
    });
}
exports.updateOrder = function(req, res) {
    receivedValues = req.body;
    if (JSON.stringify(receivedValues) === '{}') {
        res.status(400).json({ message: 'Body data is required' });
        return;
    } else {
        var id = req.body.order_id;
        if (!id) {
            res.status(401).json({ message: 'order id is required field' });
            return;
        }
        usercolumns = [
            "rest_id", "cust_id", "date", "details", "cost",
            "type", "coupon", "pay_status"
        ];
        var tmpcolumnName = {};
        for (var iter = 0; iter < usercolumns.length; iter++) {
            columnName = usercolumns[iter];
            if (columnName && usercolumns.includes(columnName)) {
                if (receivedValues[columnName] != undefined) {
                    tmpcolumnName[columnName] = receivedValues[columnName];
                }
            }
        }
        console.log('updateString', tmpcolumnName);
        orders.findByIdAndUpdate(
            id,
            tmpcolumnName,
            function(err, data) {
                if (!err) {
                    res.status(200).json({ status: true, message: 'Update successfully' });
                    return;
                } else {
                    res.status(400).json({ status: false, message: 'Error for update home order' });
                    console.log('Error', err);
                    return;
                }
            });
    }
}


// HOME DELIVERY ORDERS
exports.addHomeOrder = function(req, res) {
    receivedValues = req.body //DATA FROM WEB
    if (JSON.stringify(receivedValues) === '{}') {
        res.status(400).json({ message: 'Body data is required' });
        return;
    } else {
        var updateString = "";
        console.log("*** Validating User Details... ");
        usercolumns = [
            "cust_id", "order_id", "time", "address",
            "comments", "status"
        ];
        var status = ["placed", "ready", "rejected", "outforDelivery", "completed"];
        var dbValues = []
        var tmpcolumnName = [];
        var is_update = false;
        for (var iter = 0; iter < usercolumns.length; iter++) {
            columnName = usercolumns[iter];
            if ((receivedValues[columnName] == undefined || receivedValues[columnName] == "")) {
                console.log("*** Redirecting: ", columnName, " field is required");
                res.json({ "code": 200, "status": "Error", "message": columnName + " field is undefined" });
                logger.error('*** Redirecting: ', columnName, ' field is required');
                return;
            }
            if (receivedValues[columnName] !== undefined && receivedValues[columnName] !== "" && columnName == 'status') {
                if (!status.includes(receivedValues[columnName])) {
                    res.json({ code: 200, status: 'error', message: 'status must be from placed/ready/rejected/outforDelivery/completed' });
                    return;
                }
            }
            dbValues[iter] = receivedValues[columnName];
        }
        // receivedValues ={}
        var newTackOrder = home_order(receivedValues);

        newTackOrder.save(function(err, ins) {
            if (!err) {
                res.status(200).json({ message: 'Order tack successfully succesfully' });
                console.log('Order tack successfully successfully', ins);
                return;
            } else {
                res.status(400).json({ message: 'Error for Order' });
                console.log('Error for insert into database', err);
                return;
            }
        })
    }
}
exports.getHomeOrder = function(req, res) {
    var id = req.query.id;
    var cust_id = req.query.cust_id;
    if (id) {
        var q = { _id: id };
    } else if (cust_id) {
        var q = { cust_id: cust_id };
    } else {
        res.status(400).json({ message: 'cust_id is required' });
        return;
    }
    home_order.find(q).then((data) => {
        res.status(200).json({ message: 'take_order get successfully', data: data });
        console.log('data', data);
        return;
    }).catch((e) => {
        res.status(400).json({ message: 'Error for getting table_reservations' });
        console.log('e', e);
        return;
    });
}
exports.updateHomeOrder = function(req, res) {
    receivedValues = req.body
    if (JSON.stringify(receivedValues) === '{}') {
        res.status(400).json({ message: 'Body data is required' });
        return;
    } else {
        var id = req.body.homeOrder_id;
        if (!id) {
            res.status(401).json({ message: 'homeOrder_id is required field' });
            return;
        }
        usercolumns = [
            "cust_id", "order_id", "time", "address",
            "comments", "status"
        ];
        var status = ["placed", "ready", "rejected", "outforDelivery", "completed"];

        var tmpcolumnName = {};
        for (var iter = 0; iter < usercolumns.length; iter++) {
            columnName = usercolumns[iter];
            if (columnName && usercolumns.includes(columnName)) {
                if (receivedValues[columnName] != undefined) {
                    tmpcolumnName[columnName] = receivedValues[columnName];
                }
                if (receivedValues[columnName] !== undefined && receivedValues[columnName] !== "" && columnName == 'status') {
                    if (!status.includes(receivedValues[columnName])) {
                        res.json({ code: 200, status: 'error', message: 'status must be from placed/ready/rejected/outforDelivery/completed' });
                        return;
                    }
                }
            }
        }
        console.log('updateString', tmpcolumnName);
        home_order.findByIdAndUpdate(
            id,
            tmpcolumnName,
            function(err, data) {
                if (!err) {
                    res.status(200).json({ status: true, message: 'Update successfully' });
                    return;
                } else {
                    res.status(400).json({ status: false, message: 'Error for update home order' });
                    console.log('Error', err);
                    return;
                }
            });
    }
}


// TAKE AWAY ORDERS
exports.addHomeOrder = function(req, res) {
    receivedValues = req.body //DATA FROM WEB
    if (JSON.stringify(receivedValues) === '{}') {
        res.status(400).json({ message: 'Body data is required' });
        return;
    } else {
        var updateString = "";
        console.log("*** Validating User Details... ");
        usercolumns = [
            "cust_id", "order_id", "time",
            "comments", "status"
        ];
        var status = ["placed", "ready", "rejected", "completed"];
        for (var iter = 0; iter < usercolumns.length; iter++) {
            columnName = usercolumns[iter];
            if ((receivedValues[columnName] == undefined || receivedValues[columnName] == "")) {
                console.log("*** Redirecting: ", columnName, " field is required");
                res.json({ "code": 200, "status": "Error", "message": columnName + " field is undefined" });
                logger.error('*** Redirecting: ', columnName, ' field is required');
                return;
            }
            if (receivedValues[columnName] !== undefined && receivedValues[columnName] !== "" && columnName == 'status') {
                if (!status.includes(receivedValues[columnName])) {
                    res.json({ code: 200, status: 'error', message: 'status must be from Requested/Confirmed/Rejected/Completed' });
                    return;
                }
            }
        }
        // receivedValues ={}
        var newTackOrder = take_order(receivedValues);

        newTackOrder.save(function(err, ins) {
            if (!err) {
                res.status(200).json({ message: 'Order tack successfully succesfully' });
                console.log('Order tack successfully successfully', ins);
                return;
            } else {
                res.status(400).json({ message: 'Error for Order' });
                console.log('Error for insert into database', err);
                return;
            }
        })
    }
}
exports.getHomeOrder = function(req, res) {
    var id = req.query.id;
    var cust_id = req.query.cust_id;

    if (id) {
        var q = { _id: id };
    } else if (cust_id) {
        var q = { cust_id: cust_id };
    } else {
        res.status(400).json({ message: 'cust_id is required' });
        return;
    }
    take_order.find(q).then((data) => {
        res.status(200).json({ message: 'take_order get successfully', data: data });
        console.log('data', data);
        return;
    }).catch((e) => {
        res.status(400).json({ message: 'Error for getting table_reservations' });
        console.log('e', e);
        return;
    });
}
exports.updateHomeOrder = function(req, res) {
    receivedValues = req.body
    if (JSON.stringify(receivedValues) === '{}') {
        res.status(400).json({ message: 'Body data is required' });
        return;
    } else {
        var id = req.body.id;
        if (!id) {
            res.status(401).json({ message: 'id is required field' });
            return;
        }
        usercolumns = [
            "cust_id", "order_id", "time",
            "comments", "status"
        ];
        var status = ["placed", "ready", "rejected", "completed"];

        var tmpcolumnName = {};
        for (var iter = 0; iter < usercolumns.length; iter++) {
            columnName = usercolumns[iter];
            if (columnName && usercolumns.includes(columnName)) {
                if (receivedValues[columnName] != undefined) {
                    tmpcolumnName[columnName] = receivedValues[columnName];
                }
                if (receivedValues[columnName] !== undefined && receivedValues[columnName] !== "" && columnName == 'status') {
                    if (!status.includes(receivedValues[columnName])) {
                        res.json({ code: 200, status: 'error', message: 'status must be from placed/ready/rejected/completed' });
                        return;
                    }
                }
            }
        }
        console.log('updateString', tmpcolumnName);
        take_order.findByIdAndUpdate(
            id,
            tmpcolumnName,
            function(err, data) {
                if (!err) {
                    res.status(200).json({ status: true, message: 'Update successfully' });
                    return;
                } else {
                    res.status(400).json({ status: false, message: 'Error for update take order' });
                    console.log('Error', err);
                    return;
                }
            });
    }
}

// TAKE AWAY ORDERS
exports.addTakeOrder = function(req, res) {
    receivedValues = req.body //DATA FROM WEB
    if (JSON.stringify(receivedValues) === '{}') {
        res.status(400).json({ message: 'Body data is required' });
        return;
    } else {
        var updateString = "";
        console.log("*** Validating User Details... ");
        usercolumns = [
            "cust_id", "order_id", "time",
            "comments", "status"
        ];
        var status = ["placed", "ready", "rejected", "completed"];
        for (var iter = 0; iter < usercolumns.length; iter++) {
            columnName = usercolumns[iter];
            if ((receivedValues[columnName] == undefined || receivedValues[columnName] == "")) {
                console.log("*** Redirecting: ", columnName, " field is required");
                res.json({ "code": 200, "status": "Error", "message": columnName + " field is undefined" });
                logger.error('*** Redirecting: ', columnName, ' field is required');
                return;
            }
            if (receivedValues[columnName] !== undefined && receivedValues[columnName] !== "" && columnName == 'status') {
                if (!status.includes(receivedValues[columnName])) {
                    res.json({ code: 200, status: 'error', message: 'status must be from Requested/Confirmed/Rejected/Completed' });
                    return;
                }
            }
        }
        // receivedValues ={}
        var newTackOrder = take_order(receivedValues);

        newTackOrder.save(function(err, ins) {
            if (!err) {
                res.status(200).json({ message: 'Order tack successfully succesfully' });
                console.log('Order tack successfully successfully', ins);
                return;
            } else {
                res.status(400).json({ message: 'Error for Order' });
                console.log('Error for insert into database', err);
                return;
            }
        })
    }
}
exports.getTakeOrder = function(req, res) {
    var cust_id = req.query.cust_id;
    var id = req.query.id;
    if (id) {
        var _q = { _id: id };
    } else if (cust_id) {
        var _q = { cust_id: cust_id };
    } else {
        res.status(400).json({ message: 'id or cust_id is required' });
        return;
    }
    take_order.find(_q).then((data) => {
        res.status(200).json({ message: 'take_order get successfully', data: data });
        console.log('data', data);
        return;
    }).catch((e) => {
        res.status(400).json({ message: 'Error for getting table_reservations' });
        console.log('e', e);
        return;
    });
}
exports.updateTakeOrder = function(req, res) {
    receivedValues = req.body
    if (JSON.stringify(receivedValues) === '{}') {
        res.status(400).json({ message: 'Body data is required' });
        return;
    } else {
        var id = req.body.id;
        if (!id) {
            res.status(401).json({ message: 'id is required field' });
            return;
        }
        usercolumns = [
            "cust_id", "order_id", "time",
            "comments", "status"
        ];
        var status = ["placed", "ready", "rejected", "completed"];

        var tmpcolumnName = {};
        for (var iter = 0; iter < usercolumns.length; iter++) {
            columnName = usercolumns[iter];
            if (columnName && usercolumns.includes(columnName)) {
                if (receivedValues[columnName] != undefined) {
                    tmpcolumnName[columnName] = receivedValues[columnName];
                }
                if (receivedValues[columnName] !== undefined && receivedValues[columnName] !== "" && columnName == 'status') {
                    if (!status.includes(receivedValues[columnName])) {
                        res.json({ code: 200, status: 'error', message: 'status must be from placed/ready/rejected/completed' });
                        return;
                    }
                }
            }
        }
        console.log('updateString', tmpcolumnName);
        take_order.findByIdAndUpdate(
            id,
            tmpcolumnName,
            function(err, data) {
                if (!err) {
                    res.status(200).json({ status: true, message: 'Update successfully' });
                    return;
                } else {
                    res.status(400).json({ status: false, message: 'Error for update take order' });
                    console.log('Error', err);
                    return;
                }
            });
    }
}

// Table Reservations
exports.addTableRese = function(req, res) {
    receivedValues = req.body //DATA FROM WEB
    if (JSON.stringify(receivedValues) === '{}') {
        res.status(400).json({ message: 'Body data is required' });
        return;
    } else {
        var updateString = "";
        console.log("*** Validating User Details... ");
        usercolumns = [
            "cust_id", "date", "time", "seats",
            "comments", "status"
        ];
        var status = ["requested", "confirmed", "rejected", "completed"];
        var dbValues = []
        var tmpcolumnName = [];
        var is_update = false;
        for (var iter = 0; iter < usercolumns.length; iter++) {
            columnName = usercolumns[iter];
            if ((receivedValues[columnName] == undefined || receivedValues[columnName] == "")) {
                console.log("*** Redirecting: ", columnName, " field is required");
                res.json({ "code": 200, "status": "Error", "message": columnName + " field is undefined" });
                logger.error('*** Redirecting: ', columnName, ' field is required');
                return;
            }
            if (receivedValues[columnName] !== undefined && receivedValues[columnName] !== "" && columnName == 'status') {
                if (!status.includes(receivedValues[columnName])) {
                    res.json({ code: 200, status: 'error', message: 'status must be from Requested/Confirmed/Rejected/Completed' });
                    return;
                }
            }
            dbValues[iter] = receivedValues[columnName];
        }
        var newTable = table_reservations(receivedValues);
        newTable.save(function(err, ins) {
            if (!err) {
                res.status(200).json({ message: 'Table reserved succesfully' });
                console.log('data inserted successfully', ins);
                return;
            } else {
                res.status(400).json({ message: 'Error for reserve table' });
                console.log('Error for insert into database', err);
                return;
            }
        })
    }
}
exports.getTableRese = function(req, res) {
    var id = req.query.id;
    var cust_id = req.query.cust_id;
    if (id) {
        var _q = { _id: id };
    } else if (cust_id) {
        var _q = { cust_id: cust_id };
    } else {
        res.status(400).json({ message: 'id or cust_id is required' });
        return;
    }

    table_reservations.find(_q).then((data) => {
        res.status(200).json({ message: 'table_reservations get successfully', data: data });
        console.log('data', data);
        return;
    }).catch((e) => {
        res.status(400).json({ message: 'Error for getting table_reservations' });
        console.log('e', e);
        return;
    });
}
exports.updateTableRese = function(req, res) {
    receivedValues = req.body
    if (JSON.stringify(receivedValues) === '{}') {
        res.status(400).json({ message: 'Body data is required' });
        return;
    } else {
        var id = req.body.id;
        if (!id) {
            res.status(401).json({ message: 'od is required field' });
            return;
        }
        usercolumns = [
            "cust_id", "date", "time", "seats",
            "comments", "status"
        ];
        var status = ["requested", "confirmed", "rejected", "completed"];

        var tmpcolumnName = {};
        for (var iter = 0; iter < usercolumns.length; iter++) {
            columnName = usercolumns[iter];
            if (columnName && usercolumns.includes(columnName)) {
                if (receivedValues[columnName] != undefined) {
                    tmpcolumnName[columnName] = receivedValues[columnName];
                }
                if (receivedValues[columnName] !== undefined && receivedValues[columnName] !== "" && columnName == 'status') {
                    if (!status.includes(receivedValues[columnName])) {
                        res.json({ code: 200, status: 'error', message: 'status must be from Requested/Confirmed/Rejected/Completed' });
                        return;
                    }
                }
            }
        }
        console.log('updateString', tmpcolumnName);
        table_reservations.findByIdAndUpdate(
            id,
            tmpcolumnName,
            function(err, data) {
                if (!err) {
                    res.status(200).json({ status: true, message: 'Update successfully' });
                    return;
                } else {
                    res.status(400).json({ status: false, message: 'Error for update table reservation' });
                    console.log('Error', err);
                    return;
                }
            });
    }
}

// Customers
exports.addCustomers = function(req, res) {
    receivedValues = req.body //DATA FROM WEB
    if (JSON.stringify(receivedValues) === '{}') {
        res.status(400).json({ message: 'Body data is required' });
        return;
    } else {
        var updateString = "";
        console.log("*** Validating User Details... ");
        usercolumns = [
            "rest_id", "name", "email", "phone", "address",
            "photo", "username", "password"
        ];
        var dbValues = [];
        var tmpcolumnName = [];
        var is_update = false;
        //FOR VALIDATING VALUES BEFORE SUBMISSION
        for (var iter = 0; iter < usercolumns.length; iter++) {
            columnName = usercolumns[iter];
            if ((receivedValues[columnName] == undefined || receivedValues[columnName] == "")) {
                console.log("*** Redirecting: ", columnName, " field is required");
                res.json({ "code": 200, "status": "Error", "message": columnName + " field is undefined" });
                logger.error('*** Redirecting: ', columnName, ' field is required');
                return;
            } else if (receivedValues[columnName] !== undefined && receivedValues[columnName] !== "" && columnName == 'password') {
                receivedValues.password = bcrypt.hashSync(receivedValues.password, bcrypt.genSaltSync(8))
            }
            dbValues[iter] = receivedValues[columnName];
        }
        // receivedValues ={}
        var newCust = customers(receivedValues);

        newCust.save(function(err, ins) {
            if (!err) {
                res.status(200).json({ message: 'Customers added succesfully' });
                console.log('data inserted successfully', ins);
                return;
            } else {
                res.status(400).json({ message: 'Error for create new customers' });
                console.log('Error for insert into database', err);
                return;
            }
        })
    }
}
exports.getCustomers = function(req, res) {
    var id = req.query.id;
    if (id) {
        var _q = { _id: id };
    } else {
        var _q = {};
    }
    customers.find(_q).then((data) => {
        res.status(200).json({ message: 'customers data get successfully ', data: data });
        console.log('data', data);
        return;
    }).catch((e) => {
        res.status(400).json({ message: 'Error for getting message from customers' });
        console.log('e', e);
        return;
    });
}
exports.updateCustomers = function(req, res) {
    receivedValues = req.body
    if (JSON.stringify(receivedValues) === '{}') {
        res.status(400).json({ message: 'Body data is required' });
        return;
    } else {
        var cust_id = req.body.cust_id;
        if (!cust_id) {
            res.status(401).json({ message: 'cust_id is required field' });
            return;
        }
        usercolumns = [
            "name", "email", "phone", "address",
            "photo", "username", "password"
        ];
        var tmpcolumnName = {};
        for (var iter = 0; iter < usercolumns.length; iter++) {
            columnName = usercolumns[iter];
            if (columnName && usercolumns.includes(columnName)) {
                if (receivedValues[columnName] != undefined) {
                    tmpcolumnName[columnName] = receivedValues[columnName];
                }
            }
        }
        console.log('updateString', tmpcolumnName);
        customers.findByIdAndUpdate(
            cust_id,
            tmpcolumnName,
            function(err, data) {
                if (!err) {
                    res.status(200).json({ status: true, message: 'Update successfully' });
                    return;
                } else {
                    res.status(400).json({ status: false, message: 'Error for update customer' });
                    console.log('Error', err);
                    return;
                }
            });
    }
}
exports.removeCustomers = function(req, res) {
    var cust_id = req.query.id;
    console.log('rest_id', cust_id);
    if (!cust_id) {
        res.status(401).json({ message: 'cust_id is required field' });
        return;
    }
    customers.findByIdAndRemove(
        cust_id,
        function(err, data) {
            if (!err) {
                res.status(200).json({ status: true, message: 'customer remove successfully' });
                return;
            } else {
                res.status(400).json({ status: false, message: 'Error for remove restaurant' });
                console.log('Error', err);
                return;
            }
        });
}


//3 Menu Items
exports.addMenuItem = function(req, res) {
    receivedValues = req.body
    if (JSON.stringify(receivedValues) === '{}') {
        res.status(400).json({ message: 'Body data is required' });
        return;
    } else {
        var updateString = "";
        console.log("*** Validating User Details... ");
        usercolumns = ["rest_id", "item_name", "item_catagory", "item_image", "item_description", "price", "status"];
        var status = ["available", "not available"]
        var dbValues = [];
        var tmpcolumnName = [];
        var is_update = false;
        //FOR VALIDATING VALUES BEFORE SUBMISSION
        for (var iter = 0; iter < usercolumns.length; iter++) {
            columnName = usercolumns[iter];
            if ((receivedValues[columnName] == undefined || receivedValues[columnName] == "")) {
                console.log("*** Redirecting: ", columnName, " field is required");
                res.json({ "code": 200, "status": "Error", "message": columnName + " field is undefined" });
                logger.error('*** Redirecting: ', columnName, ' field is required');
                return;
            }
            if (receivedValues[columnName] !== undefined && receivedValues[columnName] !== "" && columnName == 'status') {
                console.log('columnName', receivedValues[columnName]);
                if (!status.includes(receivedValues[columnName])) {
                    res.json({ code: 200, status: 'error', message: 'status must be from available or not available' });
                    return;
                }
            }
            dbValues[iter] = receivedValues[columnName];
        }
        // receivedValues ={}
        var newMenuItem = menu_items(receivedValues);

        newMenuItem.save(function(err, ins) {
            if (!err) {
                res.status(200).json({ message: 'Menu item added succesfully' });
                console.log('data inserted successfully', ins);
                return;
            } else {
                res.status(400).json({ message: 'Error for add new menu item' });
                console.log('Error for insert into database', err);
                return;
            }
        })
    }
}
exports.getMenuItem = function(req, res) {
    var id = req.query.id;
    if (id) {
        var query = { _id: id };
    } else {
        var query = {};
    }
    menu_items.find(query).then((data) => {
        res.status(200).json({ message: 'Menu Items get successfully ', data: data });
        console.log('data', data);
        return;
    }).catch((e) => {
        res.status(400).json({ message: 'Error for getting message from Menu Items' });
        console.log('e', e);
        return;
    });
}
exports.updateMenuItem = function(req, res) {
    receivedValues = req.body
    if (JSON.stringify(receivedValues) === '{}') {
        res.status(400).json({ message: 'Body data is required' });
        return;
    } else {
        var id = req.body.id;
        if (!id) {
            res.status(401).json({ message: 'id is required field' });
            return;
        }
        usercolumns = ["item_name", "item_catagory", "item_image", "item_description", "price", "status"];
        var tmpcolumnName = {};
        for (var iter = 0; iter < usercolumns.length; iter++) {
            columnName = usercolumns[iter];
            if (columnName && usercolumns.includes(columnName)) {
                if (receivedValues[columnName] != undefined) {
                    tmpcolumnName[columnName] = receivedValues[columnName];
                }
            }
        }
        menu_items.findByIdAndUpdate(
            id,
            tmpcolumnName,
            function(err, data) {
                if (!err) {
                    res.status(200).json({ status: true, message: 'Update successfully' });
                    return;
                } else {
                    res.status(400).json({ status: false, message: 'Error for update menu item' });
                    console.log('Error', err);
                    return;
                }
            });
    }
}
exports.removeMenuItem = function(req, res) {
    var menuItem_id = req.query.id;
    console.log('menuItem_id', menuItem_id);
    if (!menuItem_id) {
        res.status(401).json({ message: 'menuItem_id is required field' });
        return;
    }
    menu_items.findByIdAndRemove(
        menuItem_id,
        function(err, data) {
            if (!err) {
                res.status(200).json({ status: true, message: 'remove successfully' });
                return;
            } else {
                res.status(400).json({ status: false, message: 'Error for remove menu items' });
                console.log('Error', err);
                return;
            }
        });
}



//2 Menu Catagory
exports.addMenuCat = function(req, res) {
    var category_name = req.body.category_name;
    var rest_id = req.body.rest_id;
    if (!category_name) {
        res.status(400).json({ status: false, message: 'category_name field is required' });
        return;
    }
    if (!rest_id) {
        res.status(400).json({ status: false, message: 'rest_id field is required' });
        return;
    }

    var newMenu = menu_categories({
        rest_id: rest_id,
        category_name: category_name
    });

    newMenu.save(function(err, ins) {
        if (!err) {
            res.status(200).json({ message: 'Menu Category created succesfully' });
            console.log('data inserted successfully', ins);
            return;
        } else {
            res.status(400).json({ message: 'Error for create new Menu Category' });
            console.log('Error for insert into database', err);
            return;
        }
    })
}
exports.getMenuCat = function(req, res) {
    var id = req.query.id;
    if (id) {
        var query = { _id: id };
    } else {
        var query = {};
    }
    menu_categories.find(query).then((data) => {
        res.status(200).json({ message: 'Menu Category data get successfully ', data: data });
        console.log('data', data);
        return;
    }).catch((e) => {
        res.status(400).json({ message: 'Error for getting message from Menu Category' });
        console.log('e', e);
        return;
    });
}
exports.updateMenuCat = function(req, res) {
    var category_name = req.body.category_name;
    var category_id = req.body.category_id;

    if (!category_name) {
        res.status(400).json({ status: false, message: 'category_name field is required' });
        return;
    }
    if (!category_id) {
        res.status(400).json({ status: false, message: 'category_id field is required' });
        return;
    }

    menu_categories.findByIdAndUpdate(
        category_id, { category_name: category_name },
        function(err, data) {
            if (!err) {
                res.status(200).json({ status: true, message: 'Update successfully' });
                return;
            } else {
                res.status(400).json({ status: false, message: 'Error for update restaurant' });
                console.log('Error', err);
                return;
            }
        });
}
exports.removeMenuCat = function(req, res) {
    var category_id = req.query.id;
    console.log('category_id', category_id);
    if (!category_id) {
        res.status(401).json({ message: 'category_id is required field' });
        return;
    }
    menu_categories.findByIdAndRemove(
        category_id,
        function(err, data) {
            if (!err) {
                res.status(200).json({ status: true, message: 'remove successfully' });
                return;
            } else {
                res.status(400).json({ status: false, message: 'Error for remove menu_categories' });
                console.log('Error', err);
                return;
            }
        });
}

// 1. Restaurant
exports.addRestaurant = function(req, res) {
    receivedValues = req.body //DATA FROM WEB
    if (JSON.stringify(receivedValues) === '{}') {
        res.status(400).json({ message: 'Body data is required' });
        return;
    } else {
        var updateString = "";
        console.log("*** Validating User Details... ");
        usercolumns = ["rest_name", "rest_address", "city", "state", "country", "phone",
            "user_id", "password"
        ];
        var dbValues = [];
        var tmpcolumnName = [];
        var is_update = false;
        //FOR VALIDATING VALUES BEFORE SUBMISSION
        for (var iter = 0; iter < usercolumns.length; iter++) {
            columnName = usercolumns[iter];
            if ((receivedValues[columnName] == undefined || receivedValues[columnName] == "")) {
                console.log("*** Redirecting: ", columnName, " field is required");
                res.json({ "code": 200, "status": "Error", "message": columnName + " field is undefined" });
                logger.error('*** Redirecting: ', columnName, ' field is required');
                return;
            } else if (receivedValues[columnName] !== undefined && receivedValues[columnName] !== "" && columnName == 'password') {
                receivedValues.password = bcrypt.hashSync(receivedValues.password, bcrypt.genSaltSync(8))
            }
            dbValues[iter] = receivedValues[columnName];
        }
        // receivedValues ={}
        var newRest = rest_info(receivedValues);

        newRest.save(function(err, ins) {
            if (!err) {
                res.status(200).json({ message: 'Restaurant created succesfully' });
                console.log('data inserted successfully', ins);
                return;
            } else {
                res.status(400).json({ message: 'Error for create new restaurant' });
                console.log('Error for insert into database', err);
                return;
            }
        })
    }
}
exports.getRestaurant = function(req, res) {
    var id = req.query.id;
    if (id) {
        var query = { _id: id };
    } else {
        var query = {};
    }
    rest_info.find(query).then((data) => {
        res.status(200).json({ message: 'restaurant data get successfully ', data: data });
        console.log('data', data);
        return;
    }).catch((e) => {
        res.status(400).json({ message: 'Error for getting message from restaurant' });
        console.log('e', e);
        return;
    });
}
exports.updateRestaurant = function(req, res) {
    receivedValues = req.body
    if (JSON.stringify(receivedValues) === '{}') {
        res.status(400).json({ message: 'Body data is required' });
        return;
    } else {
        var rest_id = req.body.rest_id;
        if (!rest_id) {
            res.status(401).json({ message: 'rest_id is required field' });
            return;
        }
        usercolumns = ["rest_name", "rest_address", "city", "state", "country", "phone",
            "user_id", "password"
        ];
        var tmpcolumnName = {};
        for (var iter = 0; iter < usercolumns.length; iter++) {
            columnName = usercolumns[iter];
            if (columnName && usercolumns.includes(columnName)) {
                if (receivedValues[columnName] != undefined) {
                    tmpcolumnName[columnName] = receivedValues[columnName];
                }
            }
        }
        console.log('updateString', tmpcolumnName);
        rest_info.findByIdAndUpdate(
            rest_id,
            tmpcolumnName,
            function(err, data) {
                if (!err) {
                    res.status(200).json({ status: true, message: 'Update successfully' });
                    return;
                } else {
                    res.status(400).json({ status: false, message: 'Error for update restaurant' });
                    console.log('Error', err);
                    return;
                }
            });
    }
}
exports.removeRestaurant = function(req, res) {
    var rest_id = req.query.id;
    console.log('rest_id', rest_id);
    if (!rest_id) {
        res.status(401).json({ message: 'rest id is required field as query params' });
        return;
    }
    rest_info.findByIdAndRemove(
        rest_id,
        function(err, data) {
            if (!err) {
                res.status(200).json({ status: true, message: 'remove successfully' });
                return;
            } else {
                res.status(400).json({ status: false, message: 'Error for remove restaurant' });
                console.log('Error', err);
                return;
            }
        });
}