namespace StoryScript {
    export class DefaultTexts {
        texts: StoryScript.IInterfaceTexts = {
            equipmentHeader: "Equipment",
            head: "Head",
            amulet: "Amulet",
            rightHand: "Right hand",
            leftHand: "Left hand",
            body: "Body",
            legs: "Legs",
            feet: "Feet",
            backpack: "Backpack",
            equip: "Equip",
            use: "Use",
            drop: "Drop",
            enemies: "Enemies",
            attack: "Attack {0}!",
            newGame: "New game",
            nextQuestion: "Next question",
            startAdventure: "Start adventure",
            actions: "Actions",
            destinations: "Destinations",
            back: "Back: ",
            onTheGround: "On the ground",
            youLost: "You lost...",
            questFailed: "You have failed your quest!",
            finalScore: "Your score: ",
            tryAgain: "Try again",
            highScores: "High Scores",
            youWon: "You won!",
            congratulations: "Congratulations! You have won the game!",
            playAgain: "Play again",
            startOver: "Start over",
            resetWorld: "Reset world",
            gameName: "Game template",
            save: "Save",
            saveGame: "Save game",
            load: "Load",
            loadGame: "Load game",
            loading: "Loading...",
            youAreHere: "You are at {0}",
            messages: "Messages",
            hitpoints: "Health",
            currency: "Money",
            trade: "Trade with {0}",
            talk: "Talk to {0}",
            encounters: "Encounters",
            closeModal: "Close",
            combatTitle: "Combat",
            value: "value",
            traderCurrency: "Trader money: {0} {1}",
            startCombat: "Start combat",
            combatWin: "You are victorious!",
            enemiesToFight: "You face these foes: ",
            useInCombat: "Use {0}",
            view: "View",
            quests: "Quests",
            currentQuests: "Current",
            completedQuests: "Completed",
            hands: "Hands",
            leftRing: "Left ring",
            rightRing: "Right ring",
            yourName: "Name",
            combinations: "Combinations",
            tryCombination: "Try",
            noCombination: "You {2} the {0} {3} the {1}. Nothing happens.",
            noCombinationNoTool: "You {1} {2} the {0}. Nothing happens.",
            levelUp: "Level up",
            completeLevelUp: "Accept",
            levelUpDescription: "You reached level {0}.",
            newSaveGame: "New save game",
            existingSaveGames: "Saved games",
            overwriteSaveGame: "Overwrite saved game {0}?",
            loadSaveGame: "Load saved game {0}?",
            characterSheet: "Character sheet"
        }

        format = (template: string, tokens: string[]): string => {
            if (template && tokens) {
                for (var i = 0; i < tokens.length; i++) {
                    var pattern = '[ ]{0,1}\\{' + i + '\\}[ ]{0,1}';
                    var match = new RegExp(pattern).exec(template)[0];
                    var matchReplacement = match.replace('{' + i + '}', '');

                    if (tokens[i].trim().length == 0 && matchReplacement.length > 1) {
                        template = template.replace(match, ' ');
                    }
                    else {
                        template = template.replace('{' + i + '}', tokens[i]);
                    }
                }
            }

            return template;
        }

        titleCase = (text: string): string => {
            return text.substring(0, 1).toUpperCase() + text.substring(1);
        }
    }
}