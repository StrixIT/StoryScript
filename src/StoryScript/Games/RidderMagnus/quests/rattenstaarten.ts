module RidderMagnus.Quests {
    export function RattenStaarten(): StoryScript.IQuest {
        return {
            name: "Verzamel rattenstaarten",
            status: {
                "Gestart": {
                    description: "Verzamel 10 rattenstaarten",
                    action: (game) => { }
                },
                "Onderweg": {
                    description: (game) => { return "Je hebt nu " + game.character.items.get("rattenstaarten") + " rattenstaarten verzameld."; },
                    action: (game) => { }
                },
                "Klaar": {
                    description: "Je hebt 10 rattenstaarten verzameld en aan de koningin gegeven.",
                    action: (game) => { }
                },
            }
        }
    }
}