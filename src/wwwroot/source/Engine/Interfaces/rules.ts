namespace StoryScript {
    export interface IRules {
        setupGame?(game: IGame): void;
        getCombinationActions?(): ICombinationAction[];
        getSheetAttributes(): string[];
        getCreateCharacterSheet(): ICreateCharacter;
        getLevelUpSheet?(): ICreateCharacter;
        createCharacter(game: IGame, characterData: ICreateCharacter): ICharacter;
        addEnemyToLocation?(game: IGame, location: ICompiledLocation, enemy: ICompiledEnemy): void;
        enterLocation?(game: IGame, location: ICompiledLocation, travel?: boolean): void;
        initCombat?(game: IGame, location: ICompiledLocation): void;
        fight(game: IGame, enemy: ICompiledEnemy, retaliate?: boolean): void;
        enemyDefeated?(game: IGame, enemy: ICompiledEnemy): void;
        hitpointsChange?(game: IGame, change: number): void;
        scoreChange(game: IGame, change: number): boolean;
        levelUp?(character: ICharacter, characterData: ICreateCharacter): boolean;
        determineFinalScore?(game: IGame): void;
        beforeEquip?(game: IGame, character: ICharacter, item: IItem): boolean;
        beforeUnequip?(game: IGame, character: ICharacter, item: IItem): boolean;
        processDescription?(game: IGame, parent: any, key: string);
        descriptionSelector?(game: IGame): string;
    }
}