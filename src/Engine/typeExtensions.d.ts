
interface Function {
    proxy: Function;
    isProxy: boolean;

    // A workaround for Edge, in which making a proxy a named function doesn't work. 
    originalFunctionName: string;
}

interface Window {
    StoryScript: {
        GetGameDescriptions(): Map<string, string>;
    }
}

declare module '*.html' {
    const content: string
    export default content
}