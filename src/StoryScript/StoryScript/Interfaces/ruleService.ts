module StoryScript {
    export interface IRuleService {
        getSheetAttributes(): string[];
        setupGame?(game: IGame): void;
        getCreateCharacterSheet(): ICreateCharacter
        createCharacter(characterData: ICreateCharacter): ICharacter;
        addEnemyToLocation?(location: ICompiledLocation, enemy: IEnemy): void;
        enterLocation?(location: ICompiledLocation, travel?: boolean): void;
        initCombat?(location: ICompiledLocation): void;
        fight(enemy: IEnemy, retaliate?: boolean): void;
        enemyDefeated?(enemy: IEnemy): void;
        hitpointsChange?(change: number): void;
        scoreChange(change: number): boolean;
        determineFinalScore?(): void;
        beforeEquip?(character: ICharacter, item: IItem): boolean;
        beforeUnequip?(character: ICharacter, item: IItem): boolean;
        processDescription?(parent: any, key: string);
        descriptionSelector?(game: IGame): string;
    }
}