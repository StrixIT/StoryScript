export class LocationController implements ng.IComponentController {
    constructor(private _sce: ng.ISCEService, private _gameService: StoryScript.IGameService, private _game: StoryScript.IGame, private _texts: StoryScript.IInterfaceTexts) {
        this.game = _game;
        this.texts = _texts;
        this.worldProperties = [];

        this.initWorldProperties();
    }

    game: StoryScript.IGame;
    texts: StoryScript.IInterfaceTexts;
    worldProperties: { name: string, value: string }[];

    getDescription = (entity: any, key: string): string => !entity ? '' : this._sce.trustAsHtml(this._gameService.getDescription('locations', entity, key));

    getCombineClass = (feature: StoryScript.IFeature): string => this._game.combinations.getCombineClass(feature);

    tryCombine = (feature: StoryScript.IFeature): boolean => this._game.combinations.tryCombine(feature);

    private initWorldProperties = (): void => {
        for (var n in this._game.worldProperties) {
            if (this._game.worldProperties.hasOwnProperty(n) && this._texts.worldProperties && this._texts.worldProperties.hasOwnProperty(n)) {
                var value = this._texts.worldProperties[n];
                this.worldProperties.push({ name: n, value: value});
            }
        }
    }
}

LocationController.$inject = ['$sce', 'gameService', 'game', 'customTexts'];