import {CombatComponent} from "ui/Components/Combat/combat.component.ts";
import {CombatParticipantComponent} from "ui/Components/CombatParticipant/combatparticipant.component.ts";
import {ConversationComponent} from "ui/Components/Conversation/conversation.component.ts";
import {CreateCharacterComponent} from "ui/Components/CreateCharacter/createcharacter.component.ts";
import {EncounterComponent} from "ui/Components/Encounter/encounter.component.ts";
import {EncounterModalComponent} from "ui/Components/EncounterModal/encountermodal.component.ts";
import {EnemyComponent} from "ui/Components/Enemy/enemy.component.ts";
import {ExplorationComponent} from "ui/Components/Exploration/exploration.component.ts";
import {GameOverComponent} from "ui/Components/GameOver/gameover.component.ts";
import {HighScoresComponent} from "ui/Components/HighScores/highscores.component.ts";
import {IntroComponent} from "ui/Components/Intro/intro.component.ts";
import {LevelUpComponent} from "ui/Components/LevelUp/levelup.component.ts";
import {TradeComponent} from "ui/Components/Trade/trade.component.ts";
import {VictoryComponent} from "ui/Components/Victory/victory.component.ts";

export const STORYSCRIPT_COMPONENTS = [
    CombatComponent,
    CombatParticipantComponent,
    ConversationComponent,
    CreateCharacterComponent,
    EncounterComponent,
    EncounterModalComponent,
    EnemyComponent,
    ExplorationComponent,
    GameOverComponent,
    HighScoresComponent,
    IntroComponent,
    LevelUpComponent,
    TradeComponent,
    VictoryComponent
] as const;