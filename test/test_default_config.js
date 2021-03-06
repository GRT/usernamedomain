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


  describe('schema checks', function() {
     invalidCheck('unknown domain type str', UsernameDomainWrapper.create('joe@tribe:foo.com'));
     invalidCheck('unknown domain type obj', UsernameDomainWrapper.create({username: 'joe', domain_type: 'tribe', domain: 'foo.com'}));

     invalidCheck('bad input obj', UsernameDomainWrapper.create({username: 'j#oe', domain_type: 'site', domain: 'foo.com'}));
     invalidCheck('bad input obj2', UsernameDomainWrapper.create({username: 'joe', domain_type: 'site', domain: 'foo~com'}));
     invalidCheck('bad input str', UsernameDomainWrapper.create('joe@site:(foo.com'));
     invalidCheck('bad input str2', UsernameDomainWrapper.create('joe@site:$foo.com'));

     invalidCheck('too long user', UsernameDomainWrapper.create('joeyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy@site:foo.com'));
     invalidCheck('too long domain', UsernameDomainWrapper.create('joe@site:fooIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII.com'));
     invalidCheck('too long user, obj', UsernameDomainWrapper.create({username: 'joeUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU', domain_type: 'site', domain: 'foo.com'}));
     invalidCheck('too long user, obj', UsernameDomainWrapper.create({username: 'joe', domain_type: 'site', domain: 'foo.comZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ'}));

     var opts = {username: 'john.jacob-jingleheimer_schmidt_the3rd', domain_type: 'classcode', domain: '123-111.abc_def'};
     validCheck('classcode/uppercase type str', UsernameDomainWrapper.create('John.Jacob-Jingleheimer_Schmidt_the3rd@classcode:123-111.Abc_Def'), opts);
     validCheck('classcode/uppercase type obj', UsernameDomainWrapper.create({username: 'John.Jacob-Jingleheimer_Schmidt_the3rd', domain_type: 'classcode', domain: '123-111.Abc_Def'}), opts);

     validCheck('classcode negative string', UsernameDomainWrapper.create({username: 'Jim', domain_type: 'classcode', domain: '-123'}), {domain_type:'classcode', domain:'-123'});
  });


});




function validCheck(testname, userdomain, pOverrides) {
    var overrides = pOverrides || {}
    var domain = overrides.domain || 'bob.com';
    var type   = overrides.domain_type || 'site';
    var name   = overrides.username || 'jim';
    var raw    = name + '@' + type + ':' + domain;
    var it_fn  = overrides.it || it;

    describe(testname, function(){
     it_fn('is valid check', function(){
        userdomain.isValid().should.be.true();
     });
     it_fn('username check', function(){
        userdomain.getUsername().should.be.equal(name);
     });
     it_fn('domain check', function(){
        userdomain.getDomain().should.be.equal(domain);
     });
     it_fn('domain type check', function(){
        userdomain.getDomainType().should.be.equal(type);
     });
     it_fn('raw check', function(){
        userdomain.getRaw().should.be.equal(raw);
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