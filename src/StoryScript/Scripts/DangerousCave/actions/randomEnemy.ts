module StoryScript.Actions {
    export function RandomEnemy(game: Game) {
        var enemies = window['StoryScript']['Enemies'];
        var enemyCount = 0;

        for (var n in enemies) {
            enemyCount++;
        }

        var randomEnemy = enemies[game.rollDice('1d' + enemyCount) - 1]();
        game.currentLocation.enemies.push(randomEnemy);

        return randomEnemy;
    }
}