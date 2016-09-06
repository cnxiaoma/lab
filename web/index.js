require('./src/js/fix_ie8.js');
require('ppmoneyDialog');
require('./src/js/common.js');
require('./src/css/base.css');
require('./src/css/common.css');
var fileA = require("./tpl/fileA.html");
var fileB = require("./tpl/fileB.html");
$('body').append(fileA+fileB);
require("./src/js/init.js");
