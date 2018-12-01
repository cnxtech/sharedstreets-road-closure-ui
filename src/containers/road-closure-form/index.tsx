import { connect } from 'react-redux';
import { currentRoadClosureItemSelector, streetnameMatchedStreetIndexMap } from 'src/selectors/road-closure';
import { RootState } from 'src/store/configureStore';
import RoadClosureForm, { IRoadClosureFormProps } from '../../components/road-closure-form';
import { ACTIONS } from '../../store/road-closure';

const mapStateToProps = (state: RootState) => ({
    currentRoadClosureItem: currentRoadClosureItemSelector({
        roadClosure: state.roadClosure
    }),
    roadClosure: state.roadClosure,
    streetnameMatchedStreetIndexMap: streetnameMatchedStreetIndexMap(state),
});

export default connect<{}, {}, IRoadClosureFormProps>(
    mapStateToProps,
    {
        addNewStreet: ACTIONS.ADD_NEW_STREET,
        inputChanged: ACTIONS.INPUT_CHANGED,
    },
)(RoadClosureForm) as React.ComponentClass<{}>;