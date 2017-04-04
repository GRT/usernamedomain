var should  = require('should');
var UsernameDomainWrapper = require('../usernamedomain.js').UsernameDomainWrapper;

describe('DEFAULT WRAPPER', function(){
  describe('default basic checks', function(){
     it('its ok', function() {
            UsernameDomainWrapper.should.be.ok();
     });
  });
  
  describe('default string create valid input', function() {
     validCheck('valid input', UsernameDomainWrapper.create('jim@site:bob.com'));
     validCheck('valid spacey input', UsernameDomainWrapper.create('  jim@site:bob.com  '));
     validCheck('valid internal spacey input', UsernameDomainWrapper.create('jim @ site: bob.com'));
  });
  
  describe('default obj create valid input', function() {
     validCheck('valid input', UsernameDomainWrapper.create({username: 'jim', domain_type: 'site', domain:'bob.com'}));
     validCheck('valid input', UsernameDomainWrapper.create({username: '  jim  ', domain_type: ' site ',  domain:' bob.com  '}));
  });
  
  describe('default invalid object input', function() {
     invalidCheck('obj input all null', UsernameDomainWrapper.create({username: null, domain_type: null, domain: null}));
     invalidCheck('obj input username null', UsernameDomainWrapper.create({username: null, domain_type: 'site', domain: 'bob.com'}));
     invalidCheck('obj input domain null', UsernameDomainWrapper.create({username: 'foo', domain_type: 'site', domain: null}));
     invalidCheck('obj input domain type null', UsernameDomainWrapper.create({username: 'foo', domain_type: null, domain: 'bob.com'}));
  
     invalidCheck('obj input all empty', UsernameDomainWrapper.create({username: '', domain_type: '', domain: ''}));
     invalidCheck('obj input username empty', UsernameDomainWrapper.create({username: '', domain_type: 'site', domain: 'bob.com'}));
     invalidCheck('obj input domain empty', UsernameDomainWrapper.create({username: 'foo', domain_type: 'site', domain: ''}));
     invalidCheck('obj input domain type empty', UsernameDomainWrapper.create({username: 'foo', domain_type: '', domain: 'bob.com'}));
  
     invalidCheck('obj input all spaces', UsernameDomainWrapper.create({username: '  ', domain: '    ', domain_type: '    '}));
     invalidCheck('obj input username spaces', UsernameDomainWrapper.create({username: '     ', domain_type: 'site', domain: 'blerk'}));
     invalidCheck('obj input domain spaces', UsernameDomainWrapper.create({username: 'foo', domain_type: 'site', domain: '   '}));
     invalidCheck('obj input domain type spaces', UsernameDomainWrapper.create({username: 'foo', domain_type: '   ', domain: 'bob.com'}));

     invalidCheck('obj input domain type missing', UsernameDomainWrapper.create({username: 'foo', domain: 'bob.com'}));
  });

  describe('default invalid object input', function() {
     invalidCheck('string input null', UsernameDomainWrapper.create(null));
     invalidCheck('string input undef', UsernameDomainWrapper.create({}['foo']));
     invalidCheck('numeric input', UsernameDomainWrapper.create(4));
     invalidCheck('bool input', UsernameDomainWrapper.create(true));
  });
});




function validCheck(testname, userdomain) {
   describe(testname, function(){
     it('is valid check', function(){
        userdomain.isValid().should.be.true();
     });
     it('username check', function(){
        userdomain.getUsername().should.be.equal('jim');
     });
     it('domain check', function(){
        userdomain.getDomain().should.be.equal('bob.com');
     });
     it('domain type check', function(){
        userdomain.getDomainType().should.be.equal('site');
     });
     it('raw check', function(){
        userdomain.getRaw().should.be.equal('jim@site:bob.com');
     });
   });
}

function invalidCheck(testname, userdomain) {
    it(testname, function(){
      userdomain.isValid().should.be.false();
      should(userdomain.getUsername()).be.exactly(null);
      should(userdomain.getDomain()).be.exactly(null);
      should(userdomain.getDomainType()).be.exactly(null);
      should(userdomain.getRaw()).be.exactly(null);
           
    });
}