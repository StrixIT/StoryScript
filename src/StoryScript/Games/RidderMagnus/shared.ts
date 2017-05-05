module RidderMagnus {
    export function defeatRat(game: IGame) {
        var quest = game.character.quests.get(Quests.RattenStaarten);

        if (quest && !quest.complete) {
            (<any>quest).rattenStaarten++;

            if ((<any>quest).rattenStaarten >= 10) {
                quest.goalAchieved = true;
            }
        }
    }
}