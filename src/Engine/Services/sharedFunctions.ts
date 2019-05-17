namespace StoryScript {
    export function SaveWorldState(dataService: IDataService, locationService: ILocationService, game: IGame) {
        dataService.save(StoryScript.DataKeys.CHARACTER, game.character);
        dataService.save(StoryScript.DataKeys.STATISTICS, game.statistics);
        dataService.save(StoryScript.DataKeys.WORLDPROPERTIES, game.worldProperties);
        locationService.saveWorld(game.locations);
    }
}