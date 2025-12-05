import {CombatComponent} from "ui/Components/Combat/combat.component.ts";
import {ExplorationComponent} from "ui/Components/Exploration/exploration.component.ts";
import {GameOverComponent} from "ui/Components/GameOver/gameover.component.ts";
import {HighScoresComponent} from "ui/Components/HighScores/highscores.component.ts";
import {IntroComponent} from "ui/Components/Intro/intro.component.ts";
import {LevelUpComponent} from "ui/Components/LevelUp/levelup.component.ts";
import {VictoryComponent} from "ui/Components/Victory/victory.component.ts";

export const STORYSCRIPT_COMPONENTS = [
    CombatComponent,
    ExplorationComponent,
    GameOverComponent,
    HighScoresComponent,
    IntroComponent,
    LevelUpComponent,
    VictoryComponent
] as const;