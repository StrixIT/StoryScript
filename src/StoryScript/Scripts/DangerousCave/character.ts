module DangerousCave {
    export class Character extends StoryScript.CharacterBase {
        kracht: number;
        vlugheid: number;
        oplettendheid: number;
        defense: number;

        constructor() {
            super();
            var self = this;
            self.kracht = 1;
            self.vlugheid = 1;
            self.oplettendheid = 1;
            self.hitpoints = 20;
            self.currentHitpoints = 20;
            self.level = 1;
            self.items = [
            ];
            self.equipment = {
                head: null,
                amulet: null,
                body: null,
                hands: null,
                leftHand: null,
                leftRing: null,
                rightHand: null,
                rightRing: null,
                legs: null,
                feet: null
            };
            self.defense = self.vlugheid;
        }
    }
}