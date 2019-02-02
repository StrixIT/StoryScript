namespace MyInteractiveStory {
    // Calling this function will bootstrap the game using our game namespace and rules and text objects.
    StoryScript.Run('MyInteractiveStory', {}, new CustomTexts().texts);
}