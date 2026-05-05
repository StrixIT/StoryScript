# Sample workflow for building and testing stories or games in StoryScript

> [!NOTE]  
> This sample workflow briefly outlines key steps that you will repeatedly have to perform when building and
> testing your interactive stories or games in StoryScript. If you have never worked with StoryScript before, you
> should consult the [full tutorial](https://storyscript.nl/tutorials) first. 

## Syncing content upstream / downstream before making new changes

Before starting work, ensure your local clone (or Github Codespace) matches your remote repository state.
You can check the current branch using:

```bash
git branch -vv
```

Verify whether you are on:

- `master` (shared integration branch)
- a feature branch / subbranch

To pull changes from your remote repository to your local IDE or the Github Codespace, run:

```bash
git pull
```
If changes are blocked and errors occur, make sure to resolve them first before editing your story or game further.
A safe temporary solution is to [stash changes](https://docs.github.com/en/desktop/making-changes-in-a-branch/stashing-changes-in-github-desktop).
You can do this via the GitHub interface, or via the command line:

```bash
git stash push -m "stash local changes"
git pull
git stash pop
```

An alternative is to force the remote state, which will discard all local changes. You should only perform this action
if you are certain that the remote state is complete and reliable:

```bash
git merge --abort
git fetch origin
git reset --hard origin/master
git clean -fd
```

## How to sync only selected commits

If you do not want all changes from another branch, selectively import commits using the so-called
[cherry-picking](https://docs.github.com/en/desktop/managing-commits/cherry-picking-a-commit-in-github-desktop).
This can be useful if you only want to import finished features, get certain bugfixes only, or wish to avoid unstable experimental commits.

To cherry-pick one single commit, use:

```bash
git cherry-pick <commit-hash>
```
You can also abort cherry-picking when conflicts occur:

```bash
git cherry-pick --abort
```

## Editing game files and committing your changes

To edit your game, remember that StoryScript stores game-specific information within the *Games* directory
and uses lowercase names for all sub-directories relating to each game. By contrast, global settings for all games
are in folders with capitalised names:

```text
src/
  Engine/
  Games/
    MyAdventureGame/
    MyInteractiveMap/
    MyRolePlayingGame/
  Tests/
  UI/
```
This is why you have to pay attention not to edit the global settings by accident. Always verify that you are
in the right directory specific to your current game before making changes!
Assuming that your current game is called *MyInteractiveMap*, you should only work within the following directories:

```text
src/Games/MyInteractiveMap/ui/
src/Games/MyInteractiveMap/maps/
src/Games/MyInteractiveMap/locations/
src/Games/MyInteractiveMap/resources/
```
To commit your edits, it is recommended to include a clear commit message that tells you and other users what changes
you have made (and why). This helps you fix errors laters. If you work in the GitHub Codespace, the GitHub Copilot will help
you write commit messages. Using the command line, commiting changes with additional information looks like this:

```bash
git add <file>
git commit -m "Add Austria marker positions"
```
To inspect modified files, you can use:

```bash
git status
git diff
```
## Testing a game with NPM

Once you have made several changes, you will most likely want to test them in the interface that users will see.
To do this, you have to run a development server using `npm start` in the terminal.
This command uses StoryScript’s built-in startup instructions to display a game project in the browser before it is officially published online.
In StoryScript, the preview target is controlled through a selector file:

```text
src/UI/currentGameName.js
```
This file determines which game namespace is loaded by the main UI bootstrap. You have to make sure that this file
contains your current game name to be able to test it. 
To run the actual test, use:

```bash
npm start
```

The browser should then launch automatically. If you see the wrong game, go back and verify
the namespace. If you see now game at all, verify that npm was installed correctly and that your local
fork contains all the necessary components from the original StoryScript repository.

## Adjusting the appearance of text and visual elements

In StoryScript, you can define different textual and visual elements using specific HTML classes.
If you want to distinguish map location images from other types of images, for instance, you can wrap
the image in a bespoke `<div>` tag:

```html
<div class="map-location-image reachable">
  <img src="resources/Franconia.png">
</div>
```

Then you can style these elements via your game css. To constrain our location markers to max 60×60 px, for example,
we can use the following CSS code:

```css
.map-location-image {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

## Clean reset to remote master

In cases where your local changes did not work out as planned, you can reset to the remote master and
ignore all local edits:

```bash
git fetch origin
git reset --hard origin/master
git clean -fd
```
This is an emergency measure and should be applied with care!
