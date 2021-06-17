declare const self: {
    close(dte: any, callback: any): void;
    conf: {
        offsetAni: number;
        windowPadding: number;
    };
    destroy(dte: any): void;
    init(dte: any): any;
    node(dte: any): HTMLElement;
    open(dte: any, append: any, callback: any): void;
};
export default self;
