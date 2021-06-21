export declare function setJQuery(jq: any): void;
export default class StateRestoreCollection {
    private static version;
    private static classes;
    private static defaults;
    classes: any;
    c: any;
    s: any;
    constructor(settings: any, opts: any);
    /**
     * Adds a new StateRestore instance to the collection based on the current properties of the table
     *
     * @param identifier The value that is used to identify a state.
     * @returns The state that has been created
     */
    addState(identifier: any): any;
    /**
     * Gets a single state that has the identifier matching that which is passed in
     *
     * @param identifier The value that is used to identify a state
     * @returns The state that has been identified or null if no states have been identified
     */
    getState(identifier: any): any;
    /**
     * Gets an array of states that match an idenfitier that has been passed in
     *
     * @param identifier The value that is used to identify a state
     * @returns Any states that have been identified
     */
    getStates(identifier: any): any;
    /**
     * Private method that checks for previously created states on initialisation
     */
    private _searchForStates;
    /**
     * This callback is called when a state is deleted.
     * This removes the state from storage and also strips it's button from the container
     *
     * @param identifier The value that is used to identify a state
     */
    private _deleteCallback;
    /**
     * Rebuilds all of the buttons in the collection of states to make sure that states and text is up to date
     */
    private _collectionRebuild;
}
