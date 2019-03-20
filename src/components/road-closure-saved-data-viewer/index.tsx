import {
    // Button,
    // ButtonGroup,
} from '@blueprintjs/core';
import * as React from 'react';
// import { Link } from 'react-router-dom';
// import { generateUploadUrlsFromHash } from 'src/utils/upload-url-generator';
// import RoadClosureBottomActionBar from '../road-closure-bottom-action-bar';
import { RoadClosureStateItem } from 'src/models/RoadClosureStateItem';
import { IRoadClosureUploadUrls } from 'src/utils/upload-url-generator';
import RoadClosureSavedDataItem from '../road-closure-saved-data-item';
import './road-closure-saved-data-viewer.css';


export interface IRoadClosureSavedDataViewerProps {
    allRoadClosureItems: RoadClosureStateItem[],
    allRoadClosuresUploadUrls: IRoadClosureUploadUrls[],
    isLoadingAllRoadClosures: boolean,
    orgName: string,
    loadAllRoadClosures: () => void
};

export interface IRoadClosureSavedDataViewerState {
    isSavedUrlsDialogOpen: boolean;
}

class RoadClosureSavedDataViewer extends React.Component<IRoadClosureSavedDataViewerProps, IRoadClosureSavedDataViewerState> {
    public constructor(props: IRoadClosureSavedDataViewerProps) {
        super(props);
        this.handleClickRoadClosure = this.handleClickRoadClosure.bind(this);
        this.handleCloseDialog = this.handleCloseDialog.bind(this);
        this.handleClickCreate = this.handleClickCreate.bind(this);
        this.handleSelectFormat = this.handleSelectFormat.bind(this);
        this.state = {
            isSavedUrlsDialogOpen: false,
        };
    }

    public handleClickRoadClosure(e: any) {
        return;
    }
    
    public handleCloseDialog(e: any) {
        this.setState({
            isSavedUrlsDialogOpen: false,
        });
    }

    public handleClickCreate() {
        // this.props.hideRoadClosureOutput();
    }
    public handleSelectFormat(e: any) {
        // this.props.selectOutputFormat(e.target.value);
    }

    public render() {
        return (
            <div className={"SHST-Road-Closure-Saved-Data-Viewer"}>
                <div className={"SHST-Road-Closure-Saved-Data-Viewer-List"}>
                    {this.props.allRoadClosureItems.length === 0 &&
                        <div className="bp3-non-ideal-state">
                            <div className="bp3-non-ideal-state-visual">
                                <span className="bp3-icon bp3-icon-arrow-top-right" />
                            </div>
                            <h4 className="bp3-heading">
                            { "Create a new road closure!" }
                            </h4>
                        </div>
                    }
                    {this.props.allRoadClosureItems && 
                        Object.keys(this.props.allRoadClosureItems).map((roadClosureId: any) => {
                            return <RoadClosureSavedDataItem
                                        key={roadClosureId} 
                                        item={this.props.allRoadClosureItems[roadClosureId]}
                                        uploadUrls={this.props.allRoadClosuresUploadUrls[roadClosureId]} />
                        })
                    }
                </div>
            </div>
        );
    }
}

export default RoadClosureSavedDataViewer;
