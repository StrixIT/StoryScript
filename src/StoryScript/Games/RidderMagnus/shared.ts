module RidderMagnus {
    export function defeatRat(game: IGame) {
        var quest = game.character.quests.get(Quests.RattenStaarten);

        if (quest && !quest.complete) {
            quest.progress.rattenStaarten++;
        }
    }
}