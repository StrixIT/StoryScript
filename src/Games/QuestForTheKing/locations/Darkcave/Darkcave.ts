module QuestForTheKing.Locations {
    export function Darkcave() {
        return Location({
            name: 'The Dark Cave',           
            enemies: [
                Enemies.Enchantress()
            ]
        });
    }
}    