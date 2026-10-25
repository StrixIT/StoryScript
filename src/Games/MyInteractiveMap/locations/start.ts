import { Location } from '../types'
import description from './Start.html?raw'
import {Westphalia} from "./Westphalia";
import {Austria} from "./Austria";
import {Franconia} from "./Franconia";

export function Start() {
    return Location({
        name: 'Start',
        description: description,
        destinations: [
            {
                name: 'Austria',
                target: Austria
            },
            {
                name: 'Franconia',
                target: Franconia
            },
            {
                name: 'Westphalia',
                target: Westphalia
            }
        ]
    });
}
