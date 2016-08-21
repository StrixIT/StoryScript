module StoryScript {
    export interface IRuleService {
        setupGame?(game: IGame): void;
        getCreateCharacterSheet(): ICreateCharacter
        createCharacter(characterData: ICreateCharacter): ICharacter;
        addEnemyToLocation?(location: ICompiledLocation, enemy: IEnemy): void;
        enterLocation?(location: ICompiledLocation): void;
        initCombat?(location: ICompiledLocation): void;
        fight(enemy: IEnemy, retaliate?: boolean): void;
        enemyDefeated?(enemy: IEnemy): void;
        hitpointsChange(change: number): boolean;
        scoreChange(change: number): boolean;
        determineFinalScore?(): void;
    }
}