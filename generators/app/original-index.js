var Generator = require('yeoman-generator');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    
    this.argument('componentName', { type: String, required: false});
    this.argument('componentType', { type: String, required: false});
    
    this.log('Option Name', this.options.componentName);
    this.log('Option Type', this.options.componentType);
    
    this.appName = this.config.get('appName');
    this.componentsRoot = this.config.get('componentsRoot');
    this.appBuildPath = this.config.get('appBuildPath');
  }
  
  setAppName() {
    if(this.appName === undefined) {
      return this.prompt([
        {
          type: 'input',
          name: 'appName',
          message: 'What is the name of your library?'
        }
      ]).then((answers) => {
        this.appName = answers.appName;
        this.config.set('appName', this.appName);
      });
    }  
  }
  
  setAppOutput() {
    //Decide where components should go
    if(this.componentsRoot === undefined) {
      return this.prompt([
        {
          type: 'input',
          name: 'componentsRoot',
          message: 'What folder do you want to place library in?'
        }
      ]).then((answers) => {
        this.componentsRoot = answers.componentsRoot;
        this.config.set('componentsRoot', this.componentsRoot);
      });
    }
  }
  
  setAppBuildPath() {
    if(this.appBuildPath === undefined) {
      return this.prompt([
        {
          type: 'input',
          name: 'appBuildPath',
          message: 'Where should built files go for npm?'
        }
      ]).then((answers) => {
        this.appBuildPath = answers.appBuildPath;
        this.config.set('appBuildPath', this.appBuildPath);
      });
    }
  }
  
  prompting() {
    return this.prompt([
      {
        type : 'input',
        name : 'componentName',
        message : 'What is the name of your component?',
        default : this.options.componentName,
        required : true
      }, {
        type : 'input',
        name : 'componentType',
        message : 'Is this a function or a class component?',
        default : this.options.componentType ? this.options.componentType : 'function'
      }
    ]).then((answers) => {
      this.log('Component name: ', answers.componentName);
      this.log('Component Type: ', answers.componentType);
      this.componentName = answers.componentName;
      this.componentNamePiped = this._pipeString(this.componentName);
      this.componentNameReactish = this._titleCaseStringNoSpaces(this.componentName);
      this.componentType = answers.componentType;
      
      this.log('Piped Name: ', this.componentNamePiped);
      this.log('React Name: ', this.componentNameReactish);
    });
  }
  
  _pipeString(word) {
    this.log("Pipe passed: ",word);
    return(word.replace(/ /g,"-").toLowerCase());
  }
  _titleCaseStringNoSpaces(word) {
    this.log("Title passed: ",word);
    var stageWord = word.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    return(stageWord.replace(/ /g, ""));
    
  }
  
  handleIndexInventoryFile() {
    //update if it's already there
    if(this.fs.exists(this.componentsRoot+'/index.js')) {
      this.fs.append(this.componentsRoot+'/index.js', 'export { default as '+this.componentNameReactish+' } from "./'+this.componentNamePiped+'"')
    } else { //if not create it & append to it
      this.fs.copy(
        this.templatePath('component-index.js'),
        this.destinationPath(this.componentsRoot+'/index.js')
      )
      this.fs.append(this.componentsRoot+'/index.js', 'export { default as '+this.componentNameReactish+' } from "./'+this.componentNamePiped+'"')
    }
  }
  
  handleReadMe() {
    if(this.fs.exists(process.cwd()+'/README.md')) {
      this.log("Skipping readme");
    } else {
      this.fs.copyTpl(
        this.templatePath('README.md'),
        this.destinationPath(process.cwd()+'/README.md'),
        {
          appName: this.appName,
          libraryRoot: this.componentsRoot,
          appNamePretty: this._titleCaseStringNoSpaces(this.appName),
        }
      )
    }
  }
  
  createGitIgnore() {
    if(this.fs.exists(process.cwd()+'/.gitignore')) {
      this.log("skipping gitignore");
    } else {
      this.fs.copyTpl(
        this.templatePath('.gitignore'),
        this.destinationPath(process.cwd()+'/.gitignore'),
        {
          appName: this._titleCaseStringNoSpaces(this.appName),
          libraryRoot: this.componentsRoot,
        }
      )
    }
  }
  
  createMainPackage() {
    if(this.fs.exists(process.cwd()+'/package.json')) {
      this.log("skipping package.json");
    } else {
      this.fs.copyTpl(
        this.templatePath('base-package.json'),
        this.destinationPath(process.cwd()+'/package.json'),
        {
          appName: this._pipeString(this.appName),
          buildFolder: this.appBuildPath,
          libraryRoot: this.componentsRoot,
        }
      )
    }
  }
  createNpmIgnore() {
    if(this.fs.exists(process.cwd()+'/.npmignore')) {
      this.log("skipping npm ignore file");
    } else {
      this.fs.copyTpl(
        this.templatePath('base-npmignore.npmignore'),
        this.destinationPath(process.cwd()+'/.npmigore'),
        {
          buildFolder: this.appBuildPath,
        }
      )
    }
  }

  createGlobalVars() {
    if(this.fs.exists(this.componentsRoot+'/global_style_variables.scss')) {
      this.log("Global Variables skipped bcz it exists");
    } else {
      this.fs.copyTpl(
        this.templatePath('global_vars.scss'),
        this.destinationPath(this.componentsRoot+'/global_style_variables.scss'),
        { componentName: this.componentName }
      );    
    }
  }
  
  createJSFile() {
    if(this.componentType == 'function') {
      this.fs.copyTpl(
        this.templatePath('function.js'),
        this.destinationPath(this.componentsRoot+'/'+this.componentNamePiped+'/index.js'),
        {
          componentName: this.componentNameReactish,
          componentNamePiped: this.componentNamePiped,
        }
      );  
    } else {
      this.fs.copyTpl(
        this.templatePath('class.js'),
        this.destinationPath(this.componentsRoot+'/'+this.componentNamePiped+'/index.js'),
        {
          componentName: this.componentNameReactish,
          componentNamePiped: this.componentNamePiped,
        }
      );  
    }
  }

  createJsonFile() {
    this.fs.copyTpl(
      this.templatePath('package.json'),
      this.destinationPath(this.componentsRoot+'/'+this.componentNamePiped+'/package.json'),
      { componentName: this.componentNameReactish }
    );  
  }
  
  createStyleFile() {
    this.fs.copyTpl(
      this.templatePath('style.scss'),
      this.destinationPath(this.componentsRoot+'/'+this.componentNamePiped+'/style.scss'),
      {
        componentName: this.componentName,
        componentNamePiped: this.componentNamePiped,
      }
    );  
  }

};