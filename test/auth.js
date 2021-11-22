const expect = require('chai').expect;
const jwt = require('jsonwebtoken');
const sinon = require('sinon');

const authMiddleware = require('../middleware/is-auth');

describe('Auth Middleware', function(){
    it('should throw an error when authentication header not found', function(){
        const req = {
            get: function(){
                return null;
            }
        }
        //this wil fail as we should not be calling the function. 
        //we should just bind the function that pass the reference of function and chai mocha will execute it on its own
        //expect(authMiddleware(req, {}, () => {})).to.throw('Not authenticated.');
    
        expect(authMiddleware.bind(this, req, {}, () => {})).to.throw('Not authenticated.');
    });
    
    it('should throw an error if the authorization header is only one string', function(){
        const req = {
            get: function(){
                return 'xyz';
            }
        }
       
        expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
    });   
    
    it('should throw an error if the token can not be verfied', function(){
        const req = {
            get: function(){
                return 'Bearer xyz';
            }
        }
       
        expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
    });   
    it('should yield a userId after decoding the token', function(){
        const req = {
            get: function(){
                return 'Bearer ghghwytdghvchs';
            }
        }
        //to mock a function in our test case, to test one scenario wherein we get userId from verify method, 
        //we can replace the original verify method with the one in our test case. so whenevr it exceutes the authMiddleware, 
        //it takes the verify method what we have defined in our test case

        //the down sight of this is.. it replaces verify method globally so if we have scenario where we want to execute the
        //actual verify method defined in middleware in any test case written after this test case 
        //(that is after it has done replacing, test cases written before this test case would not be impacted), 
        //we will never be able to get that and for that we can use third party pkgs to mock a function

        jwt.verify = function(){
            return {userid: 'abc'};
        }
        authMiddleware(req, {}, () => {});
        expect(req).to.have.property('userId');
    }); 
     
    //this now test case will fail bcz we are expecting verify method to not succeed and return decodedToken undefined which will throw an error
    //but since we have replaced verify method in above test case, the same will executed here and will have userId
    it('should throw an error if the token can not be verfied', function(){
        const req = {
            get: function(){
                return 'Bearer xyz';
            }
        }
        
        //this will fail
        //expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
    });  

    //using the correct way of stubbing wherein we can restore as well once done
    it('should yield a userId after decoding the token', function(){
        const req = {
            get: function(){
                return 'Bearer ghghwytdghvchs';
            }
        }
        //we use sinon.stub method and pass the object/paramter that has to stub as first argumnet and then it's method as second argument
        //this returns an empty object, we can leave it as it is or set it to any value using 'returns' method provided by sinon on teh method called
        //we can also check if this jwt verify method has been called in actual auth middlware by using 'called' property
        //and then restore as well using 'restore' method
        sinon.stub(jwt, 'verify');
        jwt.verify.returns({userId: 'abc'});
        authMiddleware(req, {}, () => {});
        expect(jwt.verify.called).to.be.true;
        expect(req).to.have.property('userId');
        expect(req).to.have.property('userId', 'abc');
        jwt.verify.restore();
    });     
})
