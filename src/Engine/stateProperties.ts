export const enum StateProperties {
    Id = 'ss_uniqueId',
    Added = 'ss_added',
    Deleted = 'ss_deleted',
    
    // A marker to see that actions have been performed and should not be repeated.
    // This is used for e.g. initializing trader stock on a first visit.
    Triggered = 'ss_triggered'
}