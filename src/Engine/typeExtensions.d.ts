interface String {
    parseFunction: Function;
}

interface Function {
    proxy: Function;
    isProxy: boolean;
}