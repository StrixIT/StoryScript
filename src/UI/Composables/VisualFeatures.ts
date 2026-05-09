import {Ref, ref} from "vue";
import {IFeature} from "storyScript/Interfaces/feature.ts";
import {compareString} from "storyScript/utilityFunctions.ts";

const prepareLoadedImages = (locationImages: HTMLImageElement[], loadedImages: any[])=> {
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
    const factor = ref(1);
    
    const prepareFeatures = () => {
        loadedImages.length = 0;
        const locationImages = Array.from(locationFeatures.value.querySelectorAll('img'));
        prepareLoadedImages(locationImages, loadedImages);

        const allPromises = loadedImages.map(i => i.loadPromise);
        
        Promise.all(allPromises).then(() => {
            const mainImage = loadedImages[0].element;
            factor.value = mainImage.width / mainImage.naturalWidth;
            
            loadedImages.slice(1).map(l => l.element).forEach(i => {
                i.width = i.naturalWidth * factor.value;
                i.height = i.naturalHeight * factor.value;
            }); 
        });
    }
    
    const getFeatureCoordinates = (feature: IFeature): { top: string, left: string } => {
        const coords = feature.coords.split(',');
        let top: number, left: number;

        if (compareString(feature.shape, 'poly')) {
            const x: number[] = [], y: number[] = [];

            for (let i = 0; i < coords.length; i++) {
                const value = coords[i];
                if (i % 2 === 0) {
                    x.push(parseInt(value));
                } else {
                    y.push(parseInt(value));
                }
            }

            left = x.reduce(function (p, v) {
                return (p < v ? p : v);
            });

            top = y.reduce(function (p, v) {
                return (p < v ? p : v);
            });
        } else {
            left = parseInt(coords[0]) * factor.value;
            top = parseInt(coords[1]) * factor.value;
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