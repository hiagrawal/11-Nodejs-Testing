const expect = require('chai').expect;
const sinon = require('sinon');
const mongoose = require('mongoose');

const User = require('../models/user');
const FeedController = require('../controllers/feed');

describe('Feed Controller - Create Post', function(){

    before(function(done){
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
                done();
            })
            .catch(err => {
                console.log(err);
            })
    })

    beforeEach(function(){});
    afterEach(function(){});

    it('should add a created post to the posts of the creator', function(done){
        const req = {
            body: {
                title: 'A Post',
                content: 'This is a Post'
            },
            file:{
                path:'abc'
            },
            userId: '5c0f66b979af55031b34728a'
        };

        const res = {
            status: function(){return this;},
            json: function(){}
        }

        FeedController.createPost(req, res, () => {}).then(savedUser => {
            expect(savedUser).to.have.property('posts');
            expect(savedUser.posts).to.have.length(1);
            done();
        });
    });

    after(function(done){
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
    })

});