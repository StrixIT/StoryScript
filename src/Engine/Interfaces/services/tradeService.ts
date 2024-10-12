import { IPerson } from '../person';
import { IItem } from '../item';
import { ITrade } from '../trade';
import {ICharacter} from "storyScript/Interfaces/character.ts";

export interface ITradeService {
    trade(trade: IPerson | ITrade): void;
    canPay(item: IItem, buyer: ITrade | ICharacter, currency: number, value: number): boolean;
    actualPrice(item: IItem, modifier: number | (() => number)): number;
    displayPrice(item: IItem, actualPrice: number): string;
    buy(item: IItem, trade: ITrade): boolean;
    sell(item: IItem, trade: ITrade): boolean;
}