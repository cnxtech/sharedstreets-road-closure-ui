# SharedStreets Constructions, Incidents, and Closures Ingestion UI
This is a lightweight web app for cities to generate road construction, incidents, and closures data, utilizing the [SharedStreets Referencing System](https://github.com/sharedstreets/sharedstreets-ref-system) to provide a shared, non-proprietary way of describing this information for use in consumer applications.


## Table of Contents
- Running the application 
- Using the application
- Output formats
- Building on top of the SharedStreets API
- UI Technical Details
- Upcoming development
- Future development

## Running the application locally/on your own computer

To run the application yourself on your local computer, you will need a Linux or Mac. Then, make sure you have node js and npm installed ([see here for instructions](https://www.npmjs.com/get-npm)), as well as yarn ([see here for instructions](https://yarnpkg.com/lang/en/docs/install/)).

Then, you have to [clone this repository](https://help.github.com/articles/cloning-a-repository/):
```
git clone https://github.com/sharedstreets/sharedstreets-road-closure-ui.git
```
Then, install the required dependencies:
```
cd sharedstreets-road-closure-ui/
yarn install 
```
You'll have to create a file named `app.config.json` in the application's `src` directory.
You can simply make a copy of the included file `app.config.template.json` and populate the values appropriately:
```
{
    "base_server_url": "",
    "server_port": 3001
}
```
Next, you need to build the application by running this command:
```
yarn build:local
```
This will create a build of the web app that relies on the included `server.ts`.
Note that this command sets the environment variable `REACT_APP_LOCAL_SERVER` to `true`.

Before you can start that server, you'll have to create a file named `server.config.json` in the application's root (topmost) directory.
You can simply make a copy of the included file `server.config.template.json` and populate the values appropriately:
```
{
    "directory": "/full/path/to/road/closure/files/directory",
    "extent": [min X coordinate, min Y coordinate, max X coordinate, max Y coordinate],
    "port": 3001 (or any port number you want. If you change this, you'll also have to change it elsewhere.)
}
```

And then finally, you can run the application:
```
yarn server
```
By default, the application will run at the following URL: http://localhost:3001 unless you've configured it otherwise.

## Using the application

![Animated walkthrough of selecting streets on the map](docs/img/RoadClosure-Readme-Walkthru-1.gif)
![Animated walkthrough of filling out the form to describe the closure incident](docs/img/RoadClosure-Readme-Walkthru-2.gif)
![Animated walkthrough of viewing final output](docs/img/RoadClosure-Readme-Walkthru-3.gif)

## Building on top of the SharedStreets API

This web application relies on the [SharedStreets API](https://github.com/sharedstreets/sharedstreets-api), specifically a [geometry matching endpoint](https://github.com/sharedstreets/sharedstreets-api/blob/master/match/geoms.md).  This endpoint takes in GeoJSON LineStrings or FeatureCollections, as well as other SharedStreets-specific parameters, and returns SharedStreets line references that match the input, as well as invalid and unmatched references.


## UI Technical Details

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

Below you will find some information on how to perform common tasks.<br>
You can find the most recent version of this guide [here](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md).

This project also makes heavy use of [Redux](https://redux.js.org), a state container for web applications.

## Upcoming development

- Selecting streets by name
- Bulk data input
- Finer-grained data viewing

## Future development
- Pluggable output formats
