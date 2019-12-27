import { IPerson } from '../person';
import { IItem } from '../item';
import { ITrade } from '../trade';

export interface ITradeService {
    trade(trade: IPerson | ITrade): void;
    canPay(currency: number, value: number): boolean;
    actualPrice(item: IItem, modifier: number | (() => number)): number;
    displayPrice(item: IItem, actualPrice: number): string;
    buy(item: IItem, trade: ITrade): boolean;
    sell(item: IItem, trade: ITrade): boolean;
}