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
	toggleLabel: string;
}

export interface IDom {
	background: JQuery<HTMLElement>;
	colReorderToggle: JQuery<HTMLElement>;
	columnsSearchToggle: JQuery<HTMLElement>;
	columnsVisibleToggle: JQuery<HTMLElement>;
	confirmation: JQuery<HTMLElement>;
	confirmationTitleRow: JQuery<HTMLElement>;
	createButtonRow: JQuery<HTMLElement>;
	creation: JQuery<HTMLElement>;
	creationForm: JQuery<HTMLElement>;
	creationTitle: JQuery<HTMLElement>;
	deleteContents: JQuery<HTMLElement>;
	deleteTitle: JQuery<HTMLElement>;
	nameInputRow: JQuery<HTMLElement>;
	orderToggle: JQuery<HTMLElement>;
	pagingToggle: JQuery<HTMLElement>;
	scrollerToggle: JQuery<HTMLElement>;
	searchBuilderToggle: JQuery<HTMLElement>;
	searchPanesToggle: JQuery<HTMLElement>;
	searchToggle: JQuery<HTMLElement>;
	toggleLabel: JQuery<HTMLElement>;
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
	// eslint-disable-next-line @typescript-eslint/naming-convention
	ColReorder: boolean;
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
	deleteTitle: string;
	emptyStates: string;
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
	name: string;
	order: string;
	paging: string;
	scroller: string;
	search: string;
	searchBuilder: string;
	searchPanes: string;
	title: string;
	toggleLabel: string;
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
		toggleLabel: 'dtsr-toggle-title'
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
				name: 'Name:',
				order: 'Sorting',
				paging: 'Paging',
				scroller: 'Scroll Position',
				search: 'Search',
				searchBuilder: 'SearchBuilder',
				searchPanes: 'SearchPanes',
				title: 'Create New State',
				toggleLabel: 'Includes:'
			},
			deleteButton: 'Delete',
			deleteConfirm: 'Are you sure you want to delete %s?',
			deleteTitle: 'Delete State',
			emptyStates: 'No saved states',
			renameButton: 'Rename',
			renameLabel: 'New Name for %s:',
			renameTitle: 'Rename State'
		},
		rename: true,
		save: true,
		saveState: {
			// eslint-disable-next-line @typescript-eslint/naming-convention
			ColReorder: true,
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
			// eslint-disable-next-line @typescript-eslint/naming-convention
			ColReorder: false,
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
			states: []
		};

		this.s.dt.on('xhr', (e, xhrsettings, json) => {
			// Has staterestore been used before? Is there anything to load?
			if (json && json.stateRestore) {
				let states = Object.keys(json.stateRestore);

				for (let state of states) {
					for(let i = 0; i < this.s.states.length; i++) {
						if(this.s.states[i].s.identifier === state) {
							this.s.states.splice(i, 1);
						}
					}

					let loadedState = json.stateRestore[state];
					let newState = new StateRestore(
						this.s.dt,
						$.extend(true, {}, this.c, loadedState.c),
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
					'<label class="'+this.classes.checkLabel+'">'+
						this.s.dt.i18n(
							'stateRestore.creationModal.colReorder',
							this.c.i18n.creationModal.colReorder
						)+
					'</label>'+
				'</div>'
			),
			columnsSearchToggle: $(
				'<div class="'+this.classes.formRow+' '+this.classes.checkRow+'">' +
					'<input type="checkbox" class="'+
						this.classes.columnsSearchToggle+' ' +
						this.classes.checkBox +
					'" checked>' +
					'<label class="'+this.classes.checkLabel+'">'+
						this.s.dt.i18n(
							'stateRestore.creationModal.columns.search',
							this.c.i18n.creationModal.columns.search
						)+
					'</label>'+
				'</div>'
			),
			columnsVisibleToggle: $(
				'<div class="'+this.classes.formRow+' '+this.classes.checkRow+' '+'">' +
					'<input type="checkbox" class="'+
						this.classes.columnsVisibleToggle+' ' +
						this.classes.checkBox +
					'" checked>' +
					'<label class="'+this.classes.checkLabel+'">'+
						this.s.dt.i18n(
							'stateRestore.creationModal.columns.visible',
							this.c.i18n.creationModal.columns.visible
						)+
					'</label>'+
				'</div>'
			),
			confirmation: $('<div class="'+this.classes.confirmation+'"/>'),
			confirmationTitleRow: $('<div class="'+this.classes.confirmationTitleRow+'"></div>'),
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
			deleteContents: $(
				'<div class="'+this.classes.confirmationText+'"><span></span></div>'
			),
			deleteTitle: $(
				'<div class="'+this.classes.creationText+'">'+
					'<h2 class="'+this.classes.creationTitle+'">'+
						this.s.dt.i18n(
							'stateRestore.deleteTitle',
							this.c.i18n.deleteTitle
						)+
					'</h2>'+
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
					'<input class="'+this.classes.nameInput+'" type="text">' +
				'</div>'
			),
			orderToggle: $(
				'<div class="'+this.classes.formRow+' '+this.classes.checkRow+'">' +
					'<input type="checkbox" class="'+
						this.classes.orderToggle+' ' +
						this.classes.checkBox +
					'" checked>' +
					'<label class="'+this.classes.checkLabel+'">'+
						this.s.dt.i18n(
							'stateRestore.creationModal.order',
							this.c.i18n.creationModal.order
						)+
					'</label>'+
				'</div>'
			),
			pagingToggle: $(
				'<div class="'+this.classes.formRow+' '+this.classes.checkRow+'">' +
					'<input type="checkbox" class="'+
						this.classes.pagingToggle+' ' +
						this.classes.checkBox +
					'" checked>' +
					'<label class="'+this.classes.checkLabel+'">'+
						this.s.dt.i18n(
							'stateRestore.creationModal.paging',
							this.c.i18n.creationModal.paging
						)+
					'</label>'+
				'</div>'
			),
			scrollerToggle: $(
				'<div class="'+this.classes.formRow+' '+this.classes.checkRow+'">' +
					'<input type="checkbox" class="'+
						this.classes.scrollerToggle+' ' +
						this.classes.checkBox +
					'" checked>' +
					'<label class="'+this.classes.checkLabel+'">'+
						this.s.dt.i18n(
							'stateRestore.creationModal.scroller',
							this.c.i18n.creationModal.scroller
						)+
					'</label>'+
				'</div>'
			),
			searchBuilderToggle: $(
				'<div class="'+this.classes.formRow+' '+this.classes.checkRow+'">' +
					'<input type="checkbox" class="'+
						this.classes.searchBuilderToggle+' ' +
						this.classes.checkBox +
					'" checked>' +
					'<label class="'+this.classes.checkLabel+'">'+
						this.s.dt.i18n(
							'stateRestore.creationModal.searchBuilder',
							this.c.i18n.creationModal.searchBuilder
						)+
					'</label>'+
				'</div>'
			),
			searchPanesToggle: $(
				'<div class="'+this.classes.formRow+' '+this.classes.checkRow+'">' +
					'<input type="checkbox" class="'+
						this.classes.searchPanesToggle+' ' +
						this.classes.checkBox +
					'" checked>' +
					'<label class="'+this.classes.checkLabel+'">'+
						this.s.dt.i18n(
							'stateRestore.creationModal.searchPanes',
							this.c.i18n.creationModal.searchPanes
						)+
					'</label>'+
				'</div>'
			),
			searchToggle: $(
				'<div class="'+this.classes.formRow+' '+this.classes.checkRow+'">' +
					'<input type="checkbox" class="'+
						this.classes.searchToggle+' ' +
						this.classes.checkBox +
					'" checked>' +
					'<label class="'+this.classes.checkLabel+'">'+
						this.s.dt.i18n(
							'stateRestore.creationModal.search',
							this.c.i18n.creationModal.search
						)+
					'</label>'+
				'</div>'
			),
			toggleLabel: $(
				'<label class="'+this.classes.nameLabel+' '+ this.classes.toggleLabel +'">'+
					this.s.dt.i18n(
						'stateRestore.creationModal.toggleLabel',
						this.c.i18n.creationModal.toggleLabel
					)+
				'</label>'
			)
		};

		table.settings()[0]._stateRestore = this;
		this._searchForStates();
		this._collectionRebuild();

		this.s.dt.on('destroy.dtsr', () => {
			this.destroy();
		});

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
		let createFunction = (id, toggles) => {
			let newState = new StateRestore(this.s.dt.settings()[0], $.extend(true, {}, this.c, toggles), id);
			newState.dom.confirmation.on('dtsr-delete', () => this._deleteCallback(id));
			newState.dom.confirmation.on('dtsr-rename', () => this._collectionRebuild());
			this.s.states.push(newState);
			this._collectionRebuild();
		};

		// If there isn't already a state with this identifier
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
	 * Deletes all of the states, showing a modal to the user for confirmation
	 *
	 * @param deleteFunction The action to be taken when the action is confirmed
	 */
	public deleteAll(deleteFunction): void {
		let ids = this.s.states.map(state => state.s.identifier);

		$(this.dom.deleteContents.children('span')).text(
			this.s.dt
				.i18n('stateRestore.deleteConfirm', this.c.i18n.deleteConfirm)
				.replace(/%s/g, ids.slice(0, -1).join(', ') + ' and ' + ids.slice(-1))
		);
		this._newModal(
			this.dom.deleteTitle,
			this.s.dt.i18n('stateRestore.deleteConfirm', this.c.i18n.deleteButton),
			deleteFunction,
			this.dom.deleteContents
		);
	}

	/**
	 * Removes all of the dom elements from the document for the collection and the stored states
	 */
	public destroy(): void {
		for(let state of this.s.states) {
			state.destroy();
		}

		Object.values(this.dom).forEach((node)=> {
			node.off();
			node.remove();
		});

		this.s.states = [];

		this.s.dt.off('.dtsr');
		$(this.s.dt.table().node()).off('.dtsr');
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
	public getStates(): StateRestore[] {
		return this.s.states;
	}

	/**
	 * Rebuilds all of the buttons in the collection of states to make sure that states and text is up to date
	 */
	private _collectionRebuild(): void {
		let stateButtons = [];
		let ajaxData = {
			stateRestore: {}
		};

		// If there are no states display an empty message
		if(this.s.states.length === 0) {
			stateButtons.push(
				'<span class="'+this.classes.emptyStates+'">' +
					this.s.dt.i18n('stateRestore.emptyStates', this.c.i18n.emptyStates) +
				'</span>'
			);
		}
		else {
			// Sort the states so that they appear alphabetically
			this.s.states = this.s.states.sort((a, b)=> {
				if (a.s.identifier < b.s.identifier) {
					return -1;
				}
				else if (a.s.identifier > b.s.identifier) {
					return 1;
				}
				else {
					return 0;
				}
			});

			// Construct the split property of each button
			for (let state of this.s.states) {
				let split = [];

				if (this.c.save && state.c.save) {
					split.push('updateState');
				}
				if (this.c.delete && state.c.delete) {
					split.push('deleteState');
				}
				if (this.c.save && state.c.save && this.c.rename && state.c.rename) {
					split.push('renameState');
				}
				if (split.length > 0) {
					split.unshift('<h3>'+state.s.identifier+'</h3>');
				}

				stateButtons.push({
					_stateRestore: state,
					config: {
						split
					},
					extend: 'stateRestore',
					text: state.s.identifier
				});

				// If operation over ajax add this state to the object
				if (typeof this.c.ajax === 'string') {
					ajaxData.stateRestore[state.s.identifier] = state.s.savedState;
				}
			}
		}

		// Ajax property has to be a string, not just true
		// Also only want to save if the table has been initialised and the states have been loaded in
		if (typeof this.c.ajax === 'string' && this.s.dt.settings()[0]._bInitComplete) {
			$.ajax({
				data: ajaxData,
				type: 'POST',
				url: this.c.ajax
			});
		}


		this.s.dt.button('SaveStateRestore:name').collectionRebuild(stateButtons);
	}

	/**
	 * Displays a modal that is used to get information from the user to create a new state.
	 *
	 * @param buttonAction The action that should be taken when the button is pressed
	 * @param identifier The default identifier for the next new state
	 */
	private _creationModal(buttonAction, identifier): void {
		this.dom.creation.empty();
		this.dom.creationForm.empty();
		this.dom.nameInputRow.children('input').val(identifier);
		this.dom.creationForm.append(this.dom.nameInputRow);
		let tableConfig = this.s.dt.settings()[0].oInit;
		let togglesToInsert = [];

		// Order toggle - check toggle and saving enabled
		if (
			this.c.toggle.order &&
			this.c.saveState.order &&
			(tableConfig.ordering === undefined || tableConfig.ordering)
		) {
			togglesToInsert.push(this.dom.orderToggle);
		}

		// Search toggle - check toggle and saving enabled
		if (
			this.c.toggle.search &&
			this.c.saveState.search &&
			(tableConfig.searching === undefined || tableConfig.searching)
		) {
			togglesToInsert.push(this.dom.searchToggle);
		}

		// Paging toggle - check toggle and saving enabled
		if (
			this.c.toggle.paging &&
			this.c.saveState.paging &&
			(tableConfig.paging === undefined || tableConfig.paging)
		) {
			togglesToInsert.push(this.dom.pagingToggle);
		}

		// ColReorder toggle - check toggle and saving enabled
		if (this.s.hasColReorder && this.c.toggle.ColReorder && this.c.saveState.ColReorder) {
			togglesToInsert.push(this.dom.colReorderToggle);
		}

		// Scroller toggle - check toggle and saving enabled
		if (this.s.hasScroller && this.c.toggle.scroller && this.c.saveState.scroller) {
			togglesToInsert.push(this.dom.scrollerToggle);
		}

		// SearchBuilder toggle - check toggle and saving enabled
		if (this.s.hasSearchBuilder &&this.c.toggle.searchBuilder && this.c.saveState.searchBuilder) {
			togglesToInsert.push(this.dom.searchBuilderToggle);
		}

		// SearchPanes toggle - check toggle and saving enabled
		if (this.s.hasSearchPanes &&this.c.toggle.searchPanes && this.c.saveState.searchPanes) {
			togglesToInsert.push(this.dom.searchPanesToggle);
		}

		// Columns toggle - check toggle and saving enabled
		if (typeof this.c.toggle.columns === 'boolean' && this.c.toggle.columns && this.c.saveState.columns) {
			togglesToInsert.push(this.dom.columnsSearchToggle);
			togglesToInsert.push(this.dom.columnsVisibleToggle);
		}
		else if (typeof this.c.toggle.columns !== 'boolean') {
			if (typeof this.c.saveState.columns !== 'boolean' && this.c.saveState.columns) {
				// Column search toggle - check toggle and saving enabled
				if (this.c.toggle.columns.search && this.c.saveState.columns.search) {
					togglesToInsert.push(this.dom.columnsSearchToggle);
				}

				// Column visiblity toggle - check toggle and saving enabled
				if (this.c.toggle.columns.visible && this.c.saveState.columns.visible) {
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
			let aVal = a.children('label.dtsr-check-label')[0].innerHTML;
			let bVal = b.children('label.dtsr-check-label')[0].innerHTML;

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
		for(let toggle of togglesToInsert) {
			this.dom.creationForm.append(toggle);
		}

		// Insert the toggle label next to the first check box
		$(this.dom.creationForm.children('div.dtsr-check-row')[0]).prepend(this.dom.toggleLabel);

		// Insert the creation modal and the background
		this.dom.background.appendTo('body');
		this.dom.creation
			.append(this.dom.creationTitle)
			.append(this.dom.creationForm)
			.append(this.dom.createButtonRow)
			.appendTo('body');

		let creationButton = $('button.'+this.classes.creationButton.replace(/ /g, '.'));
		let background = $('div.'+this.classes.background.replace(/ /g, '.'));
		let keyupFunction = function(e) {
			if (e.key === 'Enter') {
				creationButton.click();
			}
			else if (e.key === 'Escape') {
				background.click();
			}
		};

		creationButton.one('click', () => {
			// Get the values of the checkBoxes
			let saveState = {
				colReorder: this.dom.colReorderToggle.children('input').is(':checked'),
				columns: {
					search: this.dom.columnsSearchToggle.children('input').is(':checked'),
					visible: this.dom.columnsVisibleToggle.children('input').is(':checked')
				},
				order: this.dom.orderToggle.children('input').is(':checked'),
				paging: this.dom.pagingToggle.children('input').is(':checked'),
				scroller: this.dom.scrollerToggle.children('input').is(':checked'),
				search: this.dom.searchToggle.children('input').is(':checked'),
				searchBuilder: this.dom.searchBuilderToggle.children('input').is(':checked'),
				searchPanes: this.dom.searchPanesToggle.children('input').is(':checked'),
			};

			// Call the buttons functionality passing in the identifier and what should be saved
			buttonAction($('input.' + this.classes.nameInput.replace(/ /g, '.')).val(), {saveState});

			// Remove the dom elements as operation has completed
			this.dom.background.remove();
			this.dom.creation.remove();

			// Unbind the keyup function  - don't want it to run unnecessarily on every keypress that occurs
			$(document).unbind('keyup', keyupFunction);
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
		buttonAction: (skipModal: boolean) => void,
		modalContents: JQuery<HTMLElement>
	): void {
		this.dom.background.appendTo('body');
		this.dom.confirmationTitleRow.empty().append(title);
		this.dom.confirmation
			.empty()
			.append(this.dom.confirmationTitleRow)
			.append(modalContents)
			.append(
				$('<div class="'+this.classes.confirmationButtons+'">' +
						'<button class="'+this.classes.confirmationButton+' '+this.classes.dtButton+'">'+
							buttonText+
						'</button>' +
					'</div>'
				)
			)
			.appendTo('body');

		let confirmationButton = $('button.'+this.classes.confirmationButton.replace(/ /g, '.'));
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
		confirmationButton.one('click', () => {
			buttonAction(true);
			this.dom.background.remove();
			this.dom.confirmation.remove();
			$(document).unbind('keyup', keyupFunction);
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
}
