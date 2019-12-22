
interface Function {
    proxy: Function;
    isProxy: boolean;
}

interface Window {
    StoryScript: {
        GetGameDescriptions(): Map<string, string>;
    }
}

interface String {
    parseFunction(): Function;
}

interface Array<T> {
    get?(id?: string | ((...params: any) => T) | T): T;
    remove?(id: string | ((...params: any) => T) | T): void;
    all(id: Function): T[];
}

// This is needed to be able to import .html files. Do not remove this.
declare module '*.html' {
    const content: string
    export default content
}