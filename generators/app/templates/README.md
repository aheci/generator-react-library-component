# <%= appNamePretty %> Component Library

## Document How to run it
- make sure Yeoman is installed globally on your computer
- create a folder for your project `cd` into the folder (the root of your new library)
- alternately - can be run from root of existing project (will not overwrite your package.json, readme, npmignore, or gitignore if they already exist)
- run `yo react-library-component`
- Enter component name with spaces.  Will automatically TitleCase these to match react best practices and pipe them for wrapper class generation.  (We use all lower case, piped, file names and classes)
- Respond `y` to prompt about overwriting the `<%= libraryRoot %>/index.js` file.  This will not actually overwrite but will append your added component to the end of this file.
- Alternatly can run `yo react-library-component "component name" [function or class]` (quotes required when component has a space in it's name)
- After first time generator runs execute `yarn install` to download required node modules

## Creating Library Components
- After running the generator you can modify, add, or remove parts of the generated content from your `<%= libraryRoot %>/[component-name]` folder
  - styling done in `<%= libraryRoot %>/[component-name]/style.scss`
  - structure and logic done in `<%= libraryRoot %>/[component-name]index.js`

## Document How to build it for production/reuse
- run `yarn create` to run babel to compile js code to output directory
- run `npm publish` to publish library to npm, `.npmignore` file has been created for you to include only your compiled library folder.


## Document how to use the library in another project

1.  Add the library as dev dependency `yarn add <%= appName %> --dev`
2.  Example - use library title component:
  - import the component: `import {Title} from '<%= appName %>'`
  - use the imported component: `<Title text="Testing Library Title Component" />`
3.  Make sure Webpack is configured to handle SCSS files


## Deleting components from the library
1. Delete the component's entire folder
2. Delete the line for the component from the `<%= libraryRoot %>/index.js` file