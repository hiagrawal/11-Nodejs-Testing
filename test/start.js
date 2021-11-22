const expect = require('chai').expect;

describe('Sample Test case to understand the Testing basics', function(){
    it('should add numbers correctly', function(){
        const num1 = 2;
        const num2 = 3;
        expect(num1+num2).to.equal(5);
    });
});