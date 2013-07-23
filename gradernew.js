#!/usr/bin/env node
/*
Automatically grade files for the presence of specified HTML tags/attributes.
Uses commander.js and cheerio. Teaches command line application development
and basic DOM parsing.

References:

 + cheerio
   - https://github.com/MatthewMueller/cheerio
   - http://encosia.com/cheerio-faster-windows-friendly-alternative-jsdom/
   - http://maxogden.com/scraping-with-node.html

 + commander.js
   - https://github.com/visionmedia/commander.js
   - http://tjholowaychuk.com/post/9103188408/commander-js-nodejs-command-line-interfaces-made-easy

 + JSON
   - http://en.wikipedia.org/wiki/JSON
   - https://developer.mozilla.org/en-US/docs/JSON
   - https://developer.mozilla.org/en-US/docs/JSON#JSON_in_Firefox_2
*/

var fs = require('fs');
var program = require('commander');
var cheerio = require('cheerio');
var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";
var URL_DEFAULT = "http://peaceful-earth-1680.herokuapp.com/"
var url = 'http://www.coursera.org';
var htmlfile="";
var sys = require('util');
var rest = require('restler');

var assertFileExists = function(infile) {
    var instr = infile.toString();
    if(!fs.existsSync(instr)) {
        console.log("%s does not exist. Exiting.", instr);
        process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
    }
    return instr;
};

var cheerioHtmlFile = function(htmlfile) {
    return cheerio.load(fs.readFileSync(htmlfile));
};

var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(htmlfile, checksfile) {
    // This dollar is a special variable that holds a specially returned file of htmlfile (modified).
    $ = cheerioHtmlFile(htmlfile);

    // console.log("Dollar means:" + $);

    var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks) {
        var present = $(checks[ii]).length > 0;
        out[checks[ii]] = present;
    }
    return out;
};

var htmlfile;


var checkUrl = function(urlfile, checksfile) {
    // We use the restler library function call of rest.get.'complete', function(result) {....}
    // The contents of the URL file are retreived and put into result, and the callback is executed
    // when all the data is there.
    
    rest.get(urlfile).on('complete', function(result){
	if (result instanceof Error) {
            console.log("We got to the error in function");
	    sys.puts('Error: ' + result.message);
	    this.retry(5000); // try again after 5 sec
	} else {

	    // THIS IS THE CALLBACK PART OF THE FUNCTION, we are waiting for the value of result:

	    // I created a local file called temp.file so that we could continue to use the checkhtml function
	    // as well as the loadchecks function and cheeriohtml file - all of which work for a local file and
	    // not a url. This slowed things down but I was able to use all the given functions without 
	    // modification.

            var saved = "temp.file";

            htmlfile=result;
            fs.writeFileSync(saved, htmlfile, 'utf8');

            // console.log("Program Checks is: " + program.checks);

            var checkJson = checkHtmlFile(saved, program.checks);
            var outJson = JSON.stringify(checkJson, null, 4);
            var checks = loadChecks(checksfile).sort();
            var out = {};
            console.log(outJson);
   }
})};

var clone = function(fn) {
    // Workaround for commander.js issue.
    // http://stackoverflow.com/a/6772648
    return fn.bind({});
};

if(require.main == module) {
    program
        .option('-u, --url <url_file>', 'Path to url')
        .option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExists), HTMLFILE_DEFAULT)
        .option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
        .parse(process.argv);

    if (program.url) { // This checks to see if we have a url instead of a local  html file name.
	var htmlfile = checkUrl(program.url, program.checks);
	
	// MOST IMPORTANTLY, IF WE WERE TO PRINT HTML FILE OUT HERE WE WOULD GET AT UNDEFINED VALUE
	// FOR HTMLFILE, BECAUSE CHECKURL IS AN ASYNCH FUNCTION THAT TAKES TIME TO EXECUTE.
	// console.log("htmlfile is:" + htmlfile);

    } else {
	// AN -f has been used, and we have a regular html file, not a url:
	// MOST IMPORTANTLY NOTE: THAT THE FOLLOWING COMMANDS ARE EXECUTED IN THE CALLBACK SECTION OF THE 
	// PRIOR ASYNCH CALL FOR CHECKURL.    
	var checkJson = checkHtmlFile(program.file, program.checks);
	var outJson = JSON.stringify(checkJson, null, 4);
	console.log(outJson);
    }
} else {
    exports.checkHtmlFile = checkHtmlFile;
}

