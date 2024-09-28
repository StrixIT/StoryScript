import { IInterfaceTexts } from './Interfaces/interfaceTexts';

export class DefaultTexts {
    texts: IInterfaceTexts = {
        equipmentHeader: 'Equipment',
        head: 'Head',
        amulet: 'Amulet',
        rightHand: 'Right hand',
        leftHand: 'Left hand',
        body: 'Body',
        legs: 'Legs',
        feet: 'Feet',
        backpack: 'Backpack',
        equip: 'Equip',
        use: 'Use',
        groupItem: 'Group',
        drop: 'Drop',
        enemies: 'Enemies',
        enemyHitpoints: 'Health: {0} / {1}',
        enemyCombatName: "{0} {1}",
        characterHitpoints: 'Health: {0} / {1}',
        fight: 'Fight!',
        noWeapon: 'No weapon!',
        attack: 'Attack ',
        attackWith: 'with ',
        aid: 'Aid',
        aidWith: 'with ',
        useCombatItem: 'Use item',
        newGame: 'New game',
        firstCharacter: 'Create your first character',
        secondCharacter: 'Create your second character',
        thirdCharacter: 'Create your third character',
        nthCharacter: 'Create your {0}th character',
        nextCharacter: 'Next character',
        nextQuestion: 'Next question',
        startAdventure: 'Start adventure',
        actions: 'Actions',
        destinations: 'Destinations',
        back: 'Back: ',
        onTheGround: 'On the ground',
        youLost: 'You lost...',
        questFailed: 'You have failed your quest!',
        finalScore: 'Your score: ',
        tryAgain: 'Try again',
        highScores: 'High Scores',
        youWon: 'You won!',
        congratulations: 'Congratulations! You have won the game!',
        playAgain: 'Play again',
        startOver: 'Start over',
        resetWorld: 'Reset world',
        gameName: 'Game template',
        save: 'Save',
        saveGame: 'Save game',
        load: 'Load',
        loadGame: 'Load game',
        loading: 'Loading...',
        youAreHere: 'You are at {0}',
        messages: 'Messages',
        hitpoints: 'Health',
        currency: 'Money',
        trade: 'Trade with {0}',
        talk: 'Talk to {0}',
        examine: 'Examine {0}',
        encounters: 'Encounters',
        closeModal: 'Close',
        combatTitle: 'Combat',
        combatRound: 'Combat round {0}',
        value: 'value',
        traderCurrency: 'Trader money: {0} {1}',
        startCombat: 'Start combat',
        combatWin: 'You are victorious!',
        enemiesToFight: 'You face these foes: ',
        useInCombat: 'Use {0}',
        noCombatAction: 'No Combat Actions',
        view: 'View',
        quests: 'Quests',
        currentQuests: 'Current',
        completedQuests: 'Completed',
        hands: 'Hands',
        leftRing: 'Left ring',
        rightRing: 'Right ring',
        yourName: 'Name',
        combinations: 'Combinations',
        tryCombination: 'Try',
        noCombination: 'You {2} the {0} {3} the {1}. Nothing happens.',
        noCombinationNoTool: 'You {1} {2} the {0}. Nothing happens.',
        levelUp: 'Level up',
        completeLevelUp: 'Accept',
        levelUpDescription: 'You reached level {0}.',
        newSaveGame: 'New save game',
        existingSaveGames: 'Saved games',
        overwriteSaveGame: 'Overwrite saved game {0}?',
        loadSaveGame: 'Load saved game {0}?',
        characterSheet: 'Character sheet',
        skipIntro: 'Skip intro',
        mainMenu: 'Main menu',
        mainMenuShort: 'Menu',
        confirmRestart: 'Really restart?',
        restartCancelled: 'No',
        restartConfirmed: 'Yes',
        cancel: 'Cancel'
    }

    format = format;

    titleCase = (text: string): string => text.substring(0, 1).toUpperCase() + text.substring(1);
}

export function format (template: string, tokens: string | string[]): string {
    if (template && tokens) {
        if (!Array.isArray(tokens)) {
            tokens = [tokens];
        }

        tokens.forEach((t, i) => {
            if (t === undefined) {
                (<string[]>tokens)[i] = "{undefined}";
            }
        })

        for (let i = 0; i < tokens.length; i++) {
            const pattern = '[ ]{0,1}\\{' + i + '\\}[ ]{0,1}';
            const match = new RegExp(pattern).exec(template);

            if (match) {
                const matchReplacement = match[0].replace('{' + i + '}', '');

                if (tokens[i].trim && tokens[i].trim().length == 0 && matchReplacement.length > 1) {
                    template = template.replace(match[0], ' ');
                }
                else {
                    template = template.replace('{' + i + '}', tokens[i]);
                }
            }
        }
    }

    return template;
}