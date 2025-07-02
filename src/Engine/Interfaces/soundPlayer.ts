export interface ISoundPlayer {
    /**
     * Start playing the currently selected music.
     */
    startMusic(): void;

    /**
     * Stop playing the current music.
     */
    stopMusic(): void;

    /**
     * Play a sound and optionally call a function when it completes. 
     * @param fileName The sound to play.
     * @param completeCallBack The function to call once the sound has played.
     */
    playSound(fileName: string, completeCallBack?: () => void): void;

    /**
     * Gets the game's sound queue, containing all the sounds that are being played or are yet
     * to be played.
     */
    soundQueue: Map<number, { value: string, playing: boolean, completeCallBack?: () => void }>;

    /**
     * Contains a list of files that have been played before. This is used to play files embedded
     * in audio elements that are set to autoplay only once.
     */
    playedAudio: string[];
}