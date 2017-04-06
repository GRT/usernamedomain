var should                = require('should');
var jsonSchema            = require('./custom.json');
var UsernameDomainWrapper = require('../usernamedomain.js').factory({domainSpecDelimiter: null, modelJsonSchema: jsonSchema});



describe('UNTYPED DOMAIN WRAPPER', function(){
  describe('no domain_type basic checks', function(){
     it('its ok', function() {
            UsernameDomainWrapper.should.be.ok();
     });
  });

  describe('no domain_type string create valid input', function() {
     validCheck('valid input', UsernameDomainWrapper.create('jim@bob.com'));
     validCheck('valid spacey input', UsernameDomainWrapper.create('  jim@bob.com  '));
     validCheck('valid internal spacey input', UsernameDomainWrapper.create('jim @ bob.com'));
  });

  describe('no domain_type obj create valid input', function() {
     validCheck('valid input', UsernameDomainWrapper.create({username: 'jim', domain:'bob.com'}));
     validCheck('valid input', UsernameDomainWrapper.create({username: '  jim  ', domain:' bob.com  '}));
  });

  describe('no domain_type invalid object input', function() {
     invalidCheck('obj input both null', UsernameDomainWrapper.create({username: null, domain: null}));
     invalidCheck('obj input username null', UsernameDomainWrapper.create({username: null, domain: 'blerk'}));
     invalidCheck('obj input domain null', UsernameDomainWrapper.create({username: 'foo', domain: null}));

     invalidCheck('obj input both empty', UsernameDomainWrapper.create({username: '', domain: ''}));
     invalidCheck('obj input username empty', UsernameDomainWrapper.create({username: '', domain: 'blerk'}));
     invalidCheck('obj input domain empty', UsernameDomainWrapper.create({username: 'foo', domain: ''}));

     invalidCheck('obj input both spaces', UsernameDomainWrapper.create({username: '  ', domain: '    '}));
     invalidCheck('obj input username spaces', UsernameDomainWrapper.create({username: '     ', domain: 'blerk'}));
     invalidCheck('obj input domain spaces', UsernameDomainWrapper.create({username: 'foo', domain: '   '}));
  });

  describe('no domain_type invalid object input', function() {
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
     it('raw check', function(){
        userdomain.getRaw().should.be.equal('jim@bob.com');
     });
   });
}

function invalidCheck(testname, userdomain) {
    it(testname, function(){
      userdomain.isValid().should.be.false();
      should(userdomain.getUsername()).be.exactly(null);
      should(userdomain.getDomain()).be.exactly(null);
      should(userdomain.getRaw()).be.exactly(null);
           
    });
}
