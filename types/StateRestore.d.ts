/// <reference types="jquery" />
import * as restoreType from './StateRestoreCollection';
export declare function setJQuery(jq: any): void;
export interface IClasses {
    background: string;
    confirmation: string;
    confirmationButton: string;
    confirmationButtons: string;
    confirmationText: string;
    dtButton: string;
    input: string;
}
export interface IS {
    dt: any;
    identifier: string;
    savedState: null | IState;
}
export interface IDom {
    background: JQuery<HTMLElement>;
    confirmation: JQuery<HTMLElement>;
}
export interface IState {
    childRows: number[];
    colReorder: any;
    columns: IColumn[];
    length: number;
    order: Array<Array<string | number>>;
    scroller: any;
    search: ISearch;
    searchBuilder: any;
    searchPanes: any;
    start: number;
    stateRestore: IStateRestore;
    time: number;
}
export interface IColumn {
    search: ISearch;
    visible: boolean;
}
export interface ISearch {
    caseInsensitive: boolean;
    regex: boolean;
    search: string;
    smart: boolean;
}
export interface IHungSearch {
    bCaseInsensitive: boolean;
    bRegex: boolean;
    bSmart: boolean;
    sSearch: string;
}
export interface IStateRestore {
    state: string;
}
export default class StateRestore {
    private static version;
    private static classes;
    private static defaults;
    classes: IClasses;
    dom: IDom;
    c: restoreType.IDefaults;
    s: IS;
    constructor(settings: any, opts: restoreType.IDefaults, identifier: string);
    /**
     * Removes a state from storage and
     * then triggers the dtsr-delete event so that the StateRestoreCollection class can remove it's references as well.
     *
     * @param skipModal Flag to indicate if the modal should be skipped or not
     */
    delete(skipModal?: boolean): void;
    /**
     * Shows a modal that allows a state to be renamed
     *
     * @param newIdentifier Optional. The new identifier for this state
     */
    rename(newIdentifier?: null | string): void;
    /**
     * Saves the tables current state using the identifier that is passed in.
     *
     * @param state Optional. If provided this is the state that will be saved rather than using the current state
     */
    save(state?: IState): void;
    /**
     * Loads the state referenced by the identifier from storage
     *
     * @param state The identifier of the state that should be loaded
     * @returns the state that has been loaded
     */
    load(): void | IState;
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
