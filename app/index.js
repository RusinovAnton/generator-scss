'use strict';


const _forEach = require('lodash/forEach');
const chalk = require('chalk');
const del = require('del');
const figures = require('figures');
const fs = require('fs');
const mkdirp = require('mkdirp');
const requireTree = require('require-tree');
const yo = require('yeoman-generator');


const arrayHas = (arr, str) => arr.indexOf(str) !== -1

module.exports = yo.Base.extend({
  constructor: function() {
    console.log('constructor');
    yo.Base.apply(this, arguments);
  },

  initializing: function() {
    this.buildDefaults = {
      destinationRoot: './src/scss/',
      components: [
        'bootstrap',
        'components',
        'helpers',
        'layout',
        'scenes',
      ]
    };

    this.build = this.config.get('build') || this.buildDefaults;

    this.prompts = {
      destinationRoot: {
        type: 'input',
        name: 'destinationRoot',
        message: 'Set where to put generated files:',
        default: this.build.destinationRoot
      },
      components: {
        type: 'checkbox',
        name: 'components',
        message: 'Which folders you would like to use?',
        choices: [{
          value: 'bootstrap',
          checked: arrayHas(this.build.components, 'bootstrap'),
          name: 'bootstrap4 source'
        }, {
          value: 'components',
          checked: arrayHas(this.build.components, 'components'),
          name: 'components'
        }, {
          value: 'helpers',
          checked: arrayHas(this.build.components, 'helpers'),
          name: 'helpers'
        }, {
          value: 'layout',
          checked: arrayHas(this.build.components, 'layout'),
          name: 'layout'
        }, {
          value: 'scenes',
          checked: arrayHas(this.build.components, 'scenes'),
          name: 'scenes'
        }]
      }
    };
  },

  prompting: {
    destinationRoot() {
      var done = this.async();

      this.prompt(this.prompts.destinationRoot, ({ destinationRoot }) => {
        this.build.destinationRoot = destinationRoot

        done();
      });
    },

    components() {
      var done = this.async();

      this.prompt(this.prompts.components, ({ components }) => {
        this.build.components = components

        done();
      });
    },

    setConfig() {
      this.config.set({ build: this.build });
    }
  },

  writing: {
    pre() {
      // TODO: add support for prompting destinationPath
      this.destinationRoot(this.build.destinationRoot);
      this.appname = 'scss';
    },

    components() {
      this.build.components.forEach(component => {
        this.fs.copy(
          this.templatePath(component),
          this.destinationPath(component)
        );
      })
    },

    indexFile() {
      let indexFile = '@import "node_modules/scss-mixins-collection/index";\n\n';

      this.build.components.forEach(component => {
        indexFile += `@import "${component}/__${component};\n`;
      });

      this.fs.write(this.destinationPath('styles.scss'), indexFile);
    }
  },

  end: function() {
    console.log('★★★ Happy Styling! ★★★');
  }
});
