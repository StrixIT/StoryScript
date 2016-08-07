module StoryScript {
    export interface IRuleService {
        setupGame(game: StoryScript.IGame): void;
        getCreateCharacterSheet(): ICreateCharacter
        createCharacter(characterData: any): ICharacter;
        startGame(): void;
        addEnemyToLocation(location: ICompiledLocation, enemy: IEnemy): void;
        enterLocation(location: ICompiledLocation): void;
        initCombat(location: ICompiledLocation): void;
        fight(enemy: IEnemy): void;
        healthChange(change: number): boolean;
        scoreChange(change: number): boolean;
    }
}