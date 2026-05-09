import {Ref} from "vue";
import {IFeature} from "storyScript/Interfaces/feature.ts";
import {compareString} from "storyScript/utilityFunctions.ts";

function prepareLoadedImages(locationImages: HTMLImageElement[], loadedImages: any[]) {
    locationImages.forEach(l => {
        let promiseResolve: () => {};

        const loadPromise = new Promise((r: any) => {
            promiseResolve = r;
        });

        l.onload = promiseResolve;
        
        if (l.naturalWidth > 0) {
            promiseResolve();
        }

        loadedImages.push({
            element: l,
            loadPromise: loadPromise
        });
    });
}

export function useVisualFeatures(imageRef: Ref<HTMLDivElement>){
    const locationFeatures = imageRef;
    const loadedImages = [];
    
    const prepareFeatures = () => {
        loadedImages.length = 0;
        const locationImages = Array.from(locationFeatures.value.querySelectorAll('img'));
        prepareLoadedImages(locationImages, loadedImages);

        const allPromises = loadedImages.map(i => i.loadPromise);
        
        Promise.all(allPromises).then(() => {
            const mainImage = loadedImages[0].element;
            const factor = mainImage.width / mainImage.naturalWidth;
            
            loadedImages.slice(1).map(l => l.element).forEach(i => {
                i.width = i.naturalWidth * factor;
                i.height = i.naturalHeight * factor;
            }); 
        });
    }
    
    const getFeatureCoordinates = (feature: IFeature): { top: string, left: string } => {
        const coords = feature.coords.split(',');
        let top: string, left: string;

        if (compareString(feature.shape, 'poly')) {
            const x = [], y = [];

            for (let i = 0; i < coords.length; i++) {
                const value = coords[i];
                if (i % 2 === 0) {
                    x.push(value);
                } else {
                    y.push(value);
                }
            }

            left = x.reduce(function (p, v) {
                return (p < v ? p : v);
            });

            top = y.reduce(function (p, v) {
                return (p < v ? p : v);
            });
        } else {
            left = coords[0];
            top = coords[1];
        }

        return {
            top: `${top}px`,
            left: `${left}px`
        };
    }
    
    return {
        locationFeatures,
        prepareFeatures,
        getFeatureCoordinates
    }
}