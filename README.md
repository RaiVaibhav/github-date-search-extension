# GitHub Search Chrome Extension
a chrome extension which adds in calendar support for GitHub main search bar. A checkbox placed in the GitHub main search bar which opens a calendar to add in the selected date to the search input text.

Eg. If the date selected was 2019 March 13th then the text "created:>2019-03-13" gets amended to search input text field.

## Installation

```
git clone https://github.com:RaiVaibhav/github-date-search-extension.git
```
Go to `github-date-search-extension` directory run

```
yarn install
```
Now build the extension using
```
yarn build
```
You will see a `build` folder generated inside `[PROJECT_HOME]`

## Add extension to Chrome

Go to chrome://extensions page and switch on developer mode.

Now click on the `LOAD UNPACKED` and browse to `[PROJECT_HOME]\build` .This will install the React app as a Chrome extension.

(Facing issue in icluding the fontawesome refer [here](https://stackoverflow.com/questions/37216209/how-to-have-webpack-include-font-awesome-woff-files-in-a-react-based-chrome-exte/55188100#55188100))

## Demo

![Githubchromeextension](https://user-images.githubusercontent.com/22278438/54488725-54d02980-48cb-11e9-9967-de32637ac327.gif)
