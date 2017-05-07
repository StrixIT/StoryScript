module RidderMagnus.Quests {
    export function RattenStaarten(): StoryScript.IQuest {
        return {
            name: "Verzamel rattenstaarten",
            status: (game, quest, done) => {
                return done ? "Je hebt genoeg rattenstaarten verzameld!" : "Verzamel 10 rattenstaarten. Je hebt er nu " + quest.progress.rattenStaarten + ".";
            },
            start: (game, quest) => {

            },
            checkDone: (game, quest) => {
                return quest.progress.rattenStaarten >= 10;
            },
            complete: (game, quest) => {
            
            },
            progress: {
                rattenStaarten: 0
            }
        }
    }
}