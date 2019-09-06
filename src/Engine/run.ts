
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
     * @param texts Your game's custom interface texts
     * @param rules Your game rules
     */
    export function Run(nameSpace: string, texts: IInterfaceTexts, rules: IRules) {
        addFunctionExtensions();
        addArrayExtensions();

        window.StoryScript.ObjectFactory = new ObjectFactory(nameSpace, rules, texts);
    }
}