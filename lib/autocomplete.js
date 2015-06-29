var path = require('path');
var fs = require('fs');
var fuzzaldrin = require('fuzzaldrin');
var apis = [];
var endpoints = [];
var fields = [];
var types = [{text: 'api', displayText: 'api'},
              {text: 'design', displayText: 'design'},
              {text: 'trigger', displayText: 'trigger'}];

function intoApiSuggestions(api){
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

module.exports = {
  selector: '.source.poso',
  inclusionPriority: 1,
  getSuggestions: function(evObject) {
    console.log('SUGGESTIONS');
    console.log(atom.project.getDirectories());

    var json;
    try {
      json = JSON.parse(atom.workspace.getActiveTextEditor().getText());
    } catch (err) {
    }

    // IC fields become suggestions for data resolvers
    if (json && json.initialContext && json.initialContext.properties) {
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
    } else if (lineText.indexOf('posoType') !== -1) {
      console.log('type');
      which = types;
      console.log(which);
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
        resolve(which);
    });
  },

  activate: function(state) {
    apis = [];
    var paths = atom.project.getPaths();
    paths.forEach(function (path) {
      path += '/apis';
      console.log(path);
      fs.readdir(path, function (err, files) {
        if (!err) {
          files.forEach(function (filename) {
            console.log(filename);
            var contents;
            try {
              contents = fs.readFileSync(path + '/' + filename);
              intoApiSuggestions(JSON.parse(contents));
            } catch (err) {
              console.log('could not read api file: ' + path + '/' + filename);
              console.log(err);
            }
          });
        }
      });
    });

    console.log('activate autocomplete');

  }
};
