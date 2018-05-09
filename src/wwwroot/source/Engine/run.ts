
interface Window {
    StoryScript: {
        ObjectFactory: StoryScript.ObjectFactory;
    }
}

namespace StoryScript {
    export function Run(nameSpace: string, rules: IRules, texts: IInterfaceTexts) {
        addFunctionExtensions();
        addArrayExtensions();

        window.StoryScript.ObjectFactory = new ObjectFactory(nameSpace, rules, texts);
    }
}