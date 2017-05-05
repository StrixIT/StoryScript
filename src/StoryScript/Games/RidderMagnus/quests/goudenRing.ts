module RidderMagnus.Quests {
    export function GoudenRing(): StoryScript.IQuest {
        return {
            name: "Zoek de gouden ring",
            status: {
                "Gestart": {
                    description: "Zoek de gouden ring",
                    action: (game) => { }
                },
                "Gevonden": {
                    description: "Je hebt de gouden ring gevonden!",
                    action: (game) => { }
                },
                "Klaar": {
                    description: "Je hebt de gouden ring teruggegeven aan de koningin.",
                    action: (game) => { }
                },
            }
        }
    }
}