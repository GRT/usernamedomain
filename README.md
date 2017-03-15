# usernamedomain

Splits and rejoins username + domain strings.

## Examples

Happy path, with single string as input

```
$ node

> var UsernameDomainWrapper = require('usernamedomain').UsernameDomainWrapper;
undefined

> var usernameDomain = UsernameDomainWrapper.create('foobar@123-456');
undefined

> usernameDomain.isValid()
true

> usernameDomain.getUsername()
'foobar'

> usernameDomain.getDomain()
'123-456'

> usernameDomain.getRaw()
'foobar@123-456'
```

Happy path, with object as input

```
$ node

> var UsernameDomainWrapper = require('usernamedomain').UsernameDomainWrapper;
undefined

> var ud = UsernameDomainWrapper.create({username: 'james', domain: 'abcd-1234'});
undefined

> ud.isValid()
true

> ud.getUsername()
'james'

> ud.getDomain()
'abcd-1234'

> ud.getRaw()
'james@abcd-1234'
```