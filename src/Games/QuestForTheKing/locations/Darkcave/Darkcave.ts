module QuestForTheKing.Locations {
    export function Darkcave() {
        return BuildLocation({
            name: 'The Dark Cave',           
            enemies: [
                Enemies.Enchantress

            ]
        });
    }
}    