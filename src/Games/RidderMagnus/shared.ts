namespace RidderMagnus {
    export function defeatRat(game: IGame) {
        var quest = game.character.quests.get(Quests.RattenStaarten);

        if (quest && !quest.completed) {
            quest.progress.rattenStaarten++;
        }
    }

    export function addFleeAction(game: IGame) {
        if (game.currentLocation && game.currentLocation.activeEnemies.length > 0 && !game.currentLocation.combatActions.some((action) => { return action.text == 'Vluchten!'; })) {
            game.currentLocation.combatActions.push(Actions.Flee('Vluchten!'));
        }
    }
}