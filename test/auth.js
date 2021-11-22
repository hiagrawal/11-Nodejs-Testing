const expect = require('chai').expect;

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
})
