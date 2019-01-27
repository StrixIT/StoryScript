
interface Window {
    StoryScript: {
        ObjectFactory: StoryScript.ObjectFactory;
        GetGameDescriptions(): Map<string, string>;
    }
}

namespace StoryScript {
    /**
     * This function bootstraps and runs your game.
     * @param nameSpace Your game's namespace (e.g. '_GameTemplate')
     * @param rules Your game rules
     * @param texts Your game's custom interface texts
     */
    export function Run(nameSpace: string, rules: IRules, texts: IInterfaceTexts) {
        addFunctionExtensions();
        addArrayExtensions();

        window.StoryScript.ObjectFactory = new ObjectFactory(nameSpace, rules, texts);
    }
}