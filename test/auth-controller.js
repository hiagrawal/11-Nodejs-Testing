const expect = require('chai').expect;
const sinon = require('sinon');
const mongoose = require('mongoose');

const User = require('../models/user');
const AuthController = require('../controllers/auth');

describe('Auth Controller - Login', function(){

    it('should throw an error status 500 if accessing the database fails', function(done){
        sinon.stub(User, 'findOne');
        //we are trying to check here that when we try to access the database, it should fail so it throws an error
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
                    posts: [],
                    _id: '5c0f66b979af55031b34728a'
                });
                return user.save();
            })
            .then(()=>{
                const req = {userId: '5c0f66b979af55031b34728a'};
                const res = {
                    statusCode: 500,
                    userStatus: null,
                    status: function(code){
                        this.statusCode = code;
                        return this; //this should be returned else it would fail as it will not be able to retrieve the value
                    },
                    json: function(data){
                        this.userStatus = data.status;
                    }
                }
                //Keep in mind.. we are able to use 'then' on calling method coz async await by default returns a promise.
                //if we would have used promises for asynchronous calling instead of async await then we would not be able to use 'then'
                AuthController.getStatus(req, res, () => {}).then(result => {
                    expect(res.statusCode).to.be.equal(200);
                    expect(res.userStatus).to.be.equal('I am new!');

                //one thing is, once we run npm test, it does not quit the process automatically.
                //and the reason for that is.. done detects if all processes are done executing and it finds that the mongodb is still running
                //so once we are done executing our test cases, we disconnect to the db and then call 'done'

                //also, once we are done executing, delete data from the database else it might be an issue like in our case if we run the test
                //again, it throws an error as user with the id already exists
                    User.deleteMany({}).then(() =>{
                        mongoose.disconnect().then(()=>{
                            done();
                        })
                    });  
                });
            })
            .catch(err => {
                console.log(err);
            })

    })

});