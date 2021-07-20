let $;
let dataTable;

import { create } from 'domain';
import StateRestore from './StateRestore';

export function setJQuery(jq) {
	$ = jq;
	dataTable = jq.fn.dataTable;
}

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
	private static version = '0.0.1';

	private static classes: IClasses = {
		background: 'dtsr-background',
		colReorderToggle: 'dtsr-colReorder-toggle',
		columnsSearchToggle: 'dtsr-columns-search-toggle',
		columnsVisibleToggle: 'dtsr-columns-visible-toggle',
		creation: 'dtsr-creation',
		creationButton: 'dtsr-creation-button',
		creationForm: 'dtsr-creation-form',
		creationText: 'dtsr-creation-text',
		dtButton: 'dt-button',
		emptyStates: 'dtsr-emptyStates',
		formRow: 'dtsr-form-row',
		nameInput: 'dtsr-name-input',
		orderToggle: 'dtsr-order-toggle',
		pagingToggle: 'dtsr-paging-toggle',
		scrollerToggle: 'dtsr-scroller-toggle',
		searchBuilderToggle: 'dtsr-searchBuilder-toggle',
		searchPanesToggle: 'dtsr-searchPanes-toggle',
		searchToggle: 'dtsr-search-toggle'
	};

	private static defaults: IDefaults = {
		colReorder: true,
		colReorderToggle: true,
		columns: {
			search: true,
			visible: true
		},
		columnsToggle: {
			search: true,
			visible: true
		},
		create: true,
		creationModal: true,
		delete: true,
		i18n: {
			deleteButton: 'Delete',
			deleteConfirm: 'Are you sure you want to delete this state?',
			emptyStates: 'No saved states',
			renameButton: 'Rename',
			renameLabel: 'New Name:'
		},
		order: true,
		orderToggle: true,
		paging: true,
		pagingToggle: true,
		rename: true,
		save: true,
		scroller: true,
		scrollerToggle: true,
		search: true,
		searchBuilder: true,
		searchBuilderToggle: true,
		searchPanes: true,
		searchPanesToggle: true,
		searchToggle: true
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

		// Get options from user
		this.c = $.extend(true, {}, StateRestoreCollection.defaults, opts);

		this.s = {
			dt: table,
			states: []
		};

		this.dom = {
			background: $('<div class="'+this.classes.background+'"/>'),
			colReorderToggle: $(
				'<div class="'+this.classes.formRow+'">' +
					'<span>ColReorder</span><input type="checkbox" class="'+this.classes.colReorderToggle+'">' +
				'</div>'
			),
			columnsSearchToggle: $(
				'<div class="'+this.classes.formRow+'">' +
					'<span>Column Searches</span><input type="checkbox" class="'+this.classes.columnsSearchToggle+'">' +
				'</div>'
			),
			columnsVisibleToggle: $(
				'<div class="'+this.classes.formRow+'">' +
					'<span>Column Visibility</span>'+
					'<input type="checkbox" class="'+this.classes.columnsVisibleToggle+'">' +
				'</div>'
			),
			createButtonRow: $(
				'<div class="'+this.classes.formRow+'">' +
					'<button class="'+this.classes.creationButton+' ' + this.classes.dtButton + '">Create</button>' +
				'</div>'
			),
			creation: $('<div class="'+this.classes.creation+'"/>'),
			creationForm: $('<div class="'+this.classes.creationForm+'"/>'),
			nameInputRow: $(
				'<div class="'+this.classes.formRow+'">' +
					'<span>Name</span><input class="'+this.classes.nameInput+'">' +
				'</div>'
			),
			orderToggle: $(
				'<div class="'+this.classes.formRow+'">' +
					'<span>Order</span><input type="checkbox" class="'+this.classes.orderToggle+'">' +
				'</div>'
			),
			pagingToggle: $(
				'<div class="'+this.classes.formRow+'">' +
					'<span>Paging</span><input type="checkbox" class="'+this.classes.pagingToggle+'">' +
				'</div>'
			),
			scrollerToggle: $(
				'<div class="'+this.classes.formRow+'">' +
					'<span>Scroller</span><input type="checkbox" class="'+this.classes.scrollerToggle+'">' +
				'</div>'
			),
			searchBuilderToggle: $(
				'<div class="'+this.classes.formRow+'">' +
					'<span>SearchBuilder</span><input type="checkbox" class="'+this.classes.searchBuilderToggle+'">' +
				'</div>'
			),
			searchPanesToggle: $(
				'<div class="'+this.classes.formRow+'">' +
					'<span>SearchPanes</span><input type="checkbox" class="'+this.classes.searchPanesToggle+'">' +
				'</div>'
			),
			searchToggle: $(
				'<div class="'+this.classes.formRow+'">' +
					'<span>Search</span><input type="checkbox" class="'+this.classes.searchToggle+'">' +
				'</div>'
			)
		};

		if (table.settings()[0]._stateRestore !== undefined) {
			return;
		}

		table.settings()[0]._stateRestore = this;
		this._searchForStates();

		return this;
	}

	/**
	 * Adds a new StateRestore instance to the collection based on the current properties of the table
	 *
	 * @param identifier The value that is used to identify a state.
	 * @returns The state that has been created
	 */
	public addState(identifier: string): void {
		// If creation/saving is not allowed then return
		if (!this.c.create || !this.c.save) {
			return;
		}

		// Check if the state exists before creating a new ones
		let state = this.getState(identifier);

		let createFunction = (id) => {
			let newState = new StateRestore(this.s.dt.settings()[0], this.c, id);
			newState.dom.confirmation.on('dtsr-delete', () => this._deleteCallback(id));
			newState.dom.confirmation.on('dtsr-rename', () => this._collectionRebuild());
			this.s.states.push(newState);
			this._collectionRebuild();
		};

		if (state === null) {
			if(this.c.creationModal) {
				this._creationModal('Create State', createFunction);
			}
			else {
				createFunction(identifier);
			}
		}
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
	 * Gets an array of states that match an idenfitier that has been passed in
	 *
	 * @param identifier The value that is used to identify a state
	 * @returns Any states that have been identified
	 */
	public getStates(identifier: string): StateRestore[] {
		if (identifier === undefined) {
			return this.s.states;
		}

		let returnStates = [];

		for (let state of this.s.states) {
			if (state.s.identifier === identifier) {
				returnStates.push(state);
			}
		}

		return returnStates;
	}

	private _creationModal(message, buttonAction): void {
		this.dom.creation.empty();
		this.dom.creationForm.append(this.dom.nameInputRow);
		if (this.c.orderToggle) {
			this.dom.creationForm.append(this.dom.orderToggle);
		}
		if (this.c.searchToggle) {
			this.dom.creationForm.append(this.dom.searchToggle);
		}
		if (this.c.pagingToggle) {
			this.dom.creationForm.append(this.dom.pagingToggle);
		}
		if (this.c.colReorderToggle) {
			this.dom.creationForm.append(this.dom.colReorderToggle);
		}
		if (this.c.scrollerToggle) {
			this.dom.creationForm.append(this.dom.scrollerToggle);
		}
		if (this.c.searchBuilderToggle) {
			this.dom.creationForm.append(this.dom.searchBuilderToggle);
		}
		if (this.c.searchPanesToggle) {
			this.dom.creationForm.append(this.dom.searchPanesToggle);
		}

		if (typeof this.c.columnsToggle === 'boolean' && this.c.columnsToggle) {
			this.dom.creationForm.append(this.dom.columnsSearchToggle);
			this.dom.creationForm.append(this.dom.columnsVisibleToggle);
		}
		else if(typeof this.c.columnsToggle !== 'boolean') {
			if (this.c.columnsToggle.search) {
				this.dom.creationForm.append(this.dom.columnsSearchToggle);
			}
			if (this.c.columnsToggle.visible) {
				this.dom.creationForm.append(this.dom.columnsVisibleToggle);
			}
		}
		this.dom.creationForm.append(this.dom.createButtonRow);
		this.dom.creation
			.append($('<div class="'+this.classes.creationText+'"><span>'+message+'</span></div>'))
			.append(this.dom.creationForm);
		this.dom.background.appendTo('body');
		this.dom.creation.appendTo('body');

		$('button.'+this.classes.creationButton).one('click', () => {
			buttonAction($('input.' + this.classes.nameInput).val());
			this.dom.background.remove();
			this.dom.creation.remove();
		});

		$('div.'+this.classes.background).one('click', (event) => {
			event.stopPropagation();
			this.dom.background.remove();
			this.dom.creation.remove();
		});
	}

	/**
	 * Private method that checks for previously created states on initialisation
	 */
	private _searchForStates(): void {
		let keys = Object.keys(sessionStorage);
		for (let key of keys) {
			// eslint-disable-next-line no-useless-escape
			if (key.match(new RegExp('^DataTables_stateRestore_.*_'+location.pathname.replace(/\//g, '\/')+'$'))) {
				let loadedState = JSON.parse(sessionStorage.getItem(key));
				let newState = new StateRestore(this.s.dt, this.c, loadedState.stateRestore.state);
				newState.save(loadedState);
				this.s.states.push(newState);
				newState.dom.confirmation.on('dtsr-delete', () => this._deleteCallback(loadedState.stateRestore.state));
				newState.dom.confirmation.on('dtsr-rename', () => this._collectionRebuild());
				this._collectionRebuild();
			}
		}
	}

	/**
	 * This callback is called when a state is deleted.
	 * This removes the state from storage and also strips it's button from the container
	 *
	 * @param identifier The value that is used to identify a state
	 */
	private _deleteCallback(identifier: string): void {
		for (let i = 0; i < this.s.states.length; i++) {
			if (this.s.states[i].s.savedState.stateRestore.state === identifier) {
				this.s.states.splice(i, 1);
				i--;
			}
		}

		this._collectionRebuild();
	}

	/**
	 * Rebuilds all of the buttons in the collection of states to make sure that states and text is up to date
	 */
	private _collectionRebuild(): void {
		let stateButtons = [];

		if(this.s.states.length === 0) {
			stateButtons.push(
				'<span class="'+this.classes.emptyStates+'">' +
					this.s.dt.i18n('stateRestore.emptyStates', this.c.i18n.emptyStates) +
				'</span>'
			);
		}
		else {
			for (let state of this.s.states) {
				stateButtons.push({
					_stateRestore: state,
					config: {
						split: [
							this.c.save ? 'saveState' : '',
							this.c.delete ? 'deleteState' : '',
							this.c.save && this.c.rename ? 'renameState' : ''
						],
					},
					extend: 'stateRestore',
					text: state.s.identifier
				});
			}
		}

		this.s.dt.button('SaveStateRestore:name').collectionRebuild(stateButtons);
	}
}
