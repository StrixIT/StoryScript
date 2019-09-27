namespace StoryScript {
    /**
     * Used to determine the UI to show to the player, e.g. the exploration or trade screens.
     */
    export enum GameState {
        Intro = 'Intro',
        CreateCharacter = 'CreateCharacter',
        Play = 'Play',
        LevelUp = 'LevelUp',
        GameOver = 'GameOver',
        Victory = 'Victory'
    }

    export enum PlayState {
        Menu = 'Menu',
        Combat = 'Combat',
        Trade = 'Trade',
        Conversation = 'Conversation',
        Description = 'Description'
    }
}