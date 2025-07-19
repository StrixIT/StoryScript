import {ActionLogComponent} from "ui/Components/ActionLog/actionlog.component.ts";
import {BackpackComponent} from "ui/Components/Backpack/backpack.component.ts";
import {BuildCharacterComponent} from "ui/Components/BuildCharacter/buildcharacter.component.ts";
import {CharacterSheetComponent} from "ui/Components/CharacterSheet/charactersheet.component.ts";
import {CombatComponent} from "ui/Components/Combat/combat.component.ts";
import {CombatParticipantComponent} from "ui/Components/CombatParticipant/combatparticipant.component.ts";
import {CombinationComponent} from "ui/Components/Combination/combination.component.ts";
import {ConversationComponent} from "ui/Components/Conversation/conversation.component.ts";
import {SafePipe} from "ui/Pipes/sanitizationPipe.ts";
import {CreateCharacterComponent} from "ui/Components/CreateCharacter/createcharacter.component.ts";
import {EncounterComponent} from "ui/Components/Encounter/encounter.component.ts";
import {EncounterModalComponent} from "ui/Components/EncounterModal/encountermodal.component.ts";

export const STORYSCRIPT_COMPONENTS = [
    SafePipe,
    ActionLogComponent,
    BackpackComponent,
    BuildCharacterComponent,
    CharacterSheetComponent,
    CombatComponent,
    CombatParticipantComponent,
    CombinationComponent,
    ConversationComponent,
    CreateCharacterComponent,
    EncounterComponent,
    EncounterModalComponent
] as const;