var MessagePanelView        = require('atom-message-panel').MessagePanelView,
    PlainMessageView        = require('atom-message-panel').PlainMessageView,
    validators              = require('poso-dsl-validators'),
    entityCache             = require('./entityCache');

var panel;

function validate() {
    if (panel) {
        panel.close();
        panel = null;
    }
    var entityStr = atom.workspace.getActiveTextEditor().getBuffer().getText();
    validators.validateDesign(entityStr, entityCache.getApis(),
                                entityCache.getDesigns(), function (err) {
        console.log(err);
        if (err) {
             var messages = new MessagePanelView({
               title: '"<span class=\"icon-bug\"></span> POSO DSL Errors',
               rawTitle: true
             });
             messages.attach();
             panel = messages;
             err.messages.each(function (error) {
                 messages.add(new PlainMessageView({
                   message: error,
                   className: 'text-error'
                 }));
            });
        }
    });
}

module.exports = {
  activate: function(state) {
    atom.workspace.observeTextEditors(function (editor) {
      if (editor && editor.getPath().indexOf('.poso') > 0) {
        editor.getBuffer().onWillSave(validate);
      }
    });
    console.log('activate validate');
  }
};
