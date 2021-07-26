let $;
let dataTable;

import { ajax } from 'jquery';
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
	colReorderToggle: string;
	columnsSearchToggle: string;
	columnsVisibleToggle: string;
	creation: string;
	creationButton: string;
	creationForm: string;
	creationText: string;
	creationTitle: string;
	dtButton: string;
	emptyStates: string;
	formRow: string;
	leftSide: string;
	modalFoot: string;
	nameInput: string;
	nameLabel: string;
	nameRow: string;
	orderToggle: string;
	pagingToggle: string;
	rightSide: string;
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
	creationTitle: JQuery<HTMLElement>;
	nameInputRow: JQuery<HTMLElement>;
	orderToggle: JQuery<HTMLElement>;
	pagingToggle: JQuery<HTMLElement>;
	scrollerToggle: JQuery<HTMLElement>;
	searchBuilderToggle: JQuery<HTMLElement>;
	searchPanesToggle: JQuery<HTMLElement>;
	searchToggle: JQuery<HTMLElement>;
}

export interface IDefaults {
	ajax: boolean | string;
	create: boolean;
	creationModal: boolean;
	delete: boolean;
	i18n: II18n;
	rename: boolean;
	save: boolean;
	saveState: ISaveState;
	toggle: ISaveState;
}

export interface ISaveState {
	colReorder: boolean;
	columns: IColumnDefault | boolean;
	order: boolean;
	paging: boolean;
	scroller: boolean;
	search: boolean;
	searchBuilder: boolean;
	searchPanes: boolean;
}

export interface IColumnDefault {
	search: boolean;
	visible: boolean;
}

export interface II18n {
	creationModal?: II18nCreationModal;
	deleteButton: string;
	deleteConfirm: string;
	emptyStates: string;
	renameButton: string;
	renameLabel: string;
}

export interface II18nCreationModal {
	button: string;
	colReorder: string;
	columns: {
		search: string;
		visible: string;
	};
	name: string;
	order: string;
	paging: string;
	scroller: string;
	search: string;
	searchBuilder: string;
	searchPanes: string;
	title: string;
}

export interface IS {
	dt: any;
	hasColReorder: boolean;
	hasScroller: boolean;
	hasSearchBuilder: boolean;
	hasSearchPanes: boolean;
	states: StateRestore[];
}

export default class StateRestoreCollection {
	private static version = '0.0.1';

	private static classes: IClasses = {
		background: 'dtsr-background',
		checkBox: 'dtsr-check-box',
		checkLabel: 'dtsr-check-label',
		checkRow: 'dtsr-check-row',
		colReorderToggle: 'dtsr-colReorder-toggle',
		columnsSearchToggle: 'dtsr-columns-search-toggle',
		columnsVisibleToggle: 'dtsr-columns-visible-toggle',
		creation: 'dtsr-creation',
		creationButton: 'dtsr-creation-button',
		creationForm: 'dtsr-creation-form',
		creationText: 'dtsr-creation-text',
		creationTitle: 'dtsr-creation-title',
		dtButton: 'dt-button',
		emptyStates: 'dtsr-emptyStates',
		formRow: 'dtsr-form-row',
		leftSide: 'dtsr-left',
		modalFoot: 'dtsr-modal-foot',
		nameInput: 'dtsr-name-input',
		nameLabel: 'dtsr-name-label',
		nameRow: 'dtsr-name-row',
		orderToggle: 'dtsr-order-toggle',
		pagingToggle: 'dtsr-paging-toggle',
		rightSide: 'dtsr-right',
		scrollerToggle: 'dtsr-scroller-toggle',
		searchBuilderToggle: 'dtsr-searchBuilder-toggle',
		searchPanesToggle: 'dtsr-searchPanes-toggle',
		searchToggle: 'dtsr-search-toggle'
	};

	private static defaults: IDefaults = {
		ajax: false,
		create: true,
		creationModal: false,
		delete: true,
		i18n: {
			creationModal: {
				button: 'Create',
				colReorder: 'Column Order',
				columns: {
					search: 'Column Search',
					visible: 'Column Visibility'
				},
				name: 'Name',
				order: 'Sorting',
				paging: 'Paging',
				scroller: 'Scroll Position',
				search: 'Search',
				searchBuilder: 'SearchBuilder',
				searchPanes: 'SearchPanes',
				title: 'Create New State',
			},
			deleteButton: 'Delete',
			deleteConfirm: 'Are you sure you want to delete this state?',
			emptyStates: 'No saved states',
			renameButton: 'Rename',
			renameLabel: 'New Name:',
		},
		rename: true,
		save: true,
		saveState: {
			colReorder: true,
			columns: {
				search: true,
				visible: true
			},
			order: true,
			paging: true,
			scroller: true,
			search: true,
			searchBuilder: true,
			searchPanes: true,
		},
		toggle: {
			colReorder: false,
			columns:{
				search: false,
				visible: false
			},
			order: false,
			paging: false,
			scroller: false,
			search: false,
			searchBuilder: false,
			searchPanes: false,
		}
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
			hasColReorder: (dataTable as any).ColReorder !== undefined,
			hasScroller: (dataTable as any).Scroller !== undefined,
			hasSearchBuilder: (dataTable as any).SearchBuilder !== undefined,
			hasSearchPanes: (dataTable as any).SearchPanes !== undefined,
			states: []
		};

		this.s.dt.on('xhr', (e, xhrsettings, json, xhr) => {
			if(json && json.stateRestore) {
				let states = Object.keys(json.stateRestore);
				for (let state of states) {
					let loadedState = json.stateRestore[state];
					let newState = new StateRestore(
						this.s.dt,
						$.extend(true, {}, this.c),
						state
					);
					newState.s.savedState = loadedState;
					this.s.states.push(newState);
					newState.dom.confirmation.on(
						'dtsr-delete',
						() => this._deleteCallback(loadedState.stateRestore.state)
					);
					newState.dom.confirmation.on(
						'dtsr-rename',
						() => {
							this._collectionRebuild();
						}
					);
					newState.dom.confirmation.on(
						'dtsr-save',
						() => {
							this._collectionRebuild();
						}
					);
					this._collectionRebuild();
				}
			}
		});

		this.dom = {
			background: $('<div class="'+this.classes.background+'"/>'),
			colReorderToggle: $(
				'<div class="'+this.classes.formRow+' '+this.classes.checkRow+'">' +
					'<input type="checkbox" class="'+
						this.classes.colReorderToggle+' ' +
						this.classes.checkBox +
					'" checked>' +
					'<span class="'+this.classes.checkLabel+'">'+
						this.s.dt.i18n(
							'stateRestore.creationModal.colReorder',
							this.c.i18n.creationModal.colReorder
						)+
					'</span>'+
				'</div>'
			),
			columnsSearchToggle: $(
				'<div class="'+this.classes.formRow+' '+this.classes.checkRow+'">' +
					'<input type="checkbox" class="'+
						this.classes.columnsSearchToggle+' ' +
						this.classes.checkBox +
					'" checked>' +
					'<span class="'+this.classes.checkLabel+'">'+
						this.s.dt.i18n(
							'stateRestore.creationModal.columns.search',
							this.c.i18n.creationModal.columns.search
						)+
					'</span>'+
				'</div>'
			),
			columnsVisibleToggle: $(
				'<div class="'+this.classes.formRow+' '+this.classes.checkRow+' '+'">' +
					'<input type="checkbox" class="'+
						this.classes.columnsVisibleToggle+' ' +
						this.classes.checkBox +
					'" checked>' +
					'<span class="'+this.classes.checkLabel+'">'+
						this.s.dt.i18n(
							'stateRestore.creationModal.columns.visible',
							this.c.i18n.creationModal.columns.visible
						)+
					'</span>'+
				'</div>'
			),
			createButtonRow: $(
				'<div class="'+this.classes.formRow+' '+this.classes.checkRow+' '+this.classes.modalFoot+'">' +
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
			nameInputRow: $(
				'<div class="'+this.classes.formRow+'">' +
					'<div class="' + this.classes.nameRow+'">'+
						'<span class="'+this.classes.nameLabel+'">'+
							this.s.dt.i18n(
								'stateRestore.creationModal.name',
								this.c.i18n.creationModal.name
							)+
						'</span>'+
					'</div>'+
					'<div class="' + this.classes.nameRow+'">'+
						'<input class="'+this.classes.nameInput+'">' +
					'</div>'+
				'</div>'
			),
			orderToggle: $(
				'<div class="'+this.classes.formRow+' '+this.classes.checkRow+'">' +
					'<input type="checkbox" class="'+
						this.classes.orderToggle+' ' +
						this.classes.checkBox +
					'" checked>' +
					'<span class="'+this.classes.checkLabel+'">'+
						this.s.dt.i18n(
							'stateRestore.creationModal.order',
							this.c.i18n.creationModal.order
						)+
					'</span>'+
				'</div>'
			),
			pagingToggle: $(
				'<div class="'+this.classes.formRow+' '+this.classes.checkRow+'">' +
					'<input type="checkbox" class="'+
						this.classes.pagingToggle+' ' +
						this.classes.checkBox +
					'" checked>' +
					'<span class="'+this.classes.checkLabel+'">'+
						this.s.dt.i18n(
							'stateRestore.creationModal.paging',
							this.c.i18n.creationModal.paging
						)+
					'</span>'+
				'</div>'
			),
			scrollerToggle: $(
				'<div class="'+this.classes.formRow+' '+this.classes.checkRow+'">' +
					'<input type="checkbox" class="'+
						this.classes.scrollerToggle+' ' +
						this.classes.checkBox +
					'" checked>' +
					'<span class="'+this.classes.checkLabel+'">'+
						this.s.dt.i18n(
							'stateRestore.creationModal.scroller',
							this.c.i18n.creationModal.scroller
						)+
					'</span>'+
				'</div>'
			),
			searchBuilderToggle: $(
				'<div class="'+this.classes.formRow+' '+this.classes.checkRow+'">' +
					'<input type="checkbox" class="'+
						this.classes.searchBuilderToggle+' ' +
						this.classes.checkBox +
					'" checked>' +
					'<span class="'+this.classes.checkLabel+'">'+
						this.s.dt.i18n(
							'stateRestore.creationModal.searchBuilder',
							this.c.i18n.creationModal.searchBuilder
						)+
					'</span>'+
				'</div>'
			),
			searchPanesToggle: $(
				'<div class="'+this.classes.formRow+' '+this.classes.checkRow+'">' +
					'<input type="checkbox" class="'+
						this.classes.searchPanesToggle+' ' +
						this.classes.checkBox +
					'" checked>' +
					'<span class="'+this.classes.checkLabel+'">'+
						this.s.dt.i18n(
							'stateRestore.creationModal.searchPanes',
							this.c.i18n.creationModal.searchPanes
						)+
					'</span>'+
				'</div>'
			),
			searchToggle: $(
				'<div class="'+this.classes.formRow+' '+this.classes.checkRow+'">' +
					'<input type="checkbox" class="'+
						this.classes.searchToggle+' ' +
						this.classes.checkBox +
					'" checked>' +
					'<span class="'+this.classes.checkLabel+'">'+
						this.s.dt.i18n(
							'stateRestore.creationModal.search',
							this.c.i18n.creationModal.search
						)+
					'</span>'+
				'</div>'
			)
		};

		if (table.settings()[0]._stateRestore !== undefined) {
			return;
		}

		table.settings()[0]._stateRestore = this;
		this._searchForStates();
		this._collectionRebuild();

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
		let createFunction;

		if (typeof this.c.ajax === 'string') {
			createFunction = (id, toggles) => {
				let newState = new StateRestore(this.s.dt.settings()[0], $.extend(true, {}, this.c, toggles), id);
				newState.dom.confirmation.on('dtsr-delete', () => this._deleteCallback(id));
				newState.dom.confirmation.on('dtsr-rename', () => this._collectionRebuild());
				this.s.states.push(newState);
				this._collectionRebuild();
			};
		}
		else {
			createFunction = (id, toggles) => {
				let newState = new StateRestore(this.s.dt.settings()[0], $.extend(true, {}, this.c, toggles), id);
				newState.dom.confirmation.on('dtsr-delete', () => this._deleteCallback(id));
				newState.dom.confirmation.on('dtsr-rename', () => this._collectionRebuild());
				this.s.states.push(newState);
				this._collectionRebuild();
			};
		}

		if (state === null) {
			if(this.c.creationModal) {
				this._creationModal(createFunction, identifier);
			}
			else {
				createFunction(identifier, {});
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

	private _creationModal(buttonAction, identifier): void {
		this.dom.creation.empty();
		this.dom.nameInputRow.children('div.dtsr-name-row').children('input').val(identifier);
		this.dom.creationForm.append(this.dom.nameInputRow);

		// Order toggle - check toggle and saving enabled
		if (this.c.toggle.order && this.c.saveState.order) {
			this.dom.creationForm.append(this.dom.orderToggle);
		}

		// Search toggle - check toggle and saving enabled
		if (this.c.toggle.search && this.c.saveState.search) {
			this.dom.creationForm.append(this.dom.searchToggle);
		}

		// Paging toggle - check toggle and saving enabled
		if (this.c.toggle.paging && this.c.saveState.paging) {
			this.dom.creationForm.append(this.dom.pagingToggle);
		}

		// ColReorder toggle - check toggle and saving enabled
		if (this.s.hasColReorder && this.c.toggle.colReorder && this.c.saveState.colReorder) {
			this.dom.creationForm.append(this.dom.colReorderToggle);
		}

		// Scroller toggle - check toggle and saving enabled
		if (this.s.hasScroller &&this.c.toggle.scroller && this.c.saveState.scroller) {
			this.dom.creationForm.append(this.dom.scrollerToggle);
		}

		// SearchBuilder toggle - check toggle and saving enabled
		if (this.s.hasSearchBuilder &&this.c.toggle.searchBuilder && this.c.saveState.searchBuilder) {
			this.dom.creationForm.append(this.dom.searchBuilderToggle);
		}

		// SearchPanes toggle - check toggle and saving enabled
		if (this.s.hasSearchPanes &&this.c.toggle.searchPanes && this.c.saveState.searchPanes) {
			this.dom.creationForm.append(this.dom.searchPanesToggle);
		}

		// Columns toggle - check toggle and saving enabled
		if (typeof this.c.toggle.columns === 'boolean' && this.c.toggle.columns && this.c.saveState.columns) {
			this.dom.creationForm.append(this.dom.columnsSearchToggle);
			this.dom.creationForm.append(this.dom.columnsVisibleToggle);
		}
		else if (typeof this.c.toggle.columns !== 'boolean') {
			if (typeof this.c.saveState.columns !== 'boolean' && this.c.saveState.columns) {
				// Column search toggle - check toggle and saving enabled
				if (this.c.toggle.columns.search && this.c.saveState.columns.search) {
					this.dom.creationForm.append(this.dom.columnsSearchToggle);
				}

				// Column visiblity toggle - check toggle and saving enabled
				if (this.c.toggle.columns.visible && this.c.saveState.columns.visible) {
					this.dom.creationForm.append(this.dom.columnsVisibleToggle);
				}
			}
			else if (this.c.saveState.columns) {
				this.dom.creationForm.append(this.dom.columnsSearchToggle);
				this.dom.creationForm.append(this.dom.columnsVisibleToggle);
			}
		}
		this.dom.creation
			.append(this.dom.creationTitle)
			.append(this.dom.creationForm)
			.append(this.dom.createButtonRow);
		this.dom.background.appendTo('body');
		this.dom.creation.appendTo('body');

		$('button.'+this.classes.creationButton.replace(/ /g, '.')).one('click', () => {
			let toggles = {
				colReorder: this.dom.colReorderToggle.children('div.dtsr-right').children('input').is(':checked'),
				columns: {
					search: this.dom.columnsSearchToggle.children('div.dtsr-right').children('input').is(':checked'),
					visible: this.dom.columnsVisibleToggle.children('div.dtsr-right').children('input').is(':checked')
				},
				order: this.dom.orderToggle.children('div.dtsr-right').children('input').is(':checked'),
				paging: this.dom.pagingToggle.children('div.dtsr-right').children('input').is(':checked'),
				scroller: this.dom.scrollerToggle.children('div.dtsr-right').children('input').is(':checked'),
				search: this.dom.searchToggle.children('div.dtsr-right').children('input').is(':checked'),
				searchBuilder: this.dom.searchBuilderToggle.children('div.dtsr-right').children('input').is(':checked'),
				searchPanes: this.dom.searchPanesToggle.children('div.dtsr-right').children('input').is(':checked'),
			};
			buttonAction($('input.' + this.classes.nameInput.replace(/ /g, '.')).val(), toggles);
			this.dom.background.remove();
			this.dom.creation.remove();
		});

		$('div.'+this.classes.background.replace(/ /g, '.')).one('click', (event) => {
			event.stopPropagation();
			this.dom.background.remove();
			this.dom.creation.remove();
			this._collectionRebuild();
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
		let ajaxData = {
			stateRestore: {}
		};

		if(this.s.states.length === 0) {
			stateButtons.push(
				'<span class="'+this.classes.emptyStates+'">' +
					this.s.dt.i18n('stateRestore.emptyStates', this.c.i18n.emptyStates) +
				'</span>'
			);
		}
		else {
			for (let state of this.s.states) {
				let split = [];
				if(this.c.save && state.c.save) {
					split.push('saveState');
				}
				if(this.c.delete && state.c.delete) {
					split.push('deleteState');
				}
				if(this.c.save && state.c.save && this.c.rename && state.c.rename) {
					split.push('renameState');
				}
				stateButtons.push({
					_stateRestore: state,
					config: {
						split
					},
					extend: 'stateRestore',
					text: state.s.identifier
				});

				if (typeof this.c.ajax === 'string') {
					ajaxData.stateRestore[state.s.identifier] = state.s.savedState;
				}
			}
		}


		if (typeof this.c.ajax === 'string') {
			$.ajax({
				data: ajaxData,
				type: 'POST',
				url: this.c.ajax
			});
		}


		this.s.dt.button('SaveStateRestore:name').collectionRebuild(stateButtons);
	}
}
