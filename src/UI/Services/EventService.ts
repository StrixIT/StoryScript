import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { PlayState } from 'storyScript/Interfaces/storyScript';

@Injectable()
export class EventService {
    private playStateSource = new Subject<PlayState>();
    private enemiesPresentSource = new Subject<boolean>();
    private combinationSource = new Subject<boolean>();

    playStateChange$ = this.playStateSource.asObservable();
    enemiesPresentChange$ = this.enemiesPresentSource.asObservable();
    combinationChange$ = this.combinationSource.asObservable();

    setCombineState = (value: boolean): void => this.combinationSource.next(value);

    setEnemiesPresent = (value: boolean): void => this.enemiesPresentSource.next(value);

    setPlayState = (value: PlayState): void => this.playStateSource.next(value);
}