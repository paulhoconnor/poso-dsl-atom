var MessagePanelView = require('atom-message-panel').MessagePanelView,
    PlainMessageView = require('atom-message-panel').PlainMessageView;

function validate() {
  var messages = new MessagePanelView({
    title: 'It\'s alive..... IT\'S ALIIIIIVE!!!!'
  });
  messages.attach();
  messages.add(new PlainMessageView({
    message: 'I did it mommy, I made my first Atom Message Panel!',
    className: 'text-success'
  }));
}

module.exports = {
  activate: function(state) {
    atom.workspace.observeTextEditors(function (editor) {
      if (editor && editor.getPath().indexOf('.poso') > 0) {
        editor.onDidSave(validate);
      }
    });
    console.log('activate validate');
  }
};
