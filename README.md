# usernamedomain

Splits and rejoins username + domain strings.  Domains can be different identifier types - these are signified by domain types.  By default, here are some example full usernames/domain strings:
* `jim@site:example.com` - user 'jim' with domain type 'site' and domain 'example.com'
* `teacherbob@classcode:92395` - user 'teacherbob' with domain type 'classcode' and domain '92395'


## Examples

### Typed domains, as one string

Here we are starting with a single string representation, and then parsing / validating.
For example, `TalkingScareTank11@classcode:ABCD1234`

```javascript
// create the wrapper with default settings
> var UsernameDomainWrapper = require('../usernamedomain.js').UsernameDomainWrapper;
undefined

// create a UsernameDomain object for this string representation
> var ud = UsernameDomainWrapper.create('TalkingScareTank11@classcode:ABCD1234');
undefined

// quick validity check
> ud.isValid()
true

// for a more detailed info, this returns a json schema response
//   see: https://www.npmjs.com/package/jsonschema
> ud.validate()
ValidatorResult {
  instance: 
   { username: 'talkingscaretank11',
     domain: 'abcd1234',
     domain_type: 'classcode' },
  schema: 
   { type: 'object',
     properties: { domain: [Object], username: [Object], domain_type: [Object] },
     required: [ 'domain', 'domain_type', 'username' ] },
  propertyPath: 'instance',
  errors: [],
  throwError: undefined,
  disableFormat: false }

// or just save off the result object
> var result = ud.validate();
undefined
> result.valid
true


// If the object is valid, you will get non-null, clean values for the parts
//    We return everything as lower case by default
> ud.getUsername()
'talkingscaretank11'

> ud.getDomain()
'abcd1234'

> ud.getDomainType()
'classcode'

> ud.getRaw()
'talkingscaretank11@classcode:abcd1234'

```


### Typed domains, as an object

If you allow login via a form with different fields, this would be the way to create the object

In this case, we will use values that do NOT pass validation.  For example,
* Username: `big$hot`
* Domain Type: `group`
* Domain: `X`

This should fail validation for every field.

```javascript
// create the wrapper with default settings
> var UsernameDomainWrapper = require('../usernamedomain.js').UsernameDomainWrapper;
undefined

// create a UsernameDomain object for this string representation
> var ud = UsernameDomainWrapper.create({username: 'big$hot', domain_type: 'group', domain: 'X'})
undefined

> ud.isValid()
false

> var result = ud.validate()
undefined

> result.valid
false

// the result contains information about what did not meet validation rules 
> result
ValidatorResult {
  instance: { username: 'big$hot', domain: 'x', domain_type: 'group' },
  schema: 
   { type: 'object',
     properties: { domain: [Object], username: [Object], domain_type: [Object] },
     required: [ 'domain', 'domain_type', 'username' ] },
  propertyPath: 'instance',
  errors: 
   [ ValidationError {
       property: 'instance.domain',
       message: 'does not meet minimum length of 2',
       schema: [Object],
       instance: 'x',
       name: 'minLength',
       argument: 2,
       stack: 'instance.domain does not meet minimum length of 2' },
     ValidationError {
       property: 'instance.username',
       message: 'does not match pattern "^[a-z0-9\\\\.\\\\-_]+$"',
       schema: [Object],
       instance: 'big$hot',
       name: 'pattern',
       argument: '^[a-z0-9\\.\\-_]+$',
       stack: 'instance.username does not match pattern "^[a-z0-9\\\\.\\\\-_]+$"' },
     ValidationError {
       property: 'instance.domain_type',
       message: 'is not one of enum values: classcode,site',
       schema: [Object],
       instance: 'group',
       name: 'enum',
       argument: [Object],
       stack: 'instance.domain_type is not one of enum values: classcode,site' } ],
  throwError: undefined,
  disableFormat: false }

// if validation fails, the other getters will return null, since it is not a valid set of values.
> ud.getUsername()
null

> ud.getRaw()
null
```