﻿module GameTemplate {
    export class RuleService implements ng.IServiceProvider, StoryScript.IRuleService {
        private game: IGame;

        constructor(game: IGame) {
            var self = this;
            self.game = game;
        }

        public $get(game: IGame): StoryScript.IRuleService {
            var self = this;
            self.game = game;

            return {
                getCreateCharacterSheet: self.getCreateCharacterSheet,
                createCharacter: self.createCharacter,
                fight: self.fight,
                hitpointsChange: self.hitpointsChange,
                scoreChange: self.scoreChange
            };
        }

        getCreateCharacterSheet = (): StoryScript.ICreateCharacter => {
            return {
                steps: [
                    // Add the character creation steps here.
                ]
            };
        }

        public createCharacter(characterData: StoryScript.ICreateCharacter): StoryScript.ICharacter {
            var self = this;
            var character = new Character();
            return character;
        }

        fight = (enemy: StoryScript.IEnemy) => {
            var self = this;

            // Implement character attack here.


            self.game.currentLocation.enemies.filter((enemy: IEnemy) => { return enemy.hitpoints > 0; }).forEach(function (enemy) {
                // Implement monster attack here
            });
        }

        hitpointsChange(change: number) {
            var self = this;

            // Implement additional logic to occur when hitpoints are lost. Return true when the character has been defeated.
            return false;
        }

        scoreChange(change: number): boolean {
            var self = this;

            // Implement logic to occur when the score changes. Return true when the character gains a level.
            return false;
        }
    }

    RuleService.$inject = ['game'];

    var storyScriptModule = angular.module("storyscript");
    storyScriptModule.service("ruleService", RuleService);
}