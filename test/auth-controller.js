const expect = require('chai').expect;
const sinon = require('sinon');
const mongoose = require('mongoose');

const User = require('../models/user');
const AuthController = require('../controllers/auth');

describe('Auth Controller - Login', function(){

    it('should throw an error status 500 if accessing the database fails', function(done){
        sinon.stub(User, 'findOne');
        //we are trying to check here that when we try to access the database, it shoudf fail so it throws an error
        User.findOne.throws();

        const req = {
            body: {
                email: 'test@test.com',
                password: 'tester'
            }
        };

        AuthController.login(req, {}, () => {}).then(result => {
            //console.log(result);
            expect(result).to.be.an('error');
            expect(result).to.have.property('statusCode', 500);
            done();
        });

        User.findOne.restore();
    });

    it('should send a response with a valid user status for an existing user', function(done){
        mongoose.connect('mongodb+srv://MongoDbUser:MongoDbUser@cluster0.kij6e.mongodb.net/test-RESTAPI?retryWrites=true&w=majority')
            .then(result => {
                const user = new User({
                    email: 'test@test.com',
                    password: 'tester',
                    name: 'Test',
                    posts: []
                });
                return user.save();
            })
            .then(()=>{

            })
            .catch(err => {
                console.log(err);
            })

    })

});