module StoryScript {
    export class DefaultTexts {
        equipmentHeader = "Equipment";
        head = "Head";
        amulet = "Amulet";
        rightHand = "Right hand";
        leftHand = "Left hand";
        body = "Body";
        legs = "Legs";
        feet = "Feet";
        backpack = "Backpack";
        equip = "Equip";
        use = "Use";
        drop = "Drop";
        enemies = "Enemies";
        attack = "Attack {0}!";
        newGame = "New game";
        nextQuestion = "Next question"
        startAdventure = "Start adventure";
        actions = "Actions";
        destinations = "Destinations";
        back = "Back: ";
        onTheGround = "On the ground";
        youLost = "You lost...";
        questFailed = "You have failed your quest!";
        finalScore = "Your score: ";
        tryAgain = "Try again";
        highScores = "High Scores";
        youWon = "You won!";
        congratulations = "Congratulations! You have won the game!";
        playAgain = "Play again";
        startOver = "Start over";
        resetWorld = "Reset world";
        gameName = "Game template";
        loading = "Loading...";
        youAreHere = "You are here";
        messages = "Messages";
        hitpoints = "Health";

        format = (template: string, tokens: string[]): string => {
            if (tokens) {
                for (var i = 0; i < tokens.length; i++) {
                    template = template.replace('{' + i + '}', tokens[i]);
                }
            }

            return template;
        }

        titleCase = (text: string): string => {
            return text.substring(0, 1).toUpperCase() + text.substring(1);
        }
    }
}