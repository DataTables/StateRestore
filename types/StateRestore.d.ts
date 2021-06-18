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
    delete(state: any): void;
    save(state: any): void;
    load(state: any): {};
    private confirmationModal;
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
