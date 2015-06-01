var path = require('path');
var fs = require('fs');
var fuzzaldrin = require('fuzzaldrin');
var apd = require('atom-package-dependencies');
var apis = [];
var endpoints = [];
var fields = [];

apd.install();

function intoSuggestions(api){
  if(api && api.name){
      apis.push({text: '"' + api.name + '"', displayText: 'API:' + api.name});
      if (api.endpoints) {
        api.endpoints.forEach(function (endpoint) {
          endpoints.push({text: '"' + api.name + '/' + endpoint.name + '"',
                          displayText: 'Endpoint:' + api.name + '/' + endpoint.name});
        });
      }
  }
}

var provider = {
  selector: '.source.poso',
  inclusionPriority: 1,
  getSuggestions: function(evObject){
    console.log('SUGGESTIONS');

    var json = JSON.parse(atom.workspace.getActiveTextEditor().getText());
    if (json.initialContext && json.initialContext.properties) {
      Object.keys(json.initialContext.properties).map(function(icField) {
        fields.push({text: '"ic:/' + icField + '"', displayText: 'ic:/' + icField});
      });
    }

    var which;
    var lineText = evObject.editor.getTextInRange([[evObject.bufferPosition.row, 0], evObject.bufferPosition]);
    if(lineText.indexOf('apis') !== -1){
      console.log('apis');
      which = apis;
    } else if (lineText.indexOf('endpoint') !== -1) {
      console.log('endpoints');
      which = endpoints;
    } else if (lineText.indexOf('path') !== -1) {
      console.log('fields');
      which = fields;
    } else {
      return [];
    }

    return new Promise(function(resolve, reject){
        which.forEach(function(pkg){
          pkg.score = fuzzaldrin.score(pkg.text, evObject.prefix);
        });
        which.sort(function(a,b){
          return b.score-a.score;
        });
        console.log(which);
        resolve(which);
    });
  }
};

var apiAutocomplete = {
  activate: function(state){
    var path = atom.project.getPath() + '/apis';
    fs.readdir(path, function (err, files) {
      files.forEach(function (filename) {
        console.log(filename);
        intoSuggestions(JSON.parse(fs.readFileSync(path + '/' + filename)));
      });
    });

    console.log('activate apiAutocomplete');

  },

  deactivate: function(){
     console.log('deactivate');
  },

  provider: function(){
    console.log('provider');
    return provider;
  }
};

module.exports = apiAutocomplete;
