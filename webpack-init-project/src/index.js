require('./js/fix_ie8.js');
require('ppmoneyDialog');
require('./css/css.css');
var fileA = require("../fileA.html");
var fileB = require("../fileB.html");
var img = require("./img/image.jpg");
$('body').append(fileA+fileB);
require("./js/init.js");
