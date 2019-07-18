namespace MyAdventureGameVisual {
    export class Character implements StoryScript.ICharacter {
        name: string = "";
        score: number = 0;
        hitpoints: number = 10;
        currentHitpoints: number = 10;
        currency: number = 0;

        // Add character properties here.

        items: StoryScript.ICollection<IItem> = [];

        equipment: {
        };

        constructor() {
            this.equipment = {
            }
        }
    }
}