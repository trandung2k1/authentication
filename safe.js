const safe = require('safe-regex');
//Not security
const regex = /^((ab)*)+$/;
console.log(safe(regex));
//Check type
const checkType = (value) => Object.prototype.toString.call(value).slice(8, -1);
console.log(checkType(''));
console.log(checkType(true));
console.log(checkType(null));
console.log(checkType(undefined));
console.log(checkType(new Date()));
