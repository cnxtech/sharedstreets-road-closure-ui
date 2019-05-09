import { Button } from '@blueprintjs/core';
import * as React from 'react';
import './sharedstreets-map-draw-control.css';

export interface ISharedStreetsMapDrawControlProps {
    numberOfPointsSelected: number,
    isFetchingMatchedStreets: boolean,
    onStart: (e: any) => void,
    onConfirm: (e: any) => void,
    onCancel: (e: any) => void,
    onUndo: (e: any) => void,
};

class SharedStreetsMapDrawControl extends React.Component<ISharedStreetsMapDrawControlProps, any> {
  public state = {
    isDrawControlToggled: false,
  }

  public handleStartDrawing = (e: any) => {
    this.setState({
      isDrawControlToggled: true,
    });
    this.props.onStart(e);
  }

  public handleConfirmDrawing = (e: any) => {
    this.setState({
      isDrawControlToggled: false,
    });
    this.props.onConfirm(e);
  }

  public handleCancelDrawing = (e: any) => {
    this.setState({
      isDrawControlToggled: false,
    });
    this.props.onCancel(e);
  }

  public handleUndoLastDrawing = (e: any) => {
    if (this.props.numberOfPointsSelected === 1) {
      this.handleCancelDrawing(e);
    } else {
      this.props.onUndo(e);
    }

  }

  public render() {
    return (
        <React.Fragment>
          <Button
              title={"Click to begin selecting points to draw a line"}
              className={"SHST-Map-Draw-Control-Button"}
              icon={"highlight"}
              disabled={this.state.isDrawControlToggled}
              onClick={this.handleStartDrawing}
              text={"Draw"}
              loading={this.props.isFetchingMatchedStreets}
          />
          {
            this.state.isDrawControlToggled &&
            <React.Fragment>
              <Button
                disabled={this.props.numberOfPointsSelected < 2}
                title={this.props.numberOfPointsSelected < 2 ?
                  "Select at least two points to search for a match"
                  : "Click to confirm drawn selection"
                }
                className={"SHST-Map-Draw-Control-Confirm-Button"}
                intent={'success'}
                icon={"tick"}
                text={"Search for match"}
                onClick={this.handleConfirmDrawing}
              />
              <Button
                title={"Click to cancel drawn selection"}
                className={"SHST-Map-Draw-Control-Cancel-Button"}              
                intent={'danger'}
                icon={"cross"}
                text={"Cancel"}
                onClick={this.handleCancelDrawing}
              />
              <Button
                disabled={this.props.numberOfPointsSelected < 1}
                title={"Click to undo last point selection"}
                className={"SHST-Map-Draw-Control-Undo-Button"}
                intent={"primary"}
                icon={"undo"}
                text={"Undo"}
                onClick={this.handleUndoLastDrawing}
              />
            </React.Fragment>
          }
        </React.Fragment>
    );
  }
}

export default SharedStreetsMapDrawControl;
