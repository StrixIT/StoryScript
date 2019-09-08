namespace StoryScript {
    /**
     * All game texts that can be customized.
     */
    export interface IInterfaceTexts {
        equipmentHeader?: string;
        head?: string;
        amulet?: string;
        body?: string;
        hands?: string;
        rightHand?: string;
        leftHand?: string;
        rightRing?: string;
        leftRing?: string;
        legs?: string;
        feet?: string;
        backpack?: string;
        equip?: string;
        use?: string;
        drop?: string;
        enemies?: string;
        attack?: string;
        newGame?: string;
        yourName?: string;
        startAdventure?: string;
        nextQuestion?: string;
        actions?: string;
        destinations?: string;
        back?: string;
        onTheGround?: string;
        youLost?: string;
        questFailed?: string;
        finalScore?: string;
        tryAgain?: string;
        highScores?: string;
        youWon?: string;
        congratulations?: string;
        playAgain?: string;
        startOver?: string;
        resetWorld?: string;
        gameName?: string;
        saveGame?: string;
        save?: string;
        loadGame?: string;
        load?: string;
        loading?: string;
        youAreHere?: string;
        messages?: string;
        hitpoints?: string;
        currency?: string;
        trade?: string;
        talk?: string;
        encounters?: string;
        closeModal?: string;
        combatTitle?: string;
        value?: string;
        traderCurrency?: string;
        startCombat?: string;
        combatWin?: string;
        enemiesToFight?: string;
        useInCombat?: string;
        view?: string;
        quests?: string;
        currentQuests?: string;
        completedQuests?: string;
        combinations?: string;
        tryCombination?: string;
        noCombination?: string;
        noCombinationNoTool?: string;
        levelUp?: string;
        levelUpDescription?: string;
        completeLevelUp?: string;
        newSaveGame?: string;
        existingSaveGames?: string;
        overwriteSaveGame?: string;
        loadSaveGame?: string;
        characterSheet?: string;
        skipIntro?: string;

        // Todo: keep this, or solve showing world properties in another way?
        worldProperties?: {};

        /**
         * A function to build text replacing tokens in a template, e.g. 'it is {0}, {1}' with parameters 'day' and '12:00' becomes 'it is day, 12:00'.
         * If no function is specified, a default implementation is used.
         * @param template The text template to replace the tokens in
         * @param tokens The tokens to add to the template
         */
        format?(template: string, tokens: string[]): string;

        /**
         * A function to format a text using title case, e.g. 'world map' becomes 'World Map'.
         * If no function is specified, a default implementation is used.
         * @param text The text to format
         */
        titleCase?(text: string): string;
    }
}