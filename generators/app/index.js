var Generator = require('yeoman-generator');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    
    this.libraryName = this.config.get('libraryName');
    this.componentRoot = this.config.get('componentRoot');
    this.libraryBuildPath = this.config.get('libraryBuildPath');
    
    this.argument('componentName', { type: String, required: false});
    this.argument('componentType', { type: String, required: false});
    
  }
  
  setLibraryName() {
    if(this.libraryName === undefined) {
      return this.prompt([
        {
          type: 'input',
          name: 'libraryName',
          message: 'What is the name of your library?'
        }
      ]).then((answers) => {
        this.libraryName = answers.libraryName;
        this.config.set('libraryName', this.libraryName);
      });
    }  
  }
  
  setAppOutput() {
    //Decide where components should go
    if(this.componentRoot === undefined) {
      return this.prompt([
        {
          type: 'input',
          name: 'componentRoot',
          message: 'What folder do you want to place library in?'
        }
      ]).then((answers) => {
        this.componentRoot = answers.componentRoot;
        this.config.set('componentRoot', this.componentRoot);
      });
    }
  }
  
  setlibraryBuildPath() {
    if(this.libraryBuildPath === undefined) {
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
      this.componentNameReactish = this._titleCaseString(this.componentName);
      this.componentType = answers.componentType;
      
      this.log('Piped Name: ', this.componentNamePiped);
      this.log('React Name: ', this.componentNameReactish);
    });
  }
  
  _pipeString(word) {
    this.log("Pipe passed: ",word);
    return(word.replace(/ /g,"-").toLowerCase());
  }
  _titleCaseString(word) {
    this.log("Title passed: ",word);
    var stageWord = word.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    return(stageWord.replace(/ /g, ""));
    
  }
  
  handleIndexInventoryFile() {
    //update if it's already there
    if(this.fs.exists(this.componentRoot+'/index.js')) {
      this.fs.append(this.componentRoot+'/index.js', 'export { default as '+this.componentNameReactish+' } from "./'+this.componentNamePiped+'"')
    } else { //if not create it & append to it
      this.fs.copy(
        this.templatePath('component-index.js'),
        this.destinationPath(this.componentRoot+'/index.js')
      )
      this.fs.append(this.componentRoot+'/index.js', 'export { default as '+this.componentNameReactish+' } from "./'+this.componentNamePiped+'"')
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
          libraryName: this.libraryName,
          libraryRoot: this.componentRoot,
          libraryNamePretty: this._titleCaseString(this.libraryName),
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
          libraryName: this._titleCaseString(this.libraryName),
          libraryRoot: this.componentRoot,
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
          libraryName: this._pipeString(this.libraryName),
          buildFolder: this.libraryBuildPath,
          libraryRoot: this.componentRoot,
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
          buildFolder: this.libraryBuildPath,
        }
      )
    }
  }

  createGlobalVars() {
    if(this.fs.exists(this.componentRoot+'/global_style_variables.scss')) {
      this.log("Global Variables skipped bcz it exists");
    } else {
      this.fs.copyTpl(
        this.templatePath('global_vars.scss'),
        this.destinationPath(this.componentRoot+'/global_style_variables.scss'),
        { componentName: this.componentName }
      );    
    }
  }
  
  createJSFile() {
    if(this.componentType == 'function') {
      this.fs.copyTpl(
        this.templatePath('function.js'),
        this.destinationPath(this.componentRoot+'/'+this.componentNamePiped+'/index.js'),
        {
          componentName: this.componentNameReactish,
          componentNamePiped: this.componentNamePiped,
        }
      );  
    } else {
      this.fs.copyTpl(
        this.templatePath('class.js'),
        this.destinationPath(this.componentRoot+'/'+this.componentNamePiped+'/index.js'),
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
      this.destinationPath(this.componentRoot+'/'+this.componentNamePiped+'/package.json'),
      { componentName: this.componentNameReactish }
    );  
  }
  
  createStyleFile() {
    this.fs.copyTpl(
      this.templatePath('style.scss'),
      this.destinationPath(this.componentRoot+'/'+this.componentNamePiped+'/style.scss'),
      {
        componentName: this.componentName,
        componentNamePiped: this.componentNamePiped,
      }
    );  
  }

};