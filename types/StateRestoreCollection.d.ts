export declare function setJQuery(jq: any): void;
export default class StateRestoreCollection {
    private static version;
    private static defaults;
    c: any;
    s: any;
    constructor(settings: any, opts: any);
    addState(identifier: any): any;
    getState(identifier: any): any;
    getStates(identifier: any): any;
    private _searchForStates;
}
