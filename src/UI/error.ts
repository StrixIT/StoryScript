export interface Error {
    message: string;
    stackTrace: string;
    component?: string;
    info?: string;
}