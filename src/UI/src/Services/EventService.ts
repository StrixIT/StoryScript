import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Enumerations } from '../../../Engine/Interfaces/storyScript';

@Injectable()
export class EventService {
    private playStateSource = new Subject<Enumerations.PlayState>();
    private enemiesPresentSource = new Subject<boolean>();
    private combinationSource = new Subject<boolean>();

    playStateChange$ = this.playStateSource.asObservable();
    enemiesPresentChange$ = this.enemiesPresentSource.asObservable();
    combinationChange$ = this.combinationSource.asObservable();

    setCombineState = (value: boolean): void => this.combinationSource.next(value);

    setEnemiesPresent = (value: boolean): void => this.enemiesPresentSource.next(value);

    setPlayState = (value: Enumerations.PlayState): void => this.playStateSource.next(value);
}