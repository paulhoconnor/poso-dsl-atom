var apd             = require('atom-package-dependencies'),
    autocomplete    = require('./autocomplete'),
    validate        = require('./validate'),
    entityCache     = require('./entityCache');

console.log(entityCache);

apd.install();

var init = {
  activate: function(state){
    console.log('activate poso-dsl-atom');

    // activate enitity cache
    entityCache.activate(state);
    atom.project.onDidChangePaths(entityCache.activate);
    
    // activate autocomplete
    autocomplete.activate(state);

    // activate validation
    validate.activate(state);
  },

  deactivate: function(){
     console.log('deactivate poso-dsl-atom');
  },

  autocompleteProvider: function() {
    console.log('autocomplete provider');
    return autocomplete;
  }
};

module.exports = init;
