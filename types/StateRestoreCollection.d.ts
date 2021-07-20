/// <reference types="jquery" />
import StateRestore from './StateRestore';
export declare function setJQuery(jq: any): void;
export interface IClasses {
    background: string;
    colReorderToggle: string;
    columnsSearchToggle: string;
    columnsVisibleToggle: string;
    creation: string;
    creationButton: string;
    creationForm: string;
    creationText: string;
    dtButton: string;
    emptyStates: string;
    formRow: string;
    nameInput: string;
    orderToggle: string;
    pagingToggle: string;
    scrollerToggle: string;
    searchBuilderToggle: string;
    searchPanesToggle: string;
    searchToggle: string;
}
export interface IDom {
    background: JQuery<HTMLElement>;
    colReorderToggle: JQuery<HTMLElement>;
    columnsSearchToggle: JQuery<HTMLElement>;
    columnsVisibleToggle: JQuery<HTMLElement>;
    createButtonRow: JQuery<HTMLElement>;
    creation: JQuery<HTMLElement>;
    creationForm: JQuery<HTMLElement>;
    nameInputRow: JQuery<HTMLElement>;
    orderToggle: JQuery<HTMLElement>;
    pagingToggle: JQuery<HTMLElement>;
    scrollerToggle: JQuery<HTMLElement>;
    searchBuilderToggle: JQuery<HTMLElement>;
    searchPanesToggle: JQuery<HTMLElement>;
    searchToggle: JQuery<HTMLElement>;
}
export interface IDefaults {
    colReorder: boolean;
    colReorderToggle: boolean;
    columns: IColumnDefault | boolean;
    columnsToggle: IColumnDefault | boolean;
    create: boolean;
    creationModal: boolean;
    delete: boolean;
    i18n: II18n;
    order: boolean;
    orderToggle: boolean;
    paging: boolean;
    pagingToggle: boolean;
    rename: boolean;
    save: boolean;
    scroller: boolean;
    scrollerToggle: boolean;
    search: boolean;
    searchBuilder: boolean;
    searchBuilderToggle: boolean;
    searchPanes: boolean;
    searchPanesToggle: boolean;
    searchToggle: boolean;
}
export interface IColumnDefault {
    search: boolean;
    visible: boolean;
}
export interface II18n {
    deleteButton: string;
    deleteConfirm: string;
    emptyStates: string;
    renameButton: string;
    renameLabel: string;
}
export interface IS {
    dt: any;
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
    addState(identifier: string): void;
    /**
     * Gets a single state that has the identifier matching that which is passed in
     *
     * @param identifier The value that is used to identify a state
     * @returns The state that has been identified or null if no states have been identified
     */
    getState(identifier: string): null | StateRestore;
    /**
     * Gets an array of states that match an idenfitier that has been passed in
     *
     * @param identifier The value that is used to identify a state
     * @returns Any states that have been identified
     */
    getStates(identifier: string): StateRestore[];
    private _creationModal;
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
