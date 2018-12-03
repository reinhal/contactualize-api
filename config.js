'use strict';
require('dotenv').config();
exports.CLIENT_ORIGIN = 'https://contactualize-client.herokuapp.com/';
exports.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://testUser:thinkful925@ds123361.mlab.com:23361/contactualize';
exports.TEST_MONGODB_URI = process.env.TEST_MONGODB_URI || 'mongodb://localhost/contactualize-test';
exports.PORT = process.env.PORT || 8080;
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';