namespace MyAdventureGame.Features {
    export function WoundedWarrior() {
        return Feature({
            name: 'Wounded warrior',
            combinations: {
                failText: 'That won\'t help him.',
                combine: [
                    {
                        combinationType: Constants.LOOKAT,
                        match: (game, target, tool): string => {
                            if (!game.character.items.get(Items.Flask)) {
                                game.character.items.push(Items.Flask);
                                return `Looking at the warrior, you see a flask on his belt.
                                        carefully, you remove it.`;
                            }
                            else {
                                return 'You see nothing else that might help.';
                            }
                        }
                    }
                ]
            }
        });
    }
}