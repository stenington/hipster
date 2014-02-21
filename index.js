#!/usr/bin/env node

/*
HipsterJesus / API docs
endpoint: http://hipsterjesus.com/api/
parameters:
paras = [1 - 99] (default 4)
type = ['hipster-latin', 'hipster-centric'] (default 'hipster-latin')
html = ['false', 'true'] ( default 'true') - strips html from output, replaces p tags with newlines
*/

var request = require('request');
var path = require('path');
var cp = require('copy-paste');
var colors = require('colors');

const URL = 'http://hipsterjesus.com/api/';

var argv = require('minimist')(process.argv.slice(2), {
  default: {
    latin: false,
    html: false,
    copy: true,
    color: true,
  },
  alias: {
    'help': 'h',
    'paras': 'p',
    'sents': 's',
    'words': 'w'
  }
});

if (!argv.color) colors.mode = 'none';

if (['paras', 'sents', 'words'].reduce(function (p, c, i, arr) {
  return p + (argv[c] ? 1 : 0);
}, 0) > 1) {
  console.error("Specify only one of --paras, --sents, --words");
  process.exit(1);
}

if (argv.help) {
  console.log("Usage: %s [options]", path.basename(process.argv[1]));
  console.log("");
  console.log("  Blog pork belly mixtape pug.".cyan);
  console.log("");
  console.log("        __         __".green);
  console.log("       /.-\"       `-.\\".green);
  console.log("      //             \\\\".green);
  console.log("     /j_______________j\\".green);
  console.log("    /o.-==-. .-. .-==-.o\\".green);
  console.log("    ||      )) ((      ||".green);
  console.log("     \\\\____//   \\\\____//".green);
  console.log("      `-==-'     `-==-'".green);
  console.log("");
  console.log("Options:");
  console.log("  -h, --help           Output usage information");
  console.log("  -p, --paras <n>      # of paragraphs (default: 1)");
  console.log("  -s, --sents <n>      # of sentences instead of paragraphs");
  console.log("  -w, --words <n>      # of words instead of paragraphs");
  console.log("  --latin              Include latin (default: false)");
  console.log("  --html               Include html tags (default: false)");
  console.log("  --[no-]copy          Copy hipster ipsum to clipboard (default: true)");
  console.log("  --[no-]color         Colorize output (default: true)");
}
else {
  var c = argv.paras ||
    (argv.sents && Math.ceil(argv.sents/5)) ||
    (argv.words && Math.ceil(argv.words/10)) ||
    (argv._.length && argv._[0]) ||
    1;

  request({
    uri: URL,
    json: true,
    qs: {
      paras: c,
      type: argv.latin ? 'hipster-latin' : 'hipster-centric',
      html: (argv.words || argv.sents) ? false : argv.html
    }
  }, function (err, res, body) {
    if (err) return console.error(err);
    var text = body.text;

    if (argv.words) {
      text = text.split(/\s+/).slice(0, argv.words).map(function (word) {
        return word.replace(/[.,]/, ''); 
      }).join(' ');
      if (argv.html)
        text = '<p>' + text + '</p>';
    }
    else if (argv.sents) {
      text = text.split(/\.\s+/).slice(0, argv.sents).join('.\n');
      text += '.';
      if (argv.html)
        text = '<p>' + text + '</p>';
    }
    else if (argv.paras) {
      text = text.split('\n').join('\n\n');
    }

    if (argv.copy) 
      cp.copy(text, function(err) {
        if (err) console.error(err.red);
      });

    var color = 'magenta';
    if (argv.sents) color = 'blue';
    else if (argv.words) color = 'yellow';

    console.log('\n%s\n', text[color]);
  });
}