/// <reference types="jquery" />
import * as restoreType from './StateRestoreCollection';
export declare function setJQuery(jq: any): void;
export interface IClasses {
    background: string;
    closeButton: string;
    confirmation: string;
    confirmationButton: string;
    confirmationButtons: string;
    confirmationMessage: string;
    confirmationText: string;
    confirmationTitle: string;
    confirmationTitleRow: string;
    dtButton: string;
    input: string;
    modalError: string;
    renameModal: string;
}
export interface IS {
    dt: any;
    identifier: string;
    isPreDefined: boolean;
    savedState: null | IState;
    tableId: string;
}
export interface IDom {
    background: JQuery<HTMLElement>;
    closeButton: JQuery<HTMLElement>;
    confirmation: JQuery<HTMLElement>;
    confirmationButton: JQuery<HTMLElement>;
    confirmationTitleRow: JQuery<HTMLElement>;
    dtContainer: JQuery<HTMLElement>;
    duplicateError: JQuery<HTMLElement>;
    emptyError: JQuery<HTMLElement>;
    removeContents: JQuery<HTMLElement>;
    removeError: JQuery<HTMLElement>;
    removeTitle: JQuery<HTMLElement>;
    renameContents: JQuery<HTMLElement>;
    renameInput: JQuery<HTMLElement>;
    renameTitle: JQuery<HTMLElement>;
}
export interface IState {
    ColReorder: any;
    c: restoreType.IDefaults;
    columns: IColumn[];
    length: number;
    order: Array<Array<string | number>>;
    page: number;
    paging: any;
    scroller: any;
    search: ISearch;
    searchBuilder: any;
    searchPanes: any;
    select: any;
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
    isPreDefined: boolean;
    state: string;
    tableId?: string;
}
export default class StateRestore {
    private static version;
    private static classes;
    private static defaults;
    classes: IClasses;
    dom: IDom;
    c: restoreType.IDefaults;
    s: IS;
    constructor(settings: any, opts: restoreType.IDefaults, identifier: string, state?: IState, isPreDefined?: boolean, successCallback?: () => any);
    /**
     * Removes a state from storage and then triggers the dtsr-remove event
     * so that the StateRestoreCollection class can remove it's references as well.
     *
     * @param skipModal Flag to indicate if the modal should be skipped or not
     */
    remove(skipModal?: boolean): boolean;
    /**
     * Compares the state held within this instance with a state that is passed in
     *
     * @param state The state that is to be compared against
     * @returns boolean indicating if the states match
     */
    compare(state: IState): boolean;
    /**
     * Removes all of the dom elements from the document
     */
    destroy(): void;
    /**
     * Loads the state referenced by the identifier from storage
     *
     * @param state The identifier of the state that should be loaded
     * @returns the state that has been loaded
     */
    load(): void | IState;
    /**
     * Shows a modal that allows a state to be renamed
     *
     * @param newIdentifier Optional. The new identifier for this state
     */
    rename(newIdentifier: null | string, currentIdentifiers: string[]): void;
    /**
     * Saves the tables current state using the identifier that is passed in.
     *
     * @param state Optional. If provided this is the state that will be saved rather than using the current state
     */
    save(state: IState, passedSuccessCallback: any, callAjax?: boolean): void;
    /**
     * Performs a deep compare of two state objects, returning true if they match
     *
     * @param state1 The first object to compare
     * @param state2 The second object to compare
     * @returns boolean indicating if the objects match
     */
    private _deepCompare;
    private _keyupFunction;
    /**
     * Creates a new confirmation modal for the user to approve an action
     *
     * @param title The title that is to be displayed at the top of the modal
     * @param buttonText The text that is to be displayed in the confirmation button of the modal
     * @param buttonAction The action that should be taken when the confirmation button is pressed
     * @param modalContents The contents for the main body of the modal
     */
    private _newModal;
    /**
     * Convert from camelCase notation to the internal Hungarian.
     * We could use the Hungarian convert function here, but this is cleaner
     *
     * @param {object} obj Object to convert
     * @returns {object} Inverted object
     * @memberof DataTable#oApi
     */
    private _searchToHung;
}
