module QuestForTheKing {
    export function CustomTexts(): StoryScript.IInterfaceTexts {
        return {
            gameName: 'Quests for the King',

            worldProperties: {
                currentDay: 'Day {0}',
                travelCounter: 'Travel counter: {0}',
                isDay: 'It is day',
                isNight: 'It is night',
                timeOfDay: 'It is {0}'
            }
        };
    }
}