import { Item } from '../types';
import { EquipmentType, ICombinationMatchResult } from 'storyScript/Interfaces/storyScript';
import description from './book_moser.html?raw';
import { Combinations } from '../combinations';

// Function to extract inner HTML of <description>
function extractDescriptionHtml(htmlString: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');
  const descriptionElement = doc.querySelector('description');
  return descriptionElement?.innerHTML?.trim() || '';
}

const descriptionHtml = extractDescriptionHtml(description);

export function BookMoser() {
    return Item({
        name: 'book_moser',
        description: descriptionHtml,
        picture: 'resources7book_letter_quill.png',
        equipmentType: EquipmentType.Miscellaneous,
        combinations: {
            combine: [
                // USE = read the book
                {
                    combinationType: Combinations.USE,
                    match: (game, target, tool): ICombinationMatchResult => {
                        // Add the book to the notebook
                        game.activeCharacter.items.add(BookMoser);

                        // Set the HTML description for rendering
                        return {
                            text: `read ${BookMoser.name}`,
                            removeTarget: false,
                            htmlContent: descriptionHtml, // Pass HTML content for rendering
                        };
                    }
                },
                // LOOKAT is not valid for this item
                {
                    combinationType: Combinations.LOOKAT,
                    match: (game, target, tool): ICombinationMatchResult => {
                        return {
                            text: `You cannot look at ${BookMoser.name}. Try reading it instead.`,
                            removeTarget: false,
                        };
                    }
                },
            ]
        }
    });
}