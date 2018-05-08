namespace StoryScript {
    export function Run(nameSpace: string, rules: IRules, texts: IInterfaceTexts) {
        var storyScriptModule = angular.module("storyscript");
        storyScriptModule.value("gameNameSpace", nameSpace);
        storyScriptModule.value("rules", rules);
        storyScriptModule.value("customTexts", texts);
    }
}