import {IGame} from "storyScript/Interfaces/game.ts";
import {IAutoplayService} from "storyScript/Interfaces/services/autoplayService.ts";
import {IAutoplayStep} from "storyScript/Interfaces/services/autoplayStep.ts";
import {IDemoMode} from "storyScript/Interfaces/rules/demoMode.ts";
import {GameState} from "storyScript/Interfaces/enumerations/gameState.ts";
import {IRules} from "storyScript/Interfaces/rules/rules.ts";

export class AutoplayService implements IAutoplayService {
    
    private _demoTimer: NodeJS.Timeout;

    constructor(private _game: IGame, private _rules: IRules) {
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
            this._game.autoplaying = true;
            const delay = this._rules.setup?.titleScreen?.transitionDelay ?? 0;
            const transitionDelay = typeof delay === 'number' ? delay : parseFloat(delay);
            
            const delayedCallback = () => {
                this._game.autoplaying = false;
                
                setTimeout(() => {
                    restartCallback();
                }, transitionDelay * 1000);
            }
            
            this._demoTimer = setTimeout(() => {
                this._game.state = GameState.Play;
                this.runAutoplayStep(demoConfig.steps, 0, delayedCallback);
            }, transitionDelay * 1000);
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