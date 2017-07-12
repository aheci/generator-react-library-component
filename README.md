# Scaffolding for creating a new component in a component library

## Instructions
1. `yo react-library-component`
2. Follow prompts

or

1. `yo react-library-component [ComponentName] [component type (class or function)]`

## First Time Setup Instructions
- Each time you run `yo react-library-component` the generator will check for a set of required configurations in your `yo-rc.json` file including:
  - appName: the name of your library (enter as space seperated words, the generator will pipe and title case them as needed)
  - componentRoot:  The folder that you want to develop your react components from 
  - appBuildPath:  The folder that you want babel to place your compiled components in.  This config is used in a generated npmignore file - set to ignore everything except for this compiled folder
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

## Creates The Following
- index.js file basic react component - function or class scaffolded depending on user input.  automatically imports component style sheet & creates wrapper div
- style.scss file that automatically imports global style variables & creates wrapping class
- package.json for the component
- Appends component to library's root index.js inventory file
- global style variable file - for projects to import or record placeholders, mixins, and variables accessible by each component (to avoid duplicated code these files should not include any actual css rules, only variables, mixins, and placeholders).

## Wishlist
- Create library beginning scaffolding to run first & then individual components created within
  - Include webpack configuration to build library scss to css & babel
  - Include ESLint 
  - Include Stylelint
  - (cli prompts on build & a11y).
- Configure install
- Add documentation generator for each component
- Add test file for each component
- Add HOC template
- For each HOC component ability to generate a component that uses the HOC
- Create themed components
- Add command to delete a component
- Remove log notes for debugging
- Allow components to go into a subdirectory of the library
- Allow styling options (currently scss only - what about less or vanilla css?)