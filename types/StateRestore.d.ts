export declare function setJQuery(jq: any): void;
export default class StateRestore {
    private static version;
    private static classes;
    private static defaults;
    classes: any;
    dom: any;
    c: any;
    s: any;
    constructor(settings: any, opts: any);
    delete(state: any): void;
    save(state: any): void;
    load(state: any): void;
}
