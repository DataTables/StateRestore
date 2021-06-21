export declare function setJQuery(jq: any): void;
export default class StateRestore {
    private static version;
    private static classes;
    private static defaults;
    classes: any;
    dom: any;
    c: any;
    s: any;
    constructor(settings: any, opts: any, identifier: any);
    /**
     * Removes a state from storage and
     * then triggers the dtsr-delete event so that the StateRestoreCollection class can remove it's references as well.
     *
     * @param state The identifier of the state that should be deleted
     */
    delete(state: any): void;
    /**
     * Shows a modal that allows a state to be renamed
     *
     * @param identifier The identifier for the state that is to be renamed
     */
    rename(identifier: any): void;
    /**
     * Saves the tables current state using the identifier that is passed in.
     *
     * @param identifier The identifier of the state that should be saved
     * @param state Optional. If provided this is the state that will be saved rather than using the current state
     */
    save(identifier: any, state?: boolean): void;
    /**
     * Loads the state referenced by the identifier from storage
     *
     * @param state The identifier of the state that should be loaded
     * @returns the state that has been loaded
     */
    load(state: any): {};
    /**
     * Displays a confirmation modal for the user to confirm their action
     *
     * @param message The message that should be displayed within the confirmation modal.
     * @param buttonText The text that should be displayed in the confirmation button.
     * @param buttonAction The action that should be taken when the confirmation button is pressed.
     */
    private confirmationModal;
    /**
     * Displays a rename modal for the user to rename the selected state
     *
     * @param message The message that should be displayed within the confirmation modal.
     * @param buttonText The text that should be displayed in the confirmation button.
     * @param buttonAction The action that should be taken when the confirmation button is pressed.
     */
    private renameModal;
    /**
     * Convert from camelCase notation to the internal Hungarian. We could use the
     * Hungarian convert function here, but this is cleaner
     *
     * @param {object} obj Object to convert
     * @returns {object} Inverted object
     * @memberof DataTable#oApi
     */
    private searchToHung;
}
