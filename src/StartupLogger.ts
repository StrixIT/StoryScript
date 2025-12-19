export const logTime = (eventName: string, action: Function): void => {
    console.time(eventName);
    action();
    console.timeEnd(eventName)
}