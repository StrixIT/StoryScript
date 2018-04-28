namespace StoryScript {   
    export class LocationController implements ng.IComponentController {
        constructor(private _game: IGame, private _rules: IRules, private _texts: IInterfaceTexts) {
            var self = this;
            self.game = _game;
            self.rules = _rules;
            self.texts = _texts;
        }

        game: IGame;
        rules: IRules;
        texts: IInterfaceTexts;

        getDescription(entity: any, key: string) {
            var self = this;
            return entity && entity[key] ? self._rules.processDescription ? self._rules.processDescription(self._game, entity, key) : entity[key] : null;
        }
    }

    LocationController.$inject = ['game', 'rules', 'customTexts'];
}