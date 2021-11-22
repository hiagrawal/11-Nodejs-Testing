const expect = require('chai').expect;
const sinon = require('sinon');

const User = require('../models/user');
const AuthController = require('../controllers/auth');

describe('Auth controller - Login', function(){

    if('should throw an error status 500 if accessing the database fails', function(){
        sinon.stub(User, 'findOne');
        //we are trying to check here that when we try to access the database, it shoudf fail so it throws an error
        User.findOne.throws();

        expect(AuthController.login)

        User.findOne.restore();
    });

});