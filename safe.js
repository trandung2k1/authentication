const safe = require('safe-regex');
//Not security
const regex = /^((ab)*)+$/;
console.log(safe(regex));
