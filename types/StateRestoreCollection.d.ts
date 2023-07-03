/// <reference types="jquery" />
import StateRestore from './StateRestore';
export declare function setJQuery(jq: any): void;
export interface IClasses {
    background: string;
    checkBox: string;
    checkLabel: string;
    checkRow: string;
    closeButton: string;
    colReorderToggle: string;
    columnsSearchToggle: string;
    columnsVisibleToggle: string;
    confirmation: string;
    confirmationButton: string;
    confirmationButtons: string;
    confirmationMessage: string;
    confirmationText: string;
    confirmationTitle: string;
    confirmationTitleRow: string;
    creation: string;
    creationButton: string;
    creationForm: string;
    creationText: string;
    creationTitle: string;
    dtButton: string;
    emptyStates: string;
    formRow: string;
    leftSide: string;
    lengthToggle: string;
    modalError: string;
    modalFoot: string;
    nameInput: string;
    nameLabel: string;
    orderToggle: string;
    pagingToggle: string;
    rightSide: string;
    scrollerToggle: string;
    searchBuilderToggle: string;
    searchPanesToggle: string;
    searchToggle: string;
    selectToggle: string;
    toggleLabel: string;
}
export interface IDom {
    background: JQuery<HTMLElement>;
    closeButton: JQuery<HTMLElement>;
    colReorderToggle: JQuery<HTMLElement>;
    columnsSearchToggle: JQuery<HTMLElement>;
    columnsVisibleToggle: JQuery<HTMLElement>;
    confirmation: JQuery<HTMLElement>;
    confirmationTitleRow: JQuery<HTMLElement>;
    createButtonRow: JQuery<HTMLElement>;
    creation: JQuery<HTMLElement>;
    creationForm: JQuery<HTMLElement>;
    creationTitle: JQuery<HTMLElement>;
    dtContainer: JQuery<HTMLElement>;
    duplicateError: JQuery<HTMLElement>;
    emptyError: JQuery<HTMLElement>;
    lengthToggle: JQuery<HTMLElement>;
    nameInputRow: JQuery<HTMLElement>;
    orderToggle: JQuery<HTMLElement>;
    pagingToggle: JQuery<HTMLElement>;
    removeContents: JQuery<HTMLElement>;
    removeTitle: JQuery<HTMLElement>;
    scrollerToggle: JQuery<HTMLElement>;
    searchBuilderToggle: JQuery<HTMLElement>;
    searchPanesToggle: JQuery<HTMLElement>;
    searchToggle: JQuery<HTMLElement>;
    selectToggle: JQuery<HTMLElement>;
    toggleLabel: JQuery<HTMLElement>;
}
export interface IDefaults {
    _createInSaved: boolean;
    ajax: boolean | string | (() => void);
    create: boolean;
    creationModal: boolean;
    i18n: II18n;
    modalCloseButton: boolean;
    preDefined?: {
        [keys: string]: any;
    };
    remove: boolean;
    rename: boolean;
    save: boolean;
    saveState: ISaveState;
    splitSecondaries: any[];
    toggle: ISaveState;
}
export interface ISaveState {
    colReorder: boolean;
    columns: IColumnDefault | boolean;
    length: boolean;
    order: boolean;
    paging: boolean;
    scroller: boolean;
    search: boolean;
    searchBuilder: boolean;
    searchPanes: boolean;
    select: boolean;
}
export interface IColumnDefault {
    search: boolean;
    visible: boolean;
}
export interface II18n {
    creationModal?: II18nCreationModal;
    duplicateError: string;
    emptyError: string;
    emptyStates: string;
    removeConfirm: string;
    removeError: string;
    removeJoiner: string;
    removeSubmit: string;
    removeTitle: string;
    renameButton: string;
    renameLabel: string;
    renameTitle: string;
}
export interface II18nCreationModal {
    button: string;
    colReorder: string;
    columns: {
        search: string;
        visible: string;
    };
    length: string;
    name: string;
    order: string;
    paging: string;
    scroller: string;
    search: string;
    searchBuilder: string;
    searchPanes: string;
    select: string;
    title: string;
    toggleLabel: string;
}
export interface IS {
    dt: any;
    hasColReorder: boolean;
    hasScroller: boolean;
    hasSearchBuilder: boolean;
    hasSearchPanes: boolean;
    hasSelect: boolean;
    states: StateRestore[];
}
export default class StateRestoreCollection {
    private static version;
    private static classes;
    private static defaults;
    classes: IClasses;
    c: IDefaults;
    s: IS;
    dom: IDom;
    constructor(settings: any, opts: IDefaults);
    /**
     * Adds a new StateRestore instance to the collection based on the current properties of the table
     *
     * @param identifier The value that is used to identify a state.
     * @returns The state that has been created
     */
    addState(identifier: string, currentIdentifiers: string[], options: IDefaults): void;
    /**
     * Removes all of the states, showing a modal to the user for confirmation
     *
     * @param removeFunction The action to be taken when the action is confirmed
     */
    removeAll(removeFunction: any): void;
    /**
     * Removes all of the dom elements from the document for the collection and the stored states
     */
    destroy(): void;
    /**
     * Identifies active states and updates their button to reflect this.
     *
     * @returns An array containing objects with the details of currently active states
     */
    findActive(): any[];
    /**
     * Gets a single state that has the identifier matching that which is passed in
     *
     * @param identifier The value that is used to identify a state
     * @returns The state that has been identified or null if no states have been identified
     */
    getState(identifier: string): null | StateRestore;
    /**
     * Gets an array of all of the states
     *
     * @returns Any states that have been identified
     */
    getStates(ids: string[]): StateRestore[];
    /**
     * Reloads states that are set via datatables config or over ajax
     *
     * @param preDefined Object containing the predefined states that are to be reintroduced
     */
    private _addPreDefined;
    /**
     * Rebuilds all of the buttons in the collection of states to make sure that states and text is up to date
     */
    private _collectionRebuild;
    /**
     * Displays a modal that is used to get information from the user to create a new state.
     *
     * @param buttonAction The action that should be taken when the button is pressed
     * @param identifier The default identifier for the next new state
     */
    private _creationModal;
    /**
     * This callback is called when a state is removed.
     * This removes the state from storage and also strips it's button from the container
     *
     * @param identifier The value that is used to identify a state
     */
    private _removeCallback;
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
     * Private method that checks for previously created states on initialisation
     */
    private _searchForStates;
}
