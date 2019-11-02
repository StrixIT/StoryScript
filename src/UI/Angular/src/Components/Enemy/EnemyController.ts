namespace StoryScript {
   
    export class EnemyController implements ng.IComponentController {
        constructor(private _gameService: IGameService, private _sharedMethodService: ISharedMethodService, private _game: IGame, _texts: IInterfaceTexts) {
            this.game = _game;
            this.texts = _texts;
        }

        game: IGame;
        texts: IInterfaceTexts;

        getCombineClass = (item: IItem): string => this._game.combinations.getCombineClass(item);

        tryCombine = (enemy: IEnemy): boolean => this._game.combinations.tryCombine(enemy);

        hasDescription = (type: string, item: { id?: string, description?: string }): boolean => this._gameService.hasDescription(type, item);

        showDescription = (item: any, title: string): void => this._sharedMethodService.showDescription('enemies', item, title);  

        startCombat = (): void => this._sharedMethodService.startCombat();
    }

    EnemyController.$inject = ['gameService', 'sharedMethodService', 'game', 'customTexts'];
}