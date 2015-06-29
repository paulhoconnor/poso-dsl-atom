var fs = require('fs'),
    apis = [];
    designs = [];
    triggers = [];

module.exports = {
    activate: function(state) {
        var paths = atom.project.getPaths();
        paths.forEach(function (path) {
            console.log('entityCache reading: ' + path);
            fs.readdir(path + '/apis', function (err, files) {
                if (!err) {
                    files.forEach(function (filename) {
                        console.log(filename);
                        var contents;
                        try {
                            contents = fs.readFileSync(path + '/apis/' + filename);
                            apis.push(JSON.parse(contents));
                        } catch (err) {
                            console.log('could not read api file: ' + path +
                                                                '/' + filename);
                            console.log(err);
                        }
                    });
                    apis = apis.unique();
                }
            });

            fs.readdir(path + '/designs', function (err, files) {
                if (!err) {
                    files.forEach(function (filename) {
                        console.log(filename);
                        var contents;
                        try {
                            contents = fs.readFileSync(path + '/designs/' + filename);
                            var design = JSON.parse(contents);
                            if (design.name) {
                                designs.push(design.name);
                            }
                        } catch (err) {
                            console.log('could not read api file: ' + path +
                                                                '/' + filename);
                            console.log(err);
                        }
                    });
                    designs = designs.unique();
                }
            });
        });

        atom.project.getDirectories().each(function (dir) {
            dir.onDidChange(function () {
                console.log('DIRECTORY CHANGE!');
            });
        });

        console.log('activate entityCache');
    },

    getApis: function() {
        return apis;
    },

    getDesigns: function() {
        return designs;
    },

    getTriggers: function() {
        return triggers;
    }
};
