module RidderMagnus.Quests {
    export function RattenStaarten(): StoryScript.IQuest {
        return {
            name: "Verzamel rattenstaarten",
            status: {
                "Gestart": {
                    description: (game) => {
                        var quest = game.character.quests.get(Quests.RattenStaarten);
                        return "Verzamel 10 rattenstaarten. Je hebt er nu " + (<any>quest).rattenStaarten + ".";
                    },
                    action: (game) => {
                        var quest = game.character.quests.get(Quests.RattenStaarten);
                        (<any>quest).rattenStaarten = 0;
                    }
                },
                "Klaar": {
                    description: "Je hebt 10 rattenstaarten verzameld en aan de koningin gegeven.",
                    action: (game) => { }
                },
            }
        }
    }
}