import { ClassType } from "./classType";
import { Chainmail } from "./items/Chainmail";
import { Dagger } from "./items/Dagger";
import { Fireball } from "./items/Fireball";
import { Frostbite } from "./items/Frostbite";
import { LeatherArmor } from "./items/Leatherarmour";
import { LongSword } from "./items/LongSword";
import { Magicshield } from "./items/Magicshield";
import { ShortBow } from "./items/ShortBow";
import { WizardStaff } from "./items/WizardStaff";
import { WizardCloak } from "./items/Wizardcloak";
import { IAction, IItem } from "./types";
import {PowerAttack1} from "./items/PowerAttack1.ts";
import {Dodge1} from "./items/Dodge1.ts";

export class CharacterClass {
    /**
     *
     */
    constructor(name: ClassType, hitpoints: number, inventory: (() => IItem)[], combatSpecial?: IAction) {
        this.name = name;
        this.picture = `resources/portraits/${name}-portrait.jpg`
        this.hitpoints = hitpoints;
        this.inventory = inventory;
        this.combatSpecial = combatSpecial;
        
    }

    public name: ClassType;

    public picture: string;

    public hitpoints: number;

    public inventory: (() => IItem)[];

    public combatSpecial?: IAction;
}

export const CharacterClasses: Record<string, CharacterClass> = {
    [ClassType.Warrior]: new CharacterClass(ClassType.Warrior, 14, [LongSword, Dagger, Chainmail, PowerAttack1]),
    [ClassType.Rogue]: new CharacterClass(ClassType.Rogue, 10, [Dagger, Dagger, ShortBow, LeatherArmor, Dodge1]),
    [ClassType.Wizard]: new CharacterClass(ClassType.Wizard, 8, [WizardStaff, WizardCloak, Fireball, Frostbite, Magicshield])
}