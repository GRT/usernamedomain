var should  = require('should');
var UsernameDomainWrapper = require('../usernamedomain.js').factory({delimiter: '-'});

describe('basic checks #Custom', function(){
   it('its ok', function() {
          UsernameDomainWrapper.should.be.ok();
   });
});

describe('custom string valid', function() {
    var ud = UsernameDomainWrapper.create('foo-bar');
    it('is valid', function(){
           ud.isValid().should.be.true();
    });
    it('raw uses custom delimiter', function(){
           ud.getRaw().should.be.equal('foo-bar');
    });
});


describe('custom object valid', function() {
    var ud = UsernameDomainWrapper.create({username: 'foo', domain: 'bar'});
    it('is valid', function(){
           ud.isValid().should.be.true();
    });
    it('raw uses custom delimiter', function(){
           ud.getRaw().should.be.equal('foo-bar');
    });
});