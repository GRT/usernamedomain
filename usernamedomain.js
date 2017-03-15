const DEFAULT_DELIMITER = '@';
//------------------------------------------------------------------------------
module.exports.factory               = UsernameDomainWrapperFactory;
module.exports.UsernameDomainWrapper = UsernameDomainWrapperFactory({});
//------------------------------------------------------------------------------
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
    this._delimiter = pConfig.delimiter || DEFAULT_DELIMITER;
    this._holder    = extractData(pObj, this._delimiter);
}

UsernameDomain.prototype.isValid = function() {
    return (this._holder != null);
}

UsernameDomain.prototype.getDomain = function() {
    return (this.isValid()) ? this._holder.domain : null;
}

UsernameDomain.prototype.getUsername = function() {
    return (this.isValid()) ? this._holder.username : null;
}

UsernameDomain.prototype.getRaw = function() {
    return (this.isValid()) ? [this._holder.username, this._holder.domain].join(this._delimiter) : null;
}


//------------------------------------------------------------------------------
function extractData(pObj, pDelimiter) {
    var d = {};
    if(!pObj) {
        return null;
    } else if(typeof pObj === 'string' || pObj instanceof String) {
        var parts  = pObj.trim().split(pDelimiter);
        d.domain   = parts.pop().trim();
        d.username = parts.join(pDelimiter).trim();
    } else if(pObj.username && pObj.domain) {
        d.domain   = pObj.domain.trim();
        d.username = pObj.username.trim();
    }
    return (validateUsernameAndDomain(d.username, d.domain)) ? d : null;
}

function validateUsernameAndDomain(pUsername, pDomain) {
    return (
        pUsername && 
            (typeof pUsername === 'string' || pUsername instanceof String) && 
            pUsername.trim().length > 0 && 
            pDomain &&
            (typeof pDomain === 'string' || pDomain instanceof String) &&
            pDomain.trim().length > 0         
    );
}