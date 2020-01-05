import { IGame } from 'storyScript/Interfaces/storyScript';

export interface IModalSettings {
    title: string;
    closeText?: string;
    canClose?: boolean;
    closeAction?: (game: IGame) => void;
    description?: string;
    descriptionType?: string;
}