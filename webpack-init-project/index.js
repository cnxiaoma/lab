require('./src/js/fix_ie8.js');
require('ppmoneyDialog');
require('./src/css/css.css');
var fileA = require("./fileA.html");
var fileB = require("./fileB.html");
var img = require("./src/img/image.jpg");
$('body').append(fileA+fileB);
require("./src/js/init.js");
