var Generator = require('yeoman-generator');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    
    this.argument('componentName', { type: String, required: false});
    this.argument('componentType', { type: String, required: false});
    
    this.libraryName = this.config.get('libraryName');
    this.componentsRoot = this.config.get('componentsRoot');
    this.libraryBuildPath = this.config.get('libraryBuildPath');
    
    this.componentName = this.options.componentName ? this.options.componentName : null;
    this.componentType = this.options.componentType ? this.options.componentType : null;
  }
  
  //Component Related Prompts
  componentNameUserInput() {
    if (this.componentName === null) {
      return this.prompt([
        {
          type : 'input',
          name : 'componentName',
          message : 'What is the name of your component?',
          required : true
        }
      ]).then((answer) => {
        this.componentName = answer.componentName;
        if(this.componentName === "") {
          this.env.error("You must include a name for your component, please try again");
        }
      });
    }
  }
  componentTypeUserInput() {
    if (this.componentType === null) {
      return this.prompt([
        {
          type: 'confirm',
          name : 'componentType',
          message : 'Is this a functional component?',
          default : true
        }  
      ]).then((answer) => {
        this.componentType = answer.componentType;
      });
    }
  }
  
  //General Library Related Prompts
  setLibraryName() {
    if(this.libraryName === undefined) {
    return this.prompt([
      {
        type: 'input',
        name: 'libraryName',
        message: 'What is the name of your component library?'
      }
    ]).then((answers) => {
      this.libraryName = answers.libraryName;
      this.config.set('libraryName', this.libraryName);
      if(this.libraryName === "") {
        this.env.error("You must include a name for your library, please try again");
      }
    });
  }
  }
  setComponentsRoot() {
    if(this.componentsRoot === undefined) {
      return this.prompt([
        {
          type: 'input',
          name: 'componentsRoot',
          message: 'What folder do you want to develop your components in?'
        }
      ]).then((answers) => {
        this.componentsRoot = answers.componentsRoot;
        this.config.set('componentsRoot', this.componentsRoot);
        if(this.componentsRoot === "") {
          this.env.error("You must include a directory name, please try again");
        }
      });
    }
  }
  setlibraryBuildPath() {
    if(this.libraryBuildPath === undefined) {
      return this.prompt([
        {
          type: 'input',
          name: 'libraryBuildPath',
          message: 'Where should babel place compiled files?'
        }
      ]).then((answers) => {
        this.libraryBuildPath = answers.libraryBuildPath;
        this.config.set('libraryBuildPath', this.libraryBuildPath);
        if(this.libraryBuildPath === "") {
          this.env.error("You must include a name for your output directory, please try again");
        }
      });
    }
  }
  
  // Format the words
  _pipeString(word) {
    return(word.replace(/ /g,"-").toLowerCase());
  }
  _titleCaseStringNoSpaces(word) {
    var stageWord = word.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    return(stageWord.replace(/ /g, ""));  
  }
  _titleCaseString(word) {
    return (word.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}));
  }
  
// Different Template File Levels
  handleLibraryFiles() {
    if(!this.fs.exists(process.cwd()+'/README.md')) {
      this._createReadMe();
    }
    if(!this.fs.exists(process.cwd()+'/.gitignore')) {
      this._createGitIgnore();
    }
    if(!this.fs.exists(process.cwd()+'/package.json')) {
      this._createLibraryPackage();
    }
    if(!this.fs.exists(process.cwd()+'/.npmignore')) {
      this._createNpmIgnore();
    }
  }
  
  handleComponentsRootFiles() {
    if(!this.fs.exists(this.componentsRoot+'/index.js')) {
      this._createIndexInventoryFile();
    }
    if(!this.fs.exists(this.componentsRoot+'/global_style_variables.scss')) {
      this._createGlobalStyleVariables();
    }
    this._updateIndexInventoryFile();
  }
  
  handleComponentFiles() {
    if(this.componentType === true) {
      this._createJSFunctionFile();
    } else {
      this._createJSClassFile();
    }
    
    this._createComponentPackage();
    this._createComponentStyles();
    this._createComponentReadme();
  }
  
  _createIndexInventoryFile() {
    this.fs.copy(
      this.templatePath('component-templates/component-index.js'),
      this.destinationPath(this.componentsRoot+'/index.js')
    )
  }
  _updateIndexInventoryFile() {
    this.fs.append(this.componentsRoot+'/index.js', 'export { default as '+this._titleCaseStringNoSpaces(this.componentName)+' } from "./'+this._pipeString(this.componentName)+'"')
  }
  
  _createReadMe() {
    this.fs.copyTpl(
      this.templatePath('library-templates/README.md'),
      this.destinationPath(process.cwd()+'/README.md'),
      {
        libraryName: this.libraryName,
        libraryRoot: this.componentsRoot,
        libraryNamePretty: this._titleCaseString(this.libraryName),
      }
    )
  }
  
  _createGitIgnore() {
    this.fs.copyTpl(
      this.templatePath('library-templates/.gitignore'),
      this.destinationPath(process.cwd()+'/.gitignore'),
      {
        libraryName: this._titleCaseString(this.libraryName),
        libraryRoot: this.componentsRoot,
      }
    )
  }
  
  _createLibraryPackage() {
    this.fs.copyTpl(
      this.templatePath('library-templates/base-package.json'),
      this.destinationPath(process.cwd()+'/package.json'),
      {
        libraryName: this._pipeString(this.libraryName),
        buildFolder: this.libraryBuildPath,
        libraryRoot: this.componentsRoot,
      }
    )
  }
  
  _createNpmIgnore() {
    this.fs.copyTpl(
      this.templatePath('library-templates/base-npmignore.npmignore'),
      this.destinationPath(process.cwd()+'/.npmignore'),
      {
        buildFolder: this.libraryBuildPath,
      }
    )
  }

  _createGlobalStyleVariables() {
    this.fs.copyTpl(
      this.templatePath('components-root-templates/global_vars.scss'),
      this.destinationPath(this.componentsRoot+'/global_style_variables.scss'),
      { componentName: this.componentName }
    );
  }
  
  _createJSClassFile() {
    this.fs.copyTpl(
      this.templatePath('component-templates/class.js'),
      this.destinationPath(this.componentsRoot+'/'+this._pipeString(this.componentName)+'/index.js'),
      {
        componentName: this._titleCaseStringNoSpaces(this.componentName),
        componentNamePiped: this._pipeString(this.componentName),
      }
    );  
  }
  
  _createJSFunctionFile() {
    this.fs.copyTpl(
      this.templatePath('component-templates/function.js'),
      this.destinationPath(this.componentsRoot+'/'+this._pipeString(this.componentName)+'/index.js'),
      {
        componentName: this._titleCaseStringNoSpaces(this.componentName),
        componentNamePiped: this._pipeString(this.componentName),
      }
    );
  }

  _createComponentPackage() {
    this.fs.copyTpl(
      this.templatePath('component-templates/package.json'),
      this.destinationPath(this.componentsRoot+'/'+this._pipeString(this.componentName)+'/package.json'),
      { componentName: this._titleCaseStringNoSpaces(this.componentName) }
    );  
  }
  
  _createComponentReadme() {
    this.fs.copyTpl(
      this.templatePath('component-templates/readme.md'),
      this.destinationPath(this.componentsRoot+'/'+this._pipeString(this.componentName)+'/readme.md'),
      {
        componentReactName: this._titleCaseStringNoSpaces(this.componentName),
        componentPrettyName: this._titleCaseString(this.componentName)
      }
    )
  }
  
  _createComponentStyles() {
    this.fs.copyTpl(
      this.templatePath('component-templates/style.scss'),
      this.destinationPath(this.componentsRoot+'/'+this._pipeString(this.componentName)+'/style.scss'),
      {
        componentName: this.componentName,
        componentNamePiped: this._pipeString(this.componentName),
      }
    );  
  }
};