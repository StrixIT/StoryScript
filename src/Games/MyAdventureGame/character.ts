namespace MyAdventureGame {
    export class Character implements StoryScript.ICharacter {
        name: string = "";
        score: number = 0;
        hitpoints: number = 10;
        currentHitpoints: number = 10;
        currency: number = 0;

        // Add character properties here.

        items: StoryScript.ICompiledCollection<IItem, ICompiledItem> = [];

        equipment: {
        };

        constructor() {
            this.equipment = {
            }
        }
    }
}