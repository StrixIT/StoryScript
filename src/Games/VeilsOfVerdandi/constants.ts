export class Constants {
    static PrimaryWeapon: string = 'primaryWeapon';
    static SecondaryWeapon: string = 'secondaryWeapon';
    static Bow: string = 'bow';
    
    static CombatEffects: Record<string, string> = {
        'Frozen': 'Frozen targets have their speed increased by +3 for the next attack.',
        'Frightened': 'Frightened targets have their defense lowered by -1.',
        'Confused': 'Confused targets have the damage of their next attack reduced by 50%.',
        'Force Field': 'The force field surrounding you increases your defense against physical attacks by +1.',
        'Magic Shield': 'The magic shield protecting you increases your defense against spells by +2.'
    };
}