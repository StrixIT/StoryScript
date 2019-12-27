/**
 * Used to determine the UI to show to the player, e.g. the intro or exploration screen.
 */
export enum GameState {
    Intro = 'Intro',
    CreateCharacter = 'CreateCharacter',
    Play = 'Play',
    LevelUp = 'LevelUp',
    GameOver = 'GameOver',
    Victory = 'Victory'
}