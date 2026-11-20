import {isDevelopment} from "src/constants";

export const logTime = async (eventName: string, action: Function): Promise<void> => {
    if (isDevelopment) {
        console.time(eventName);
    }
    
    await action();
    
    if (isDevelopment) {
        console.timeEnd(eventName);
    }
}