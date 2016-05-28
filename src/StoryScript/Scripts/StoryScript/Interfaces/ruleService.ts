module StoryScript {
    export interface IRuleService {
        setupGame(game: StoryScript.IGame): void;
        getCharacterForm(): any;
        createCharacter(characterData: any): ICharacter;
        startGame(): void;
        addEnemyToLocation(location: ICompiledLocation, enemy: IEnemy): void;
        enterLocation(location: ICompiledLocation): void;
        initCombat(location: ICompiledLocation): void;
        fight(enemy: IEnemy): void;
        hitpointsChange(change: number): void;
        scoreChange(change: number): boolean;
    }
}