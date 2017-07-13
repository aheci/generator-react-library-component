# Scaffolding for creating a new component in a component library

## Instructions
1. `yo react-library-component`
2. Follow prompts

or

1. `yo react-library-component [ComponentName] [component type (class or function)]`
2. Follow prompts

## First Time Setup Instructions
- Each time you run `yo react-library-component` the generator will check for a set of required configurations in your `yo-rc.json` file including:
  - libraryName: the name of your library (enter as space seperated words, the generator will pipe and title case them as needed)
  - componentsRoot:  The folder that you want to develop your react components from 
  - libraryBuildPath:  The folder that you want babel to place your compiled components in.  This config is used in a generated npmignore file - set to ignore everything except for this compiled folder
- The generator also checks the root of your library for the following files, if they exist it **does not** edit them.  If they don't exist, it will create them with some basic defaults:
  - README.md - If no readme exists you will get a basic starting point with instructions on creating and using components based on your initial configurations
  - package.json - If no package.json exists you will get a basic starting point based on your initial configurates.  If you already have one, make sure it includes the following packages:
    - react (dependency)
    - react-dom (dependency)
    - babel-cli (dev-dependency)
    - babel-preset-react (dev dependency)
    - babel-preset-stage-0 (dev dependency)
  Also add this to the script section:
  
  ```
  "scripts": {
    "create": "babel [libraryRoot] --out-dir [buildFolder] --copy-files"
  }
  ```
  
  Where `libraryRoot` is your component development folder and `buildFolder` is your component build folder
  - .npmignore - will create basic implementation if this file doesn't already exist.
  - .gitignore - will create basic implementation if this file doesn't already exist.
  - .yo-rc.json - will hold your config options set during initial run of generator
  - /componentsRoot/global_style_variables.scss - is placed in your development folder - this file will be imported into each component's scss file to allow access to any placeholders, mixins, and variables you may want to share between components (to avoid duplicated code these files should not include any actual css rules, only variables, mixins, and placeholders).
  - /componentsRoot/index.js - this file is appended to each time you create a new component and is used to map each component to it's folder so that consumers of your library do not have to understand your file tree to make use of a component.

## Creates The Following
After initial run, the following files are created each time you create a new component
- index.js file basic react component - function or class scaffolded depending on user input.  automatically imports component style sheet & creates wrapper div
- style.scss file that automatically imports global style variables & creates wrapping class
- package.json for the component
