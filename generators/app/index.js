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
  
  //Component Related Inputs
  componentUserInput() {
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
      });
    }
    if (this.componentType === null) {
      return this.prompt([
        {
          type : 'input',
          name : 'componentType',
          message : 'Is this a function or a class component?',
          default : 'function'
        }  
      ]).then((answer) => {
        this.componentType = answer.componentType.toLowerCase();
      });
    }
  }
  
  //General Library Related Inputs
  libraryUserInput() {
    if(this.libraryName === undefined) {
      _setLibraryName();  
    }
    if(this.componentsRoot === undefined) {
      _setComponentsRoot();
    }
    if(this.libraryBuildPath === undefined) {
      _setlibraryBuildPath();
    }
  }
  _setLibraryName() {
    return this.prompt([
      {
        type: 'input',
        name: 'libraryName',
        message: 'What is the name of your component library?'
      }
    ]).then((answers) => {
      this.libraryName = answers.libraryName;
      this.config.set('libraryName', this.libraryName);
    });
  }
  _setComponentsRoot() {
    return this.prompt([
      {
        type: 'input',
        name: 'componentsRoot',
        message: 'What folder do you want to develop your components in?'
      }
    ]).then((answers) => {
      this.componentsRoot = answers.componentsRoot;
      this.config.set('componentsRoot', this.componentsRoot);
    });
  }
  _setlibraryBuildPath() {
    return this.prompt([
      {
        type: 'input',
        name: 'libraryBuildPath',
        message: 'Where should built files go for npm?'
      }
    ]).then((answers) => {
      this.libraryBuildPath = answers.libraryBuildPath;
      this.config.set('libraryBuildPath', this.libraryBuildPath);
    });
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
    _createReadMe();
    _createGitIgnore();
    _createLibraryPackage();
    _createNpmIgnore();
  }
  
  handleComponentsRootFiles() {
    _createIndexInventoryFile();
    _createGlobalStyleVariables();
  }
  
  handleComponentFiles() {
    _createJSFile();
    _createComponentPackage();
    _createComponentStyles();
  }
  
//TODO: rename and rework these to match above implementation
  _handleIndexInventoryFile() {
    //update if it's already there
    if(this.fs.exists(this.componentsRoot+'/index.js')) {
      this.fs.append(this.componentsRoot+'/index.js', 'export { default as '+this.componentNameReactish+' } from "./'+this.componentNamePiped+'"')
    } else { //if not create it & append to it
      this.fs.copy(
        this.templatePath('component-templates/component-index.js'),
        this.destinationPath(this.componentsRoot+'/index.js')
      )
      this.fs.append(this.componentsRoot+'/index.js', 'export { default as '+this.componentNameReactish+' } from "./'+this.componentNamePiped+'"')
    }
  }
  
  _handleReadMe() {
    if(this.fs.exists(process.cwd()+'/README.md')) {
      this.log("Skipping readme");
    } else {
      this.fs.copyTpl(
        this.templatePath('library-templates/README.md'),
        this.destinationPath(process.cwd()+'/README.md'),
        {
          libraryName: this.libraryName,
          libraryRoot: this.componentsRoot,
          libraryNamePretty: this._titleCaseStringNoSpaces(this.libraryName),
        }
      )
    }
  }
  
  _createGitIgnore() {
    if(this.fs.exists(process.cwd()+'/.gitignore')) {
      this.log("skipping gitignore");
    } else {
      this.fs.copyTpl(
        this.templatePath('library-templates/.gitignore'),
        this.destinationPath(process.cwd()+'/.gitignore'),
        {
          libraryName: this._titleCaseStringNoSpaces(this.libraryName),
          libraryRoot: this.componentsRoot,
        }
      )
    }
  }
  
  _createMainPackage() {
    if(this.fs.exists(process.cwd()+'/package.json')) {
      this.log("skipping package.json");
    } else {
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
  }
  _createNpmIgnore() {
    if(this.fs.exists(process.cwd()+'/.npmignore')) {
      this.log("skipping npm ignore file");
    } else {
      this.fs.copyTpl(
        this.templatePath('library-templates/base-npmignore.npmignore'),
        this.destinationPath(process.cwd()+'/.npmigore'),
        {
          buildFolder: this.libraryBuildPath,
        }
      )
    }
  }

  _createGlobalVars() {
    if(this.fs.exists(this.componentsRoot+'/global_style_variables.scss')) {
      this.log("Global Variables skipped bcz it exists");
    } else {
      this.fs.copyTpl(
        this.templatePath('components-root-templates/global_vars.scss'),
        this.destinationPath(this.componentsRoot+'/global_style_variables.scss'),
        { componentName: this.componentName }
      );    
    }
  }
  
  _createJSFile() {
    if(this.componentType == 'function') {
      this.fs.copyTpl(
        this.templatePath('component-templates/function.js'),
        this.destinationPath(this.componentsRoot+'/'+this._pipeString(this.componentName)+'/index.js'),
        {
          componentName: this._titleCaseStringNoSpaces(this.componentName),
          componentNamePiped: this._pipeString(this.componentName),
        }
      );  
    } else {
      this.fs.copyTpl(
        this.templatePath('component-templates/class.js'),
        this.destinationPath(this.componentsRoot+'/'+this._pipeString(this.componentName)+'/index.js'),
        {
          componentName: this._titleCaseStringNoSpaces(this.componentName),
          componentNamePiped: this._pipeString(this.componentName),
        }
      );  
    }
  }

  _createJsonFile() {
    this.fs.copyTpl(
      this.templatePath('component-templates/package.json'),
      this.destinationPath(this.componentsRoot+'/'+this._pipeString(this.componentName)+'/package.json'),
      { componentName: this._titleCaseStringNoSpaces(this.componentName) }
    );  
  }
  
  _createStyleFile() {
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