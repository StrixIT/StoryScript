namespace StoryScript {
    export class EncounterController implements ng.IComponentController {
        constructor(private _sharedMethodService: ISharedMethodService, private _game: IGame, private _texts: IInterfaceTexts) {
            var self = this;
            self.game = _game;
            self.texts = _texts;
        }

        game: IGame;
        texts: IInterfaceTexts;

        enemiesPresent = () => {
            var self = this;
            return self._sharedMethodService.enemiesPresent();
        }

        personsPresent = (): boolean => {
            var self = this;
            return self._game.currentLocation && self._game.currentLocation.activePersons.length > 0;
        }

        talk = (person: ICompiledPerson) => {
            var self = this;
            self._game.currentLocation.activePerson = person;
            self._game.state = GameState.Conversation;
        }

        trade = (game: IGame, actionIndex: number, trade: ICompiledPerson | ITrade) => {
            var self = this;
            return self._sharedMethodService.trade(self._game, actionIndex, trade);
        }

        startCombat = (person: ICompiledPerson) => {
            var self = this;

            // The person becomes an enemy when attacked!
            self._game.currentLocation.persons.remove(person);
            self._game.currentLocation.enemies.push(person);
            self._sharedMethodService.startCombat();
        }
    }

    EncounterController.$inject = ['sharedMethodService', 'game', 'customTexts'];
}