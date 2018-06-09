﻿namespace StoryScript {
    /**
     * Used to determine the UI to show to the player, e.g. the exploration or trade screens.
     */
    export enum GameState {
        CreateCharacter,
        Play,
        Combat,
        Trade,
        Conversation,
        Description,
        LevelUp,
        GameOver,
        Victory
    }
}