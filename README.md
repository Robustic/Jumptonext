# Jumptonext

Jumptonext is a web application which shows to the user next departures from the selected stop. Jumptonext works in the Helsinki metropolitan area. It queries timeschedules for HSL public transport automaticly. 

Jumptonext is free for all! Registration or password not needed.

## Heroku

[Jumptonext in Heroku](https://jumptonext.herokuapp.com/) (Note! It can take about 15 seconds when web server starts.)

## CircleCI

[![CircleCI](https://circleci.com/gh/Robustic/Jumptonext.svg?style=svg)](https://circleci.com/gh/Robustic/Jumptonext)

## Instructions for use

You can start to use Jumptonext by clicking link to the application [https://jumptonext.herokuapp.com/](https://jumptonext.herokuapp.com/). Starting can take about 15 seconds depending on the last web server start.

In the general view you can select right stop by writing stop name as input or clicking from the map.

<img src="https://github.com/Robustic/Jumptonext/blob/master/documentation/generalview.png" width="699">

When you write stop name to the input field, application shows all stops which name contains given string.

<img src="https://github.com/Robustic/Jumptonext/blob/master/documentation/viewwithgivenstring.png" width="699">

You can go to the one stop view by clicking button relaited to your choice.

<img src="https://github.com/Robustic/Jumptonext/blob/master/documentation/onestopselected.png" width="700">

In the one stop view you can see next departures from the selected stop and time left for the each departure.

You can reselect other stop by clicking "Reselect stop" button and make other selection.

As an alternative to the text search you can select stop from the map. You can pan and zoom to the right place on the map. When right stop is visible on the map you can choose it by clicking its icon on the map.

<img src="https://github.com/Robustic/Jumptonext/blob/master/documentation/selectedstopfrommap.png" width="696">

## How Jumptonext works

Jumptonext uses [Realtime API](https://digitransit.fi/en/developers/apis/4-realtime-api/) provided by the external service provider ([[Realtime API license](https://digitransit.fi/en/developers/)). Timetables and stop informations are collected as realtime from the Realtime API. Queries to the API are done according to the user activities.

Map in the Jumptonext view is generated with [Leaflet](https://leafletjs.com/). Map is [OpenStreetMap](https://www.openstreetmap.org/copyright) which is open data.

<img src="https://github.com/Robustic/Jumptonext/blob/master/documentation/architecture.png" width="534">

Information is got directly from the external APIs because up-to-date information is needed. General stop information is got only once when application starts on the browser because general stop information is not changed so often and mount of the information is large. Detailed realtime timetables for the selected stops are updated every 10th second because mount of the information is limited and up-to-date information is needed.

Testing of the Jumptonext is carried out with Jest. All the most important functions and components are tested.

## Available Scripts

In the project directory, you can run:

### `npm run try`

Runs the app in the development mode.

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm test`

Launches the test runner in the interactive watch mode.

### `npm run coverage`

Shows the test coverage report in the interactive watch mode.
