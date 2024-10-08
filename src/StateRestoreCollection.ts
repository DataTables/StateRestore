let $;
let dataTable;

import StateRestore from './StateRestore';

export function setJQuery(jq) {
	$ = jq;
	dataTable = jq.fn.dataTable;
}

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
	checkboxInputRow: JQuery<HTMLElement>;
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
	createButton: (config: any, state: any) => void;
	createState: (config: any, state: any) => void;
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
	private static version = '1.0.0';

	private static classes: IClasses = {
		background: 'dtsr-background',
		checkBox: 'dtsr-check-box',
		checkLabel: 'dtsr-check-label',
		checkRow: 'dtsr-check-row',
		closeButton: 'dtsr-popover-close',
		colReorderToggle: 'dtsr-colReorder-toggle',
		columnsSearchToggle: 'dtsr-columns-search-toggle',
		columnsVisibleToggle: 'dtsr-columns-visible-toggle',
		confirmation: 'dtsr-confirmation',
		confirmationButton: 'dtsr-confirmation-button',
		confirmationButtons: 'dtsr-confirmation-buttons',
		confirmationMessage: 'dtsr-confirmation-message dtsr-name-label',
		confirmationText: 'dtsr-confirmation-text',
		confirmationTitle: 'dtsr-confirmation-title',
		confirmationTitleRow: 'dtsr-confirmation-title-row',
		creation: 'dtsr-creation',
		creationButton: 'dtsr-creation-button',
		creationForm: 'dtsr-creation-form',
		creationText: 'dtsr-creation-text',
		creationTitle: 'dtsr-creation-title',
		dtButton: 'dt-button',
		emptyStates: 'dtsr-emptyStates',
		formRow: 'dtsr-form-row',
		leftSide: 'dtsr-left',
		lengthToggle: 'dtsr-length-toggle',
		modalError: 'dtsr-modal-error',
		modalFoot: 'dtsr-modal-foot',
		nameInput: 'dtsr-name-input',
		nameLabel: 'dtsr-name-label',
		orderToggle: 'dtsr-order-toggle',
		pagingToggle: 'dtsr-paging-toggle',
		rightSide: 'dtsr-right',
		scrollerToggle: 'dtsr-scroller-toggle',
		searchBuilderToggle: 'dtsr-searchBuilder-toggle',
		searchPanesToggle: 'dtsr-searchPanes-toggle',
		searchToggle: 'dtsr-search-toggle',
		selectToggle: 'dtsr-select-toggle',
		toggleLabel: 'dtsr-toggle-title'
	};

	private static defaults: IDefaults = {
		_createInSaved: false,
		ajax: false,
		create: true,
		creationModal: false,
		i18n: {
			creationModal: {
				button: 'Create',
				colReorder: 'Column Order',
				columns: {
					search: 'Column Search',
					visible: 'Column Visibility'
				},
				length: 'Page Length',
				name: 'Name:',
				order: 'Sorting',
				paging: 'Paging',
				scroller: 'Scroll Position',
				search: 'Search',
				searchBuilder: 'SearchBuilder',
				searchPanes: 'SearchPanes',
				select: 'Select',
				title: 'Create New State',
				toggleLabel: 'Include:'
			},
			duplicateError: 'A state with this name already exists.',
			emptyError: 'Name cannot be empty.',
			emptyStates: 'No saved states',
			removeConfirm: 'Are you sure you want to remove %s?',
			removeError: 'Failed to remove state.',
			removeJoiner: ' and ',
			removeSubmit: 'Remove',
			removeTitle: 'Remove State',
			renameButton: 'Rename',
			renameLabel: 'New Name for %s:',
			renameTitle: 'Rename State'
		},
		modalCloseButton: true,
		preDefined: {},
		remove: true,
		rename: true,
		save: true,
		saveState: {
			colReorder: true,
			columns: {
				search: true,
				visible: true
			},
			length: true,
			order: true,
			paging: true,
			scroller: true,
			search: true,
			searchBuilder: true,
			searchPanes: true,
			select: true
		},
		splitSecondaries: [
			'updateState',
			'renameState',
			'removeState'
		],
		toggle: {
			colReorder: false,
			columns:{
				search: false,
				visible: false
			},
			length: false,
			order: false,
			paging: false,
			scroller: false,
			search: false,
			searchBuilder: false,
			searchPanes: false,
			select: false
		},
		createButton: null,
		createState: null
	};

	public classes: IClasses;
	public c: IDefaults;
	public s: IS;
	public dom: IDom;

	public constructor(settings: any, opts: IDefaults) {
		// Check that the required version of DataTables is included
		if (! dataTable || ! dataTable.versionCheck || ! dataTable.versionCheck('1.10.0')) {
			throw new Error('StateRestore requires DataTables 1.10 or newer');
		}

		// Check that Select is included
		// eslint-disable-next-line no-extra-parens
		if (! (dataTable as any).Buttons) {
			throw new Error('StateRestore requires Buttons');
		}

		let table = new dataTable.Api(settings);
		this.classes = $.extend(true, {}, StateRestoreCollection.classes);

		if (table.settings()[0]._stateRestore !== undefined) {
			return;
		}

		// Get options from user
		this.c = $.extend(true, {}, StateRestoreCollection.defaults, opts);

		this.s = {
			dt: table,
			hasColReorder: (dataTable as any).ColReorder !== undefined,
			hasScroller: (dataTable as any).Scroller !== undefined,
			hasSearchBuilder: (dataTable as any).SearchBuilder !== undefined,
			hasSearchPanes: (dataTable as any).SearchPanes !== undefined,
			hasSelect: (dataTable as any).select !== undefined,
			states: []
		};

		this.s.dt.on('xhr', (e, xhrsettings, json) => {
			// Has staterestore been used before? Is there anything to load?
			if (json && json.stateRestore) {
				this._addPreDefined(json.stateRestore);
			}
		});

		this.dom = {
			background: $('<div class="'+this.classes.background+'"/>'),
			checkboxInputRow: $(
				'<div class="'+this.classes.formRow+'">' +
					'<label class="'+this.classes.nameLabel+'">'+
						this.s.dt.i18n(
							'stateRestore.creationModal.toggleLabel',
							this.c.i18n.creationModal.toggleLabel
						)+
					'</label>'+
					'<div class="dtsr-input"></div>' +
				'</div>'
			),
			closeButton: $('<div class="'+this.classes.closeButton+'">x</div>'),
			colReorderToggle: $(
				'<div class="'+this.classes.checkLabel+'">'+
					'<input type="checkbox" class="'+
						this.classes.colReorderToggle+' ' +
						this.classes.checkBox +
					'" checked>' +
					this.s.dt.i18n(
						'stateRestore.creationModal.colReorder',
						this.c.i18n.creationModal.colReorder
					)+
				'</div>'
			),
			columnsSearchToggle: $(
				'<div class="'+this.classes.checkLabel+'">'+
					'<input type="checkbox" class="'+
						this.classes.columnsSearchToggle+' ' +
						this.classes.checkBox +
					'" checked>' +
					this.s.dt.i18n(
						'stateRestore.creationModal.columns.search',
						this.c.i18n.creationModal.columns.search
					)+
				'</div>'
			),
			columnsVisibleToggle: $(
				'<div class="'+this.classes.checkLabel+'">'+
					'<input type="checkbox" class="'+
						this.classes.columnsVisibleToggle+' ' +
						this.classes.checkBox +
					'" checked>' +
					this.s.dt.i18n(
						'stateRestore.creationModal.columns.visible',
						this.c.i18n.creationModal.columns.visible
					)+
				'</div>'
			),
			confirmation: $('<div class="'+this.classes.confirmation+'"/>'),
			confirmationTitleRow: $('<div class="'+this.classes.confirmationTitleRow+'"></div>'),
			createButtonRow: $(
				'<div class="'+this.classes.formRow+' '+this.classes.modalFoot+'">' +
					'<button class="'+this.classes.creationButton+' ' + this.classes.dtButton + '">'+
						this.s.dt.i18n(
							'stateRestore.creationModal.button',
							this.c.i18n.creationModal.button
						)+
					'</button>' +
				'</div>'
			),
			creation: $('<div class="'+this.classes.creation+'"/>'),
			creationForm: $('<div class="'+this.classes.creationForm+'"/>'),
			creationTitle: $(
				'<div class="'+this.classes.creationText+'">'+
					'<h2 class="'+this.classes.creationTitle+'">'+
						this.s.dt.i18n(
							'stateRestore.creationModal.title',
							this.c.i18n.creationModal.title
						)+
					'</h2>'+
				'</div>'
			),
			dtContainer: $(this.s.dt.table().container()),
			duplicateError: $(
				'<span class="'+this.classes.modalError+'">' +
					this.s.dt.i18n('stateRestore.duplicateError', this.c.i18n.duplicateError) +
				'</span>'
			),
			emptyError: $(
				'<span class="'+this.classes.modalError+'">' +
					this.s.dt.i18n('stateRestore.emptyError', this.c.i18n.emptyError) +
				'</span>'
			),
			lengthToggle: $(
				'<div class="'+this.classes.checkLabel+'">'+
					'<input type="checkbox" class="'+
						this.classes.lengthToggle+' ' +
						this.classes.checkBox +
					'" checked>' +
					this.s.dt.i18n(
						'stateRestore.creationModal.length',
						this.c.i18n.creationModal.length
					)+
				'</div>'
			),
			nameInputRow: $(
				'<div class="'+this.classes.formRow+'">' +
					'<label class="'+this.classes.nameLabel+'">'+
						this.s.dt.i18n(
							'stateRestore.creationModal.name',
							this.c.i18n.creationModal.name
						)+
					'</label>'+
					'<div class="dtsr-input">'+
						'<input class="'+this.classes.nameInput+'" type="text">' +
					'</div>'+
				'</div>'
			),
			orderToggle: $(
				'<div class="'+this.classes.checkLabel+'">'+
					'<input type="checkbox" class="'+
						this.classes.orderToggle+' ' +
						this.classes.checkBox +
					'" checked>' +
					this.s.dt.i18n(
						'stateRestore.creationModal.order',
						this.c.i18n.creationModal.order
					)+
				'</div>'
			),
			pagingToggle: $(
				'<div class="'+this.classes.checkLabel+'">'+
					'<input type="checkbox" class="'+
						this.classes.pagingToggle+' ' +
						this.classes.checkBox +
					'" checked>' +
					this.s.dt.i18n(
						'stateRestore.creationModal.paging',
						this.c.i18n.creationModal.paging
					)+
				'</div>'
			),
			removeContents: $(
				'<div class="'+this.classes.confirmationText+'"><span></span></div>'
			),
			removeTitle: $(
				'<div class="'+this.classes.creationText+'">'+
					'<h2 class="'+this.classes.creationTitle+'">'+
						this.s.dt.i18n(
							'stateRestore.removeTitle',
							this.c.i18n.removeTitle
						)+
					'</h2>'+
				'</div>'
			),
			scrollerToggle: $(
				'<div class="'+this.classes.checkLabel+'">'+
					'<input type="checkbox" class="'+
						this.classes.scrollerToggle+' ' +
						this.classes.checkBox +
					'" checked>' +
					this.s.dt.i18n(
						'stateRestore.creationModal.scroller',
						this.c.i18n.creationModal.scroller
					)+
				'</div>'
			),
			searchBuilderToggle: $(
				'<div class="'+this.classes.checkLabel+'">'+
					'<input type="checkbox" class="'+
						this.classes.searchBuilderToggle+' ' +
						this.classes.checkBox +
					'" checked>' +
					this.s.dt.i18n(
						'stateRestore.creationModal.searchBuilder',
						this.c.i18n.creationModal.searchBuilder
					)+
				'</div>'
			),
			searchPanesToggle: $(
				'<div class="'+this.classes.checkLabel+'">'+
					'<input type="checkbox" class="'+
						this.classes.searchPanesToggle+' ' +
						this.classes.checkBox +
					'" checked>' +
					this.s.dt.i18n(
						'stateRestore.creationModal.searchPanes',
						this.c.i18n.creationModal.searchPanes
					)+
				'</div>'
			),
			searchToggle: $(
				'<div class="'+this.classes.checkLabel+'">'+
					'<input type="checkbox" class="'+
						this.classes.searchToggle+' ' +
						this.classes.checkBox +
					'" checked>' +
					this.s.dt.i18n(
						'stateRestore.creationModal.search',
						this.c.i18n.creationModal.search
					)+
				'</div>'
			),
			selectToggle: $(
				'<div class="'+this.classes.checkLabel+'">'+
					'<input type="checkbox" class="'+
						this.classes.selectToggle+' ' +
						this.classes.checkBox +
					'" checked>' +
					this.s.dt.i18n(
						'stateRestore.creationModal.select',
						this.c.i18n.creationModal.select
					)+
				'</div>'
			)
		};

		table.settings()[0]._stateRestore = this;
		this._searchForStates();

		// Has staterestore been used before? Is there anything to load?
		this._addPreDefined(this.c.preDefined);

		let ajaxFunction;
		let ajaxData = {
			action: 'load'
		};

		if (typeof this.c.ajax === 'function') {
			ajaxFunction = () => {
				if(typeof this.c.ajax === 'function') {
					this.c.ajax.call(this.s.dt, ajaxData, s => this._addPreDefined(s));
				}
			};
		}
		else if (typeof this.c.ajax === 'string') {
			ajaxFunction = () => {
				$.ajax({
					data: ajaxData,
					dataType: 'json',
					success: (data) => {
						this._addPreDefined(data);
					},
					type: 'POST',
					url: this.c.ajax
				});
			};
		}

		if (typeof ajaxFunction === 'function') {
			if(this.s.dt.settings()[0]._bInitComplete) {
				ajaxFunction();
			}
			else {
				this.s.dt.one('preInit.dtsr', () => {
					ajaxFunction();
				});
			}
		}

		this.s.dt.on('destroy.dtsr', () => {
			this.destroy();
		});

		this.s.dt.on('draw.dtsr buttons-action.dtsr', () => this.findActive());

		return this;
	}

	/**
	 * Adds a new StateRestore instance to the collection based on the current properties of the table
	 *
	 * @param identifier The value that is used to identify a state.
	 * @returns The state that has been created
	 */
	public addState(identifier: string, currentIdentifiers: string[], options: IDefaults): void {
		// If creation/saving is not allowed then return
		if (!this.c.create || !this.c.save) {
			return;
		}

		// Check if the state exists before creating a new ones
		let state = this.getState(identifier);
		let createFunction = (id, toggles) => {
			if (id.length === 0) {
				return 'empty';
			}
			else if (currentIdentifiers.includes(id)) {
				return 'duplicate';
			}

			this.s.dt.state.save();

			let that = this;
			let successCallback = function() {
				that.s.states.push(this);
				that._collectionRebuild();
			};

			let currState = this.s.dt.state();
			currState.stateRestore = {
				isPredefined: false,
				state: id,
				tableId: this.s.dt.table().node().id
			};

			if (toggles.saveState) {
				let opts = this.c.saveState;

				// We don't want to extend, but instead AND all properties of the saveState option
				for (let key of Object.keys(toggles.saveState)) {
					if (typeof toggles.saveState[key] === 'object') {
						for (let nestedKey of Object.keys(toggles.saveState[key])) {
							if (!toggles.saveState[key][nestedKey]) {
								opts[key][nestedKey] = false;
							}
						}
					}
					else if (!toggles.saveState[key]) {
						opts[key] = false;
					}
				}

				this.c.saveState = opts;
			}


			let newState = new StateRestore(
				this.s.dt.settings()[0],
				$.extend(true, {}, this.c, options),
				id,
				currState,
				false,
				successCallback
			);
			$(this.s.dt.table().node()).on('dtsr-modal-inserted', () => {
				newState.dom.confirmation.one('dtsr-remove', () => this._removeCallback(newState.s.identifier));
				newState.dom.confirmation.one('dtsr-rename', () => this._collectionRebuild());
				newState.dom.confirmation.one('dtsr-save', () => this._collectionRebuild());
			});

			return true;
		};

		// If there isn't already a state with this identifier
		if (state === null) {
			if(this.c.creationModal || options !== undefined && options.creationModal) {
				this._creationModal(createFunction, identifier, options);
			}
			else {
				let success = createFunction(identifier, {});

				if(success === 'empty') {
					throw new Error(this.s.dt.i18n('stateRestore.emptyError', this.c.i18n.emptyError));
				}
				else if(success === 'duplicate') {
					throw new Error(this.s.dt.i18n('stateRestore.duplicateError', this.c.i18n.duplicateError));
				}
			}
		}
		else {
			throw new Error(this.s.dt.i18n('stateRestore.duplicateError', this.c.i18n.duplicateError));
		}
	}

	/**
	 * Removes all of the states, showing a modal to the user for confirmation
	 *
	 * @param removeFunction The action to be taken when the action is confirmed
	 */
	public removeAll(removeFunction): void {
		// There are no states to remove so just return
		if (this.s.states.length === 0) {
			return;
		}

		let ids = this.s.states.map(state => state.s.identifier);

		let replacementString = ids[0];

		if (ids.length > 1) {
			replacementString = ids.slice(0, -1).join(', ') +
				this.s.dt.i18n('stateRestore.removeJoiner', this.c.i18n.removeJoiner) +
				ids.slice(-1);
		}

		$(this.dom.removeContents.children('span')).html(
			this.s.dt
				.i18n('stateRestore.removeConfirm', this.c.i18n.removeConfirm)
				.replace(/%s/g, replacementString)
		);

		this._newModal(
			this.dom.removeTitle,
			this.s.dt.i18n('stateRestore.removeSubmit', this.c.i18n.removeSubmit),
			removeFunction,
			this.dom.removeContents
		);
	}

	/**
	 * Removes all of the dom elements from the document for the collection and the stored states
	 */
	public destroy(): void {
		for(let state of this.s.states) {
			state.destroy();
		}

		$.each(this.dom, (name, el) => {
			el.off().remove();
		});

		this.s.states = [];

		this.s.dt.off('.dtsr');
		$(this.s.dt.table().node()).off('.dtsr');
	}

	/**
	 * Identifies active states and updates their button to reflect this.
	 *
	 * @returns An array containing objects with the details of currently active states
	 */
	public findActive() {
		// Make sure that the state is up to date
		this.s.dt.state.save();

		let currState = this.s.dt.state();
		let button;

		// Make all of the buttons inactive so that only any that match will be marked as active
		let buttons = this.s.dt.buttons().nodes();

		for (button of buttons) {
			if ($(button).hasClass('dtsr-state') || $(button).children().hasClass('dtsr-state')) {
				this.s.dt.button(button).active(false);
			}
		}

		let results = [];

		// Go through all of the states comparing if their state is the same to the current one
		for (let state of this.s.states) {
			if (state.compare(currState)) {
				results.push({
					data: state.s.savedState,
					name: state.s.identifier
				});

				// If so, find the corresponding button and mark it as active
				for (button of buttons) {
					let btn = this.s.dt.button(button);

					if (btn.text() === state.s.identifier) {
						btn.active(true);
						break;
					}
				}
			}
		}

		return results;
	}

	/**
	 * Gets a single state that has the identifier matching that which is passed in
	 *
	 * @param identifier The value that is used to identify a state
	 * @returns The state that has been identified or null if no states have been identified
	 */
	public getState(identifier: string): null | StateRestore {
		for (let state of this.s.states) {
			if (state.s.identifier === identifier) {
				return state;
			}
		}

		return null;
	}

	/**
	 * Gets an array of all of the states
	 *
	 * @returns Any states that have been identified
	 */
	public getStates(ids: string[]): StateRestore[] {
		if (ids === undefined) {
			return this.s.states;
		}
		else {
			let states = [];

			for(let id of ids) {
				let found = false;
				for(let state of this.s.states) {
					if(id === state.s.identifier) {
						states.push(state);
						found = true;
						break;
					}
				}
				if (!found) {
					states.push(undefined);
				}
			}

			return states;
		}
	}

	/**
	 * Reloads states that are set via datatables config or over ajax
	 *
	 * @param preDefined Object containing the predefined states that are to be reintroduced
	 */
	private _addPreDefined(preDefined) {
		// There is a potential issue here if sorting where the string parts of the name are the same,
		// only the number differs and there are many states - but this wouldn't be usfeul naming so
		// more of a priority to sort alphabetically
		let states = Object.keys(preDefined).sort((a, b) => a > b ? 1 : a < b ? -1 : 0);

		for (let state of states) {
			for(let i = 0; i < this.s.states.length; i++) {
				if(this.s.states[i].s.identifier === state) {
					this.s.states.splice(i, 1);
				}
			}

			let that = this;
			let successCallback = function() {
				that.s.states.push(this);
				that._collectionRebuild();
			};

			let loadedState = preDefined[state];
			let stateConfig = $.extend(
				true,
				{},
				this.c,
				loadedState.c !== undefined ?
					{
						saveState: loadedState.c.saveState,
						remove: loadedState.c.remove,
						rename: loadedState.c.rename,
						save: loadedState.c.save
					} :
					undefined,
				true
			);

			if (this.c.createState) {
				this.c.createState(stateConfig, loadedState);
			}

			let newState = new StateRestore(
				this.s.dt,
				stateConfig,
				state,
				loadedState,
				true,
				successCallback
			);

			$(this.s.dt.table().node()).on('dtsr-modal-inserted', () => {
				newState.dom.confirmation.one('dtsr-remove', () => this._removeCallback(newState.s.identifier));
				newState.dom.confirmation.one('dtsr-rename', () => this._collectionRebuild());
				newState.dom.confirmation.one('dtsr-save', () => this._collectionRebuild());
			});
		}
	}

	/**
	 * Rebuilds all of the buttons in the collection of states to make sure that states and text is up to date
	 */
	private _collectionRebuild(): void {
		let button = this.s.dt.button('SaveStateRestore:name');
		let stateButtons = [];
		let i;
	
		// Need to get the original configuration object, so we can rebuild it
		// It might be nested, so need to traverse down the tree
		if (button[0]) {
			let idxs = button.index().split('-');
	
			stateButtons = button[0].inst.c.buttons;
	
			for (i=0 ; i<idxs.length ; i++) {
				if (stateButtons[idxs[i]].buttons) {
					stateButtons = stateButtons[idxs[i]].buttons;
				}
				else {
					stateButtons = [];
					break;
				}
			}
		}

		// remove any states from the previous rebuild - if they are still there they will be added later
		for (i = 0; i < stateButtons.length; i++) {
			if (stateButtons[i].extend === 'stateRestore') {
				stateButtons.splice(i,1);
				i--;
			}
		}

		if (this.c._createInSaved) {
			stateButtons.push('createState');
		}

		let emptyText = '<span class="'+this.classes.emptyStates+'">' +
				this.s.dt.i18n('stateRestore.emptyStates', this.c.i18n.emptyStates) +
			'</span>';

		// If there are no states display an empty message
		if (this.s.states.length === 0) {
			// Don't want the empty text included more than twice
			if (!stateButtons.includes(emptyText)) {
				stateButtons.push(emptyText);
			}
		}
		else {
			// There are states to add so there shouldn't be any empty text left!
			while (stateButtons.includes(emptyText)) {
				stateButtons.splice(stateButtons.indexOf(emptyText), 1);
			}

			// There is a potential issue here if sorting where the string parts of the name are the same,
			// only the number differs and there are many states - but this wouldn't be usfeul naming so
			// more of a priority to sort alphabetically
			this.s.states = this.s.states.sort((a, b) => {
				let aId = a.s.identifier;
				let bId = b.s.identifier;

				return aId > bId ?
					1 :
					aId < bId ?
						-1 :
						0;
			});

			// Construct the split property of each button
			for (let state of this.s.states) {
				let split = this.c.splitSecondaries.slice();
				if (split.includes('updateState') && (!this.c.save || !state.c.save)) {
					split.splice(split.indexOf('updateState'), 1);
				}
				if (
					split.includes('renameState') &&
					(!this.c.save || !state.c.save || !this.c.rename || !state.c.rename)
				) {
					split.splice(split.indexOf('renameState'), 1);
				}
				if (split.includes('removeState') && (!this.c.remove || !state.c.remove)) {
					split.splice(split.indexOf('removeState'), 1);
				}

				let buttonConfig = {
					_stateRestore: state,
					attr: {
						title: state.s.identifier
					},
					config: {
						split
					},
					extend: 'stateRestore',
					text: StateRestore.entityEncode(state.s.identifier),
					popoverTitle: StateRestore.entityEncode(state.s.identifier)
				};

				if (this.c.createButton) {
					this.c.createButton(buttonConfig, state.s.savedState);
				}

				stateButtons.push(buttonConfig);
			}
		}

		button.collectionRebuild(stateButtons);

		// Need to disable the removeAllStates button if there are no states and it is present
		let buttons = this.s.dt.buttons();

		for (let butt of buttons) {
			if ($(butt.node).hasClass('dtsr-removeAllStates')) {
				if (this.s.states.length === 0) {
					this.s.dt.button(butt.node).disable();
				}
				else {
					this.s.dt.button(butt.node).enable();
				}
			}
		}
	}

	/**
	 * Displays a modal that is used to get information from the user to create a new state.
	 *
	 * @param buttonAction The action that should be taken when the button is pressed
	 * @param identifier The default identifier for the next new state
	 */
	private _creationModal(buttonAction, identifier, options: IDefaults): void {
		this.dom.creation.empty();
		this.dom.creationForm.empty();
		this.dom.nameInputRow.find('input').val(identifier);
		this.dom.creationForm.append(this.dom.nameInputRow);
		let tableConfig = this.s.dt.settings()[0].oInit;
		let toggle;
		let togglesToInsert = [];
		let toggleDefined = options !== undefined && options.toggle !== undefined;

		// Order toggle - check toggle and saving enabled
		if (
			(
				(!toggleDefined || options.toggle.order === undefined) && this.c.toggle.order ||
				toggleDefined && options.toggle.order
			) &&
			this.c.saveState.order &&
			(tableConfig.ordering === undefined || tableConfig.ordering)
		) {
			togglesToInsert.push(this.dom.orderToggle);
		}

		// Search toggle - check toggle and saving enabled
		if (
			(
				(!toggleDefined || options.toggle.search === undefined) && this.c.toggle.search ||
				toggleDefined && options.toggle.search
			) &&
			this.c.saveState.search &&
			(tableConfig.searching === undefined || tableConfig.searching)
		) {
			togglesToInsert.push(this.dom.searchToggle);
		}

		// Paging toggle - check toggle and saving enabled
		if (
			(
				(!toggleDefined || options.toggle.paging === undefined) && this.c.toggle.paging ||
				toggleDefined && options.toggle.paging
			) &&
			this.c.saveState.paging &&
			(tableConfig.paging === undefined || tableConfig.paging)
		) {
			togglesToInsert.push(this.dom.pagingToggle);
		}

		// Page Length toggle - check toggle and saving enabled
		if (
			(
				(!toggleDefined || options.toggle.length === undefined) && this.c.toggle.length ||
				toggleDefined && options.toggle.length
			) &&
			this.c.saveState.length &&
			(tableConfig.length === undefined || tableConfig.length)
		) {
			togglesToInsert.push(this.dom.lengthToggle);
		}

		// ColReorder toggle - check toggle and saving enabled
		if (
			this.s.hasColReorder &&
			(
				(!toggleDefined || options.toggle.colReorder === undefined) && this.c.toggle.colReorder ||
				toggleDefined && options.toggle.colReorder
			) &&
			this.c.saveState.colReorder
		) {
			togglesToInsert.push(this.dom.colReorderToggle);
		}

		// Scroller toggle - check toggle and saving enabled
		if (
			this.s.hasScroller &&
			(
				(!toggleDefined || options.toggle.scroller === undefined) && this.c.toggle.scroller ||
				toggleDefined && options.toggle.scroller
			) &&
			this.c.saveState.scroller
		) {
			togglesToInsert.push(this.dom.scrollerToggle);
		}

		// SearchBuilder toggle - check toggle and saving enabled
		if (
			this.s.hasSearchBuilder &&
			(
				(!toggleDefined || options.toggle.searchBuilder === undefined) && this.c.toggle.searchBuilder ||
				toggleDefined && options.toggle.searchBuilder
			) &&
			this.c.saveState.searchBuilder
		) {
			togglesToInsert.push(this.dom.searchBuilderToggle);
		}

		// SearchPanes toggle - check toggle and saving enabled
		if (
			this.s.hasSearchPanes &&
			(
				(!toggleDefined || options.toggle.searchPanes === undefined) && this.c.toggle.searchPanes ||
				toggleDefined && options.toggle.searchPanes
			) &&
			this.c.saveState.searchPanes
		) {
			togglesToInsert.push(this.dom.searchPanesToggle);
		}

		// Select toggle - check toggle and saving enabled
		if (
			this.s.hasSelect &&
			(
				(!toggleDefined || options.toggle.select === undefined) && this.c.toggle.select ||
				toggleDefined && options.toggle.select
			) &&
			this.c.saveState.select
		) {
			togglesToInsert.push(this.dom.selectToggle);
		}

		// Columns toggle - check toggle and saving enabled
		if (
			typeof this.c.toggle.columns === 'boolean' &&
			(
				(!toggleDefined || options.toggle.order === undefined) && this.c.toggle.columns ||
				toggleDefined && options.toggle.order
			) &&
			this.c.saveState.columns
		) {
			togglesToInsert.push(this.dom.columnsSearchToggle);
			togglesToInsert.push(this.dom.columnsVisibleToggle);
		}
		else if (
			(!toggleDefined || options.toggle.columns === undefined) && typeof this.c.toggle.columns !== 'boolean' ||
			typeof options.toggle.order !== 'boolean'
		) {
			if (typeof this.c.saveState.columns !== 'boolean' && this.c.saveState.columns) {
				// Column search toggle - check toggle and saving enabled
				if (
					(
						// columns.search is defined when passed in
						toggleDefined &&
						options.toggle.columns !== undefined &&
						typeof options.toggle.columns !== 'boolean' &&
						options.toggle.columns.search ||
						// Columns search is not defined when passed in but is in defaults
						(
							!toggleDefined ||
							options.toggle.columns === undefined ||
							typeof options.toggle.columns !== 'boolean' && options.toggle.columns.search === undefined
						) &&
						typeof this.c.toggle.columns !== 'boolean' &&
						this.c.toggle.columns.search
					) &&
					this.c.saveState.columns.search
				) {
					togglesToInsert.push(this.dom.columnsSearchToggle);
				}

				// Column visiblity toggle - check toggle and saving enabled
				if (
					(
						// columns.visible is defined when passed in
						toggleDefined &&
						options.toggle.columns !== undefined &&
						typeof options.toggle.columns !== 'boolean' &&
						options.toggle.columns.visible ||
						// Columns visible is not defined when passed in but is in defaults
						(
							!toggleDefined ||
							options.toggle.columns === undefined ||
							typeof options.toggle.columns !== 'boolean' && options.toggle.columns.visible === undefined
						) &&
						typeof this.c.toggle.columns !== 'boolean' &&
						this.c.toggle.columns.visible
					) &&
					this.c.saveState.columns.visible
				) {
					togglesToInsert.push(this.dom.columnsVisibleToggle);
				}
			}
			else if (this.c.saveState.columns) {
				togglesToInsert.push(this.dom.columnsSearchToggle);
				togglesToInsert.push(this.dom.columnsVisibleToggle);
			}
		}

		// Make sure that the toggles are displayed alphabetically
		togglesToInsert.sort((a, b) => {
			let aVal = a.text();
			let bVal = b.text();

			if (aVal < bVal) {
				return -1;
			}
			else if (aVal > bVal) {
				return 1;
			}
			else {
				return 0;
			}
		});

		// Append all of the toggles that are to be inserted
		let checkboxesEl = this.dom.checkboxInputRow
			.css('display', togglesToInsert.length ? 'block' : 'none')
			.appendTo(this.dom.creationForm)
			.find('div.dtsr-input')
			.empty();

		// let checkboxes = $('<div class="'+this.classes.formRow+' '+this.classes.checkRow+'"></div>')
		// 	.appendTo(this.dom.creationForm);

		for (toggle of togglesToInsert) {
			checkboxesEl.append(toggle);
		}

		// Insert the toggle label next to the first check box
		// $(this.dom.creationForm.children('div.'+this.classes.checkRow)[0]).prepend(this.dom.toggleLabel);

		// Insert the creation modal and the background
		this.dom.background.appendTo(this.dom.dtContainer);
		this.dom.creation
			.append(this.dom.creationTitle)
			.append(this.dom.creationForm)
			.append(this.dom.createButtonRow)
			.appendTo(this.dom.dtContainer);

		$(this.s.dt.table().node()).trigger('dtsr-modal-inserted');

		// Allow the label to be clicked to toggle the checkbox
		for (toggle of togglesToInsert) {
			$(toggle.children('label:last-child')).on('click', function() {
				toggle.children('input').prop('checked', !toggle.children('input').prop('checked'));
			});
		}

		let creationButton = $('button.'+this.classes.creationButton.replace(/ /g, '.'));
		let inputs = this.dom.creationForm.find('input');

		// If there is an input focus on that
		if (inputs.length > 0) {
			$(inputs[0]).focus();
		}
		// Otherwise focus on the confirmation button
		else {
			creationButton.focus();
		}

		let background = $('div.'+this.classes.background.replace(/ /g, '.'));
		let keyupFunction = function(e) {
			if (e.key === 'Enter') {
				creationButton.click();
			}
			else if (e.key === 'Escape') {
				background.click();
			}
		};

		if (this.c.modalCloseButton) {
			this.dom.creation.append(this.dom.closeButton);
			this.dom.closeButton.on('click', () => background.click());
		}

		creationButton.on('click', () => {
			// Get the values of the checkBoxes
			let saveState = {
				colReorder: this.dom.colReorderToggle.find('input').is(':checked'),
				columns: {
					search: this.dom.columnsSearchToggle.find('input').is(':checked'),
					visible: this.dom.columnsVisibleToggle.find('input').is(':checked')
				},
				length: this.dom.lengthToggle.find('input').is(':checked'),
				order: this.dom.orderToggle.find('input').is(':checked'),
				paging: this.dom.pagingToggle.find('input').is(':checked'),
				scroller: this.dom.scrollerToggle.find('input').is(':checked'),
				search: this.dom.searchToggle.find('input').is(':checked'),
				searchBuilder: this.dom.searchBuilderToggle.find('input').is(':checked'),
				searchPanes: this.dom.searchPanesToggle.find('input').is(':checked'),
				select: this.dom.selectToggle.find('input').is(':checked')
			};

			// Call the buttons functionality passing in the identifier and what should be saved
			let success = buttonAction($('input.' + this.classes.nameInput.replace(/ /g, '.')).val(), {saveState});

			if(success === true) {
				// Remove the dom elements as operation has completed
				this.dom.background.remove();
				this.dom.creation.remove();

				// Unbind the keyup function  - don't want it to run unnecessarily on every keypress that occurs
				$(document).unbind('keyup', keyupFunction);
			}
			else {
				this.dom.creation.children('.'+this.classes.modalError).remove();
				this.dom.creation.append(this.dom[success+'Error']);
			}
		});

		background.one('click', () => {
			// Remove the dome elements as operation has been cancelled
			this.dom.background.remove();
			this.dom.creation.remove();
			// Unbind the keyup function - don't want it to run unnecessarily on every keypress that occurs
			$(document).unbind('keyup', keyupFunction);

			// Rebuild the collection to ensure that the latest changes are present
			this._collectionRebuild();
		});

		// Have to listen to the keyup event as `escape` doesn't trigger keypress
		$(document).on('keyup', keyupFunction);

		// Need to save the state before the focus is lost when the modal is interacted with
		this.s.dt.state.save();
	}

	/**
	 * This callback is called when a state is removed.
	 * This removes the state from storage and also strips it's button from the container
	 *
	 * @param identifier The value that is used to identify a state
	 */
	private _removeCallback(identifier: string): boolean {
		for (let i = 0; i < this.s.states.length; i++) {
			if (this.s.states[i].s.identifier === identifier) {
				this.s.states.splice(i, 1);
				i--;
			}
		}

		this._collectionRebuild();

		return true;
	}

	/**
	 * Creates a new confirmation modal for the user to approve an action
	 *
	 * @param title The title that is to be displayed at the top of the modal
	 * @param buttonText The text that is to be displayed in the confirmation button of the modal
	 * @param buttonAction The action that should be taken when the confirmation button is pressed
	 * @param modalContents The contents for the main body of the modal
	 */
	private _newModal(
		title: JQuery<HTMLElement>,
		buttonText: string,
		buttonAction: (skipModal: boolean) => boolean | string,
		modalContents: JQuery<HTMLElement>
	): void {
		this.dom.background.appendTo(this.dom.dtContainer);
		this.dom.confirmationTitleRow.empty().append(title);
		let confirmationButton = $(
			'<button class="'+this.classes.confirmationButton+' '+this.classes.dtButton+'">'+
				buttonText+
			'</button>'
		);
		this.dom.confirmation
			.empty()
			.append(this.dom.confirmationTitleRow)
			.append(modalContents)
			.append(
				$('<div class="'+this.classes.confirmationButtons+'"></div>')
					.append(confirmationButton)
			)
			.appendTo(this.dom.dtContainer);

		$(this.s.dt.table().node()).trigger('dtsr-modal-inserted');

		let inputs = modalContents.children('input');

		// If there is an input focus on that
		if (inputs.length > 0) {
			$(inputs[0]).focus();
		}
		// Otherwise focus on the confirmation button
		else {
			confirmationButton.focus();
		}

		let background = $('div.'+this.classes.background.replace(/ /g, '.'));

		let keyupFunction = function(e) {
			// If enter same action as pressing the button
			if (e.key === 'Enter') {
				confirmationButton.click();
			}
			// If escape close modal
			else if (e.key === 'Escape') {
				background.click();
			}
		};

		// When the button is clicked, call the appropriate action,
		// remove the background and modal from the screen and unbind the keyup event.
		confirmationButton.on('click', () => {
			let success = buttonAction(true);
			if (success === true) {
				this.dom.background.remove();
				this.dom.confirmation.remove();
				$(document).unbind('keyup', keyupFunction);
				confirmationButton.off('click');
			}
			else {
				this.dom.confirmation.children('.'+this.classes.modalError).remove();
				this.dom.confirmation.append(this.dom[success+'Error']);
			}
		});

		this.dom.confirmation.on('click', (e) => {
			e.stopPropagation();
		});

		// When the button is clicked, remove the background and modal from the screen and unbind the keyup event.
		background.one('click', () => {
			this.dom.background.remove();
			this.dom.confirmation.remove();
			$(document).unbind('keyup', keyupFunction);
		});

		$(document).on('keyup', keyupFunction);
	}

	/**
	 * Private method that checks for previously created states on initialisation
	 */
	private _searchForStates(): void {
		let keys = Object.keys(localStorage);

		for (let key of keys) {
			// eslint-disable-next-line no-useless-escape
			if (
				key.match(new RegExp('^DataTables_stateRestore_.*_'+location.pathname+'$')) ||
				key.match(
					new RegExp(
						'^DataTables_stateRestore_.*_'+location.pathname+
						'_'+this.s.dt.table().node().id+'$'
					)
				)
			) {
				let loadedState = JSON.parse(localStorage.getItem(key));

				if (
					loadedState.stateRestore.isPreDefined ||
					(
						loadedState.stateRestore.tableId &&
						loadedState.stateRestore.tableId !== this.s.dt.table().node().id
					)
				) {
					continue;
				}

				let that = this;
				let successCallback = function() {
					this.s.savedState = loadedState;
					that.s.states.push(this);
					that._collectionRebuild();
				};


				let newState = new StateRestore(
					this.s.dt,
					$.extend(true, {}, this.c, {saveState: loadedState.c.saveState}),
					loadedState.stateRestore.state,
					loadedState,
					false,
					successCallback
				);
				$(this.s.dt.table().node()).on('dtsr-modal-inserted', () => {
					newState.dom.confirmation.one('dtsr-remove', () => this._removeCallback(newState.s.identifier));
					newState.dom.confirmation.one('dtsr-rename', () => this._collectionRebuild());
					newState.dom.confirmation.one('dtsr-save', () => this._collectionRebuild());
				});
			}
		}
	}
}
