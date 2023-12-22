
interface Function {
    proxy: Function;
    isProxy: boolean;
}

// These are needed to create collection mocks in testing.
interface Array<T> {
    get?(id?: string | ((...params: any) => T) | T): T;
    add?(id?: string | ((...params: any) => T) | T): T;
    remove?(id: string | ((...params: any) => T) | T): void;
    delete?(id: string | ((...params: any) => T) | T): void;
    all(id: Function): T[];
    clear(): void;
}

// This is needed to be able to import .html files. Do not remove this.
declare module '*.html' {
    const content: string
    export default content
}