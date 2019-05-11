namespace RidderMagnus.Quests {
    export function RattenStaarten() {
        return Quest({
            name: "Verzamel rattenstaarten",
            status: (game, quest, done) => {
                return done ? "Je hebt genoeg rattenstaarten verzameld!" : "Verzamel 10 rattenstaarten. Je hebt er nu " + quest.progress.rattenStaarten + ".";
            },
            start: (game, quest, person) => {

            },
            checkDone: (game, quest) => {
                return quest.progress.rattenStaarten >= 10;
            },
            complete: (game, quest, person) => {
            
            },
            progress: {
                rattenStaarten: 0
            }
        });
    }
}