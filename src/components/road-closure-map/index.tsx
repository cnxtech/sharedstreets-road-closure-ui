import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
// import { 
//   lineString,
//   // point
// } from '@turf/helpers';
import {
  forEach,
  // isEmpty,
} from 'lodash';
import * as mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import * as React from 'react';
import { IRoadClosureState } from 'src/store/road-closure';
// import BaseControl from '../base-map-control';
// import UndoButtonMapControl from '../undo-button-map-control';
import './road-closure-map.css';

// tslint:disable-next-line
const MapboxDraw = require('@mapbox/mapbox-gl-draw');

(mapboxgl as any).accessToken = "pk.eyJ1IjoidHJhbnNwb3J0cGFydG5lcnNoaXAiLCJhIjoiY2ptOTN5N3Q3MHN5aDNxbGs2MzhsN3dneiJ9.K4j9mXsvfGCYtM8YouwCKg";

export interface IRoadClosureMapProps {
  findMatchedStreet: (payload: any) => void,
  lineCreated: (payload: any) => void,
  lineDeleted: (payload: any) => void,
  lineEdited: (payload: any) => void,
  pointRemoved: () => void,
  pointSelected: (payload: any) => void,
  roadClosure: IRoadClosureState
};

export interface IRoadClosureMapState {
  viewport: object
}

class RoadClosureMap extends React.Component<IRoadClosureMapProps, IRoadClosureMapState> {
  public state = {
    selectedPoints: [],
    viewport: {
      latitude: 47.608791594905625,
      longitude: -122.3348826226224,
      zoom: 13
    },
  }

  public mapContainer: any;
  public draw: any;

  public componentDidMount() {
    const {
      viewport: {
        latitude,
        longitude,
        zoom,
      }
    } = this.state;

    this.mapContainer = new mapboxgl.Map({
      center: [longitude, latitude],
      container: 'SHST-RoadClosure-Map',
      style: 'mapbox://styles/mapbox/streets-v9',
      zoom
    });

    this.draw = new MapboxDraw({
      controls: {
        line_string: true,
        trash: true
      },
      displayControlsDefault: false,
    });

    this.mapContainer.on('move', this.handleMapMove);
    // this.mapContainer.on('click', this.handleMapClick);
    this.mapContainer.addControl(
      this.draw,
      'top-left'
    );
    this.mapContainer.on('draw.create', this.handleLineCreated);
    this.mapContainer.on('draw.delete', this.handleLineDeleted);
    this.mapContainer.on('draw.update', this.handleLineEdited);
    // this.mapContainer.addControl(
    //   new mapboxgl.FullscreenControl()
    // );
    // this.mapContainer.addControl(
    //   new BaseControl("SHST-Undo-Point-Select-Container", UndoButtonMapControl, this.props.pointRemoved)
    // );
  }

  public componentDidUpdate(prevProps: IRoadClosureMapProps) {
    const {
      currentIndex,
      // currentSelectionIndex,
      items
    } = this.props.roadClosure;

    // const selectedPointsCurrentSelection = items[currentIndex].selectedPoints[currentSelectionIndex];

    // const prevCurrentIndex = prevProps.roadClosure.currentIndex;
    // const prevCurrentSelectionIndex = prevProps.roadClosure.currentSelectionIndex;
    // const prevSelectedPointsCurrentSelection = prevProps.roadClosure.items[prevCurrentIndex].selectedPoints[prevCurrentSelectionIndex];

    // draw point on click 
    // if (!isEmpty(selectedPointsCurrentSelection) &&
    //   // selectedPointsCurrentSelection.length !== prevSelectedPointsCurrentSelection.length && 
    //   currentIndex === prevCurrentIndex &&
    //   currentSelectionIndex === prevCurrentSelectionIndex) {
    //     forEach(items[currentIndex].selectedPoints, (selectedPointsForStreet, index) => {
    //       const lngLat = selectedPointsForStreet[selectedPointsForStreet.length-1] as any;
    //       const el = document.createElement('div');
    //       el.className = 'SHST-Map-Point-Marker';
    //       new mapboxgl.Marker(el)
    //         .setLngLat(lngLat)
    //         .addTo(this.mapContainer);
    //       // const drawPoint = point(lngLat);
    //       // this.drawFromGeojson("SHST-user-point-"+lngLat.lat.toString()+lngLat.lng.toString(), "circle", drawPoint, {
    //       //   "circle-color": "#3887be",
    //       //   "circle-radius": 10,
    //       // });

    //       if (selectedPointsForStreet.length >= 2) {
    //         const coords: any = [];
    //         selectedPointsForStreet.forEach((v: any) => {
    //           coords.push([v.lng, v.lat])
    //         });
    //         // coords.push([lngLat.lng, lngLat.lat]);
    //         const linestring = lineString(coords);
      
    //         this.drawFromGeojson("SHST-user-line-"+linestring.id, "line", linestring, {
    //           "line-color": "orange",
    //           "line-dasharray": [2,1],
    //           "line-opacity": 0.35,
    //           "line-width": 6,
    //         });
    //       }
    //     });
    // }

    // draw SharedStreets matched lines after API response
    if (!this.props.roadClosure.isFetchingMatchedStreets && prevProps.roadClosure.isFetchingMatchedStreets) {
      forEach(items[currentIndex].matchedStreets, (matchedStreetList, outerIndex) => {
        forEach(matchedStreetList, (matchedStreet, index) => {
          // TODO - draw linestrings separately from points, etc
          this.drawFromGeojson("SHST-match-geom-line-"+outerIndex+index, "line", matchedStreet, {
            "line-color": "blue",
            "line-opacity": 0.35,
            "line-width": 6,
          });
        })
      });
    }
    
  }

  public handleViewportChange = (viewport: any) => {
    this.setState({viewport});
  }

  public handleMapMove = () => {
    const { lng, lat } = this.mapContainer.getCenter();
    this.setState({
      viewport: {
        latitude: lat.toFixed(4),
        longitude: lng.toFixed(4),
        zoom: this.mapContainer.getZoom().toFixed(2)
      }
    });
  }

  public handleLineCreated = (e: { type: string, target: any, features: GeoJSON.Feature[]}) => {
    this.props.lineCreated(e.features[0]);
    this.props.findMatchedStreet(e.features[0]);
  }

  public handleLineDeleted = (e: { type: string, target: any, features: GeoJSON.Feature[]}) => {
    this.props.lineDeleted(e.features[0]);
    // this.props.findMatchedStreet();
  }

  public handleLineEdited = (e: { type: string, target: any, features: GeoJSON.Feature[]}) => {
    this.props.lineCreated(e.features[0]);
    this.props.findMatchedStreet(e.features[0]);
  }

  // public handleMapClick = (event: any) => {
  //   const {
  //     roadClosure: {
  //       currentIndex,
  //       currentSelectionIndex,
  //       items,
  //       isShowingRoadClosureList,
  //       isShowingRoadClosureOutputViewer,
  //     }
  //   } = this.props;

  //   if (isShowingRoadClosureList || isShowingRoadClosureOutputViewer) {
  //     return;
  //   }

  //   this.props.pointSelected(event.lngLat);
  //   if (items[currentIndex].selectedPoints[currentSelectionIndex] && items[currentIndex].selectedPoints[currentSelectionIndex].length > 1) {
  //     this.props.findMatchedStreet();
  //   }
  // }

  public drawFromGeojson(id: string, type: string, geojsonData: object, paintObj: any = {}) {
    if (typeof this.mapContainer.getLayer(id) !== 'undefined') {
      this.mapContainer.removeLayer(id);
      this.mapContainer.removeSource(id);
    }
    this.mapContainer.addSource(id, {
      data: geojsonData,
      type: "geojson"
    });
    this.mapContainer.addLayer({
      "id": id,
      "paint": paintObj,
      "source": id,
      "type": type,
    });
  }

  public render() {
    return (
      <div className={'SHST-RoadClosure-Map-Container'}>
        <div id={'SHST-RoadClosure-Map'} style={{
          height: '100%',
          margin: '0 auto',
          width: '100%',
        }} />
      </div>
    );
  }
}

export default RoadClosureMap;