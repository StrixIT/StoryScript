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
import {EnemyComponent} from "ui/Components/Enemy/enemy.component.ts";
import {EquipmentComponent} from "ui/Components/Equipment/equipment.component.ts";
import {ExplorationComponent} from "ui/Components/Exploration/exploration.component.ts";
import {GameOverComponent} from "ui/Components/GameOver/gameover.component.ts";
import {GroundComponent} from "ui/Components/Ground/ground.component.ts";
import {HighScoresComponent} from "ui/Components/HighScores/highscores.component.ts";
import {IntroComponent} from "ui/Components/Intro/intro.component.ts";
import {LevelUpComponent} from "ui/Components/LevelUp/levelup.component.ts";
import {LocationMapComponent} from "ui/Components/LocationMap/locationmap.component.ts";
import {LocationTextComponent} from "ui/Components/LocationText/locationtext.component.ts";
import {LocationVisualComponent} from "ui/Components/LocationVisual/locationvisual.component.ts";
import {MenuModalComponent} from "ui/Components/MenuModal/menumodal.component.ts";
import {NavigationComponent} from "ui/Components/Navigation/navigation.component.ts";
import {PartyComponent} from "ui/Components/Party/party.component.ts";
import {QuestComponent} from "ui/Components/Quest/quest.component.ts";
import {SoundComponent} from "ui/Components/Sound/sound.component.ts";
import {TradeComponent} from "ui/Components/Trade/trade.component.ts";
import {VictoryComponent} from "ui/Components/Victory/victory.component.ts";

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
    EncounterModalComponent,
    EnemyComponent,
    EquipmentComponent,
    ExplorationComponent,
    GameOverComponent,
    GroundComponent,
    HighScoresComponent,
    IntroComponent,
    LevelUpComponent,
    LocationMapComponent,
    LocationTextComponent,
    LocationVisualComponent,
    MenuModalComponent,
    NavigationComponent,
    PartyComponent,
    QuestComponent,
    SoundComponent,
    TradeComponent,
    VictoryComponent
] as const;