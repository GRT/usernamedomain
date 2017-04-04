const DEFAULT_DELIMITER             = '@';
const DEFAULT_DOMAIN_SPEC_DELIMITER = ':';
const DEFAULT_ALLOW_UNTYPED_DOMAIN  = false;
//------------------------------------------------------------------------------
module.exports.factory               = UsernameDomainWrapperFactory;
module.exports.UsernameDomainWrapper = UsernameDomainWrapperFactory({});
//------------------------------------------------------------------------------
/*
 * params configuration object options:
 * - delimiter - delimits between username and domain / type
 * - domainSpecDelimiter - within the domain, delimits the type from the domain
 * - allowUntypedDomain - allow as valid input if there is no domain type in the raw string
 */
function UsernameDomainWrapperFactory(params) {
    return new UsernameDomainWrapper(params);
}

//------------------------------------------------------------------------------

function UsernameDomainWrapper(pConfig) {
    this._config = pConfig || {};
}

// creates a new UsernameDomain wrapper object.
// pObj can be a string (e.g., jimbo@abc123) or
//         an object: {username: jimbo, domain: abc123}
UsernameDomainWrapper.prototype.create = function(pObj) {
    return new UsernameDomain(pObj, this._config);
}

//------------------------------------------------------------------------------
function UsernameDomain(pObj, pConfig) {
    this._delimiter           = pConfig.delimiter || DEFAULT_DELIMITER;
    this._domainSpecDelimiter = pConfig.domainSpecDelimiter || DEFAULT_DOMAIN_SPEC_DELIMITER;
    this._allowUntypedDomain  = pConfig.allowUntypedDomain || DEFAULT_ALLOW_UNTYPED_DOMAIN;
    this._holder              = extractData(pObj, this._delimiter, this._domainSpecDelimiter, this._allowUntypedDomain);
}

UsernameDomain.prototype.disallowedChars = function() {
    return [this._delimiter, this._domainSpecDelimiter];
}

UsernameDomain.prototype.isValid = function() {
    return (this._holder != null);
}

UsernameDomain.prototype.getDomain = function() {
    return (this.isValid()) ? this._holder.domain : null;
}

UsernameDomain.prototype.getDomainType = function() {
    return (this.isValid()) ? this._holder.domain_type : null;
}

UsernameDomain.prototype.getUsername = function() {
    return (this.isValid()) ? this._holder.username : null;
}

UsernameDomain.prototype.getRaw = function() {
    if(this.isValid()) {
        var typedDomain = this._holder.domain_type ? this._holder.domain_type + this._domainSpecDelimiter + this._holder.domain : this._holder.domain;
        return [this._holder.username, typedDomain].join(this._delimiter)
    } else {
        return null;
    }
}


//------------------------------------------------------------------------------
// returns an object: 
//{ username: 'jim', domain_type: 'site', domain: 'example.com'}
function extractData(pObj, pDelimiter, pDomainSpecDelimiter, pAllowUntypedDomain) {
    var d = {};
    if(!pObj) {
        return null;
    } else if(typeof pObj === 'string' || pObj instanceof String) {
        var parts  = pObj.trim().split(pDelimiter);
        var ending = parts.pop().trim();
        var domObj = extractDomainParts(ending, pDomainSpecDelimiter);
        d.username = parts.join(pDelimiter).trim();
        if(domObj) {
            d.domain      = domObj.domain;
            d.domain_type = domObj.domain_type;
        }
    } else if(pObj.username && pObj.domain) {
        d.domain      = pObj.domain.trim();
        d.username    = pObj.username.trim();
        d.domain_type = (pObj.domain_type && (typeof pObj.domain_type === 'string' || pObj.domain_type instanceof String)) ? pObj.domain_type.trim() : null;
    }
    return (validateUsernameAndDomain(d.username, d.domain, d.domain_type, pAllowUntypedDomain)) ? d : null;
}


// given input: ('site:example.com', ':') -> returns object: {domain: 'example.com', domain_type: 'site'}
// given input: ('foobar.com', ':') -> returns object: {domain: 'foobar.com'}
function extractDomainParts(pDomain, pDomainSpecDelimiter) {
    var ret = {};
    if(!pDomain) {
        return null;
    } else {
        var parts = pDomain.trim().split(pDomainSpecDelimiter);
        if(parts.length<2) {
            ret.domain = parts[0].trim();
        } else {
            ret.domain_type = parts[0].trim();
            parts.shift();
            ret.domain = parts.join(pDomainSpecDelimiter).trim();
        }
        return ret;
    }
}

function validateUsernameAndDomain(pUsername, pDomain, pDomainType, pAllowUntypedDomain) {
    // TODO: add validity rules and feedback mechanism
    return (
        pUsername && 
            (typeof pUsername === 'string' || pUsername instanceof String) && 
            pUsername.trim().length > 0 && 
            pDomain &&
            (typeof pDomain === 'string' || pDomain instanceof String) &&
            pDomain.trim().length > 0 && 
            ( 
                pAllowUntypedDomain || 
                ( pDomainType &&   (typeof pDomainType === 'string' || pDomainType instanceof String) && pDomainType.trim().length > 0)
            )
    );
}