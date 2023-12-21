import { Dodge } from "./actions/dodge";
import { PowerAttack } from "./actions/powerAttack";
import { Chainmail } from "./items/Chainmail";
import { Dagger } from "./items/Dagger";
import { Fireball } from "./items/Fireball";
import { Frostbite } from "./items/Frostbite";
import { LeatherArmor } from "./items/LeatherArmor";
import { LongSword } from "./items/LongSword";
import { Magicshield } from "./items/Magicshield";
import { ShortBow } from "./items/ShortBow";
import { Staff } from "./items/Staff";
import { WizardCloak } from "./items/WizardCloak";
import { IAction, IItem } from "./types";

export class CharacterClass {
    /**
     *
     */
    constructor(name: string, hitpoints: number, inventory: (() => IItem)[], combatSpecial?: IAction) {
        this.name = name;
        this.picture = `resources/portraits/${name}-portrait.jpg`
        this.hitpoints = hitpoints;
        this.inventory = inventory;
        this.combatSpecial = combatSpecial;
        
    }

    public name: string;

    public picture: string;

    public hitpoints: number;

    public inventory: (() => IItem)[];

    public combatSpecial?: IAction;
}

export const CharacterClasses: Record<string, CharacterClass> = {
    Warrior: new CharacterClass('Warrior', 14, [LongSword, Dagger, Chainmail], PowerAttack()),
    Rogue: new CharacterClass('Rogue', 10, [Dagger, Dagger, ShortBow, LeatherArmor], Dodge()),
    Wizard: new CharacterClass('Wizard', 8, [Staff, WizardCloak, Fireball, Frostbite, Magicshield])
}