# usernamedomain

Splits and rejoins username + domain strings.

## Examples

### Non 'typed' domains
For example, `joe@example.com`

Happy path, with single string as input

```
$ node

> var UsernameDomainWrapper = require('../usernamedomain.js').factory({allowUntypedDomain: true});
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

> var UsernameDomainWrapper = require('../usernamedomain.js').factory({allowUntypedDomain: true});
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

### Typed domains
For example, `joe@site:example.com` or `joe@school:22331`

Happy path, with single string as input
```
> var UsernameDomainWrapper = require('../usernamedomain.js').UsernameDomainWrapper;
undefined

> var ud = UsernameDomainWrapper.create('jim@site:example.com')
undefined

> ud.isValid()
true

> ud.getUsername()
'jim'

> ud.getDomain()
'example.com'

> ud.getDomainType()
'site'

> ud.getRaw()
'jim@site:example.com'

```

Happy path, with object as input
```
> var UsernameDomainWrapper = require('../usernamedomain.js').UsernameDomainWrapper;
undefined

> var ud = UsernameDomainWrapper.create({username: 'filmore', domain_type:'schoolcode', domain: '3u45a32'})
undefined

> ud.isValid()
true

> ud.getUsername()
'filmore'

> ud.getDomainType()
'schoolcode'

> ud.getDomain()
'3u45a32'

> ud.getRaw()
'filmore@schoolcode:3u45a32'
```

