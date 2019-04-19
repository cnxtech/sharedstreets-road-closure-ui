import { connect } from 'react-redux';
import RoadClosureHeaderMenu, { IRoadClosureHeaderMenuProps } from 'src/components/road-closure-header-menu';
import { RootState } from 'src/store/configureStore';
import {
    ACTIONS,
    loadRoadClosure
} from '../../store/road-closure';

export interface IRoadClosureHeaderMenuContainerProps {
    edit?: boolean,
    explore?: boolean,
}

const mapStateToProps = (state: RootState, ownProps: IRoadClosureHeaderMenuContainerProps) => ({
    edit: ownProps.edit,
    explore: ownProps.explore,
    geojsonUploadUrl: state.roadClosure.uploadUrls.geojsonUploadUrl,
    isEditingExistingClosure: state.roadClosure.isEditingExistingClosure,
    isFetchingInput: state.roadClosure.isFetchingInput,
    isGeneratingUploadUrl: state.roadClosure.isGeneratingUploadUrl,
    orgName: state.roadClosure.orgName,
});

export default connect<{}, {}, IRoadClosureHeaderMenuProps>(
    mapStateToProps,
    {
        clearRoadClosure: ACTIONS.RESET_ROAD_CLOSURE,
        loadRoadClosure,
    },
)(RoadClosureHeaderMenu) as React.ComponentClass<IRoadClosureHeaderMenuContainerProps>;