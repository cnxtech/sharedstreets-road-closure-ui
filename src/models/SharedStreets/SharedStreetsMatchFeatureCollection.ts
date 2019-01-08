import { 
    Feature,
    FeatureCollection,
} from 'geojson';
import {
    // forEach,
    isEmpty,
} from 'lodash';
import { SharedStreetsMatchPath } from './SharedStreetsMatchPath';
import { SharedStreetsMatchPoint } from './SharedStreetsMatchPoint';

export class SharedStreetsMatchFeatureCollection implements FeatureCollection {
    public type: "FeatureCollection" = "FeatureCollection";
    public features: Array<SharedStreetsMatchPath | SharedStreetsMatchPoint> = [];
    protected referenceIdFeatureMap: { [refId: string]: SharedStreetsMatchPath } = {};
    /**
     * addFeatures
     */
    public addFeatures(newFeatures: Array<SharedStreetsMatchPath | SharedStreetsMatchPoint>) {
        this.features = this.features.concat(newFeatures);
    }

    public addFeaturesFromGeojson(newFeatures: Feature[]) {
        const newFeaturesArray: Array<SharedStreetsMatchPath | SharedStreetsMatchPoint> = newFeatures.map((feature: Feature) => {
            if (feature.geometry.type === "Point") {
                const point = new SharedStreetsMatchPoint(feature);
                // this.referenceIdFeatureMap[point.properties.id] = point;
                return point;
            }
            else {
                const path = new SharedStreetsMatchPath(feature);
                this.referenceIdFeatureMap[path.properties.referenceId] = path;
                return path;
            }
        });
        this.features = this.features.concat(newFeaturesArray);
    }

    /**
     * getContiguousPaths
     * this does depth-first search on the `features` array on this class to find
     * paths connected by their intersection IDs, grouped by street name. 
     */
    public getContiguousPaths(): Array<Array<SharedStreetsMatchPath | SharedStreetsMatchPoint>> {
        const output: Array<Array<SharedStreetsMatchPath | SharedStreetsMatchPoint>> = [];
        let innerOutput: Array<SharedStreetsMatchPath | SharedStreetsMatchPoint> = [];

        const refIdStack = Object.keys(this.referenceIdFeatureMap).map((refId, index) => {
            return {
                refId,
                visited: false,
            }
        });

        while (!isEmpty(refIdStack)) {
            const curr = refIdStack.pop();
            const currFeature = this.referenceIdFeatureMap[curr!.refId];
            // tslint:disable
            console.log("top of loop => curr", curr);
            console.log("top of loop => currFeature", currFeature);
            // tslint:enable
            if (!curr!.visited) {
                curr!.visited = true;
                innerOutput.push(currFeature);
                
                const adjacentPaths = refIdStack.filter((item) => {
                    const refIdStackItemFeature = this.referenceIdFeatureMap[item.refId];
                    if (refIdStackItemFeature === currFeature) {
                        return false;
                    }
                    if ( !item.visited &&
                        refIdStackItemFeature.properties.streetname === currFeature.properties.streetname &&
                        refIdStackItemFeature.properties.direction === currFeature.properties.direction &&
                        (
                            refIdStackItemFeature.properties.toIntersectionId === currFeature.properties.fromIntersectionId ||
                            refIdStackItemFeature.properties.fromIntersectionId === currFeature.properties.toIntersectionId ||
                            refIdStackItemFeature.properties.toIntersectionId === currFeature.properties.toIntersectionId ||
                            refIdStackItemFeature.properties.fromIntersectionId === currFeature.properties.fromIntersectionId
                        )
                    ) {
                        return true;
                    }
                    else {
                        return false;
                    }
                });

                // if no adjacent paths, add to main output
                if (isEmpty(adjacentPaths)) {
                    output.push(innerOutput);
                    innerOutput = [];
                } else {
                    // append them to refIdStack to look at next
                    
                    // tslint:disable
                    console.log("before push stack", refIdStack);
                    refIdStack.push(...adjacentPaths);
                    console.log("pushed to stack", adjacentPaths);
                    // tslint:enable
                }
            } else {
                // if visited it's already been accounted for
                // and we're at the end of this connected component
                if (!isEmpty(innerOutput)) {
                    // tslint:disable
                    console.log("else=>if curr", curr);
                    console.log("else=>if stack", refIdStack);
                    console.log("else=>if inner output", innerOutput);
                    // tslint:enable
                    output.push(innerOutput);
                    innerOutput = [];
                }
            }
        }

        return output;
    }

    /**
     * removeFeatureByReferenceId
     */
    public removePathByReferenceId(referenceId: string) {
        this.features = this.features.filter((feature: SharedStreetsMatchPath) => {
            return feature.properties.referenceId !== referenceId;
        });
    }
}