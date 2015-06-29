var apd = require('atom-package-dependencies'),
    autocomplete = require('./autocomplete'),
    validate = require('./validate');

apd.install();

var init = {
  activate: function(state){
    console.log('activate poso-dsl-atom');
    console.log(atom.project.getPaths());

    // activate autocomplete
    autocomplete.activate(state);
    atom.project.onDidChangePaths(autocomplete.activate);

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
