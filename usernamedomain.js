const DEFAULT_DELIMITER             = '@';
const DEFAULT_DOMAIN_SPEC_DELIMITER = ':';
const DEFAULT_MODEL_SCHEMA          = require('./usernamedomain.json');

var Validator         = require('jsonschema').Validator;
var v                 = new Validator();


//------------------------------------------------------------------------------
module.exports.factory               = UsernameDomainWrapperFactory;
module.exports.UsernameDomainWrapper = UsernameDomainWrapperFactory({});
//------------------------------------------------------------------------------
/*
 * params configuration object options:
 * - delimiter - delimits between username and domain / type
 * - domainSpecDelimiter - within the domain, delimits the type from the domain. If set to null,
 *    then no domain type is split (make sure the json schema can accomodate this)
 * - modelJsonSchema - json schema definition for model object.  Model object is of structure: 
 *    {username: '', domain: '', domain_type: ''}
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
    this._domainSpecDelimiter = (pConfig.domainSpecDelimiter===null || pConfig.domainSpecDelimiter) ? pConfig.domainSpecDelimiter : DEFAULT_DOMAIN_SPEC_DELIMITER;
    this._modelJsonSchema     = pConfig.modelJsonSchema || DEFAULT_MODEL_SCHEMA;
    this._holder              = extractData(pObj, this._delimiter, this._domainSpecDelimiter);
}

UsernameDomain.prototype.disallowedChars = function() {
    var retval = [this._delimiter];
    if(this._domainSpecDelimiter) 
        retval.push(this._domainSpecDelimiter);
    return retval;
}

UsernameDomain.prototype.validate = function() {
    return v.validate(this._holder, 
                      this._modelJsonSchema);
}
UsernameDomain.prototype.isValid = function() {
    var result = this.validate();
    return result ? result.valid : false;
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
function extractData(pObj, pDelimiter, pDomainSpecDelimiter) {
    var allowUntypedDomain = (pDomainSpecDelimiter===null) ? true : false;
    var d = {username: null, domain: null, domain_type: null};
    if(!pObj) {
        return d;
    } else if(isString(pObj)) {
        var parts  = pObj.trim().split(pDelimiter);
        var ending = parts.pop().trim();
        var domObj = extractDomainParts(ending, pDomainSpecDelimiter);
        d.username = parts.join(pDelimiter).trim();
        if(domObj) {
            d.domain      = domObj.domain;
            d.domain_type = domObj.domain_type;
        }
    } else {
        d.domain      = isString(pObj.domain)      ? pObj.domain.trim() : null;
        d.username    = isString(pObj.username)    ? pObj.username.trim() : null;
        d.domain_type = isString(pObj.domain_type) ? pObj.domain_type.trim() : null;
    }
    ensureLowerCase(d);
    return d;
}

function isString(pObj) {
    return (typeof pObj === 'string' || pObj instanceof String) ? true : false;
}

function ensureLowerCase(pHolderObj) {
    if(pHolderObj) {
        if(isString(pHolderObj.username)) {
            pHolderObj.username = pHolderObj.username.toLowerCase();
        }
        if(isString(pHolderObj.domain)) {
            pHolderObj.domain = pHolderObj.domain.toLowerCase();
        }
    }
    return pHolderObj;
}


// given input: ('site:example.com', ':') -> returns object: {domain: 'example.com', domain_type: 'site'}
// given input: ('foobar.com', ':') -> returns object: {domain: 'foobar.com'}
function extractDomainParts(pDomain, pDomainSpecDelimiter) {
    var ret = {};
    if(!pDomain) {
        return null;
    } else if(pDomainSpecDelimiter===null) {
        ret.domain = pDomain.trim();
    } else {
        var parts = pDomain.trim().split(pDomainSpecDelimiter);
        if(parts.length<2) {
            ret.domain = parts[0].trim();
        } else {
            ret.domain_type = parts[0].trim();
            parts.shift();
            ret.domain = parts.join(pDomainSpecDelimiter).trim();
        }
    }
    return ret;
}
