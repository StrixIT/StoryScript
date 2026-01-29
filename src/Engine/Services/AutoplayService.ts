import {IGame} from "storyScript/Interfaces/game.ts";
import {IAutoplayService} from "storyScript/Interfaces/services/autoplayService.ts";
import {IAutoplayStep} from "storyScript/Interfaces/services/autoplayStep.ts";
import {IDemoMode} from "storyScript/Interfaces/rules/demoMode.ts";

export class AutoplayService implements IAutoplayService {
    
    private _demoTimer: NodeJS.Timeout;

    constructor(private _game: IGame) {
    }

    start = (steps: IAutoplayStep[], callback?: () => void): void => {
        this._game.autoplaying = true;
        this.runAutoplayStep(steps, 0, callback);
    }

    stop = (): void => {
        this._game.autoplaying = false;
        clearTimeout(this._demoTimer);
    }

    startDemoMode = (demoConfig: IDemoMode, restartCallback: () => void): void => {
        this._demoTimer = setTimeout(() => {
            this.start(demoConfig.steps, restartCallback);
        }, demoConfig.startDelay)
    }

    private runAutoplayStep = (steps: IAutoplayStep[], stepNumber: number, restartCallback: () => void): void => {
        if (stepNumber >= steps.length) {
            this._demoTimer = setTimeout(() => {
                clearTimeout(this._demoTimer);
                restartCallback();
            }, steps[stepNumber - 1].delay);

            return;
        }

        const currentStep = steps[stepNumber];

        this._demoTimer = setTimeout(() => {
            currentStep.action(this._game);
            stepNumber++;
            this.runAutoplayStep(steps, stepNumber, restartCallback);
        }, currentStep.delay);
    }
}