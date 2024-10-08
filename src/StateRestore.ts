let $;
let dataTable;

import * as restoreType from './StateRestoreCollection';

export function setJQuery(jq) {
	$ = jq;
	dataTable = jq.fn.dataTable;
}

export interface IClasses {
	background: string;
	closeButton: string;
	confirmation: string;
	confirmationButton: string;
	confirmationButtons: string;
	confirmationMessage: string;
	confirmationText: string;
	confirmationTitle: string;
	confirmationTitleRow: string;
	dtButton: string;
	input: string;
	modalError: string;
	renameModal: string;
}

export interface IS {
	dt: any;
	identifier: string;
	isPreDefined: boolean;
	savedState: null | IState;
	tableId: string;
}

export interface IDom {
	background: JQuery<HTMLElement>;
	closeButton: JQuery<HTMLElement>;
	confirmation: JQuery<HTMLElement>;
	confirmationButton: JQuery<HTMLElement>;
	confirmationTitleRow: JQuery<HTMLElement>;
	dtContainer: JQuery<HTMLElement>;
	duplicateError: JQuery<HTMLElement>;
	emptyError: JQuery<HTMLElement>;
	removeContents: JQuery<HTMLElement>;
	removeError: JQuery<HTMLElement>;
	removeTitle: JQuery<HTMLElement>;
	renameContents: JQuery<HTMLElement>;
	renameInput: JQuery<HTMLElement>;
	renameTitle: JQuery<HTMLElement>;
}

export interface IState {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	ColReorder: any;
	c: restoreType.IDefaults;
	columns: IColumn[];
	length: number;
	order: Array<Array<string|number>>;
	page: number;
	paging: any;
	scroller: any;
	search: ISearch;
	searchBuilder: any;
	searchPanes: any;
	select: any;
	start: number;
	stateRestore: IStateRestore;
	time: number;
}

export interface IColumn {
	search: ISearch;
	visible: boolean;
}

export interface ISearch {
	caseInsensitive: boolean;
	regex: boolean;
	search: string;
	smart: boolean;
}

export interface IHungSearch {
	bCaseInsensitive: boolean;
	bRegex: boolean;
	bSmart: boolean;
	sSearch: string;
}

export interface IStateRestore {
	isPreDefined: boolean;
	state: string;
	tableId?: string;
}
export default class StateRestore {
	private static version = '1.4.1';

	private static classes: IClasses = {
		background: 'dtsr-background',
		closeButton: 'dtsr-popover-close',
		confirmation: 'dtsr-confirmation',
		confirmationButton: 'dtsr-confirmation-button',
		confirmationButtons: 'dtsr-confirmation-buttons',
		confirmationMessage: 'dtsr-confirmation-message dtsr-name-label',
		confirmationText: 'dtsr-confirmation-text',
		confirmationTitle: 'dtsr-confirmation-title',
		confirmationTitleRow: 'dtsr-confirmation-title-row',
		dtButton: 'dt-button',
		input: 'dtsr-input',
		modalError: 'dtsr-modal-error',
		renameModal: 'dtsr-rename-modal'
	};

	private static defaults: restoreType.IDefaults = {
		_createInSaved: false,
		ajax: false,
		create: true,
		creationModal: false,
		i18n: {
			creationModal: {
				button: 'Create',
				colReorder: 'Column Order:',
				columns: {
					search: 'Column Search:',
					visible: 'Column Visibility:'
				},
				length: 'Page Length:',
				name: 'Name:',
				order: 'Sorting:',
				paging: 'Paging:',
				scroller: 'Scroll Position:',
				search: 'Search:',
				searchBuilder: 'SearchBuilder:',
				searchPanes: 'SearchPanes:',
				select: 'Select:',
				title: 'Create New State',
				toggleLabel: 'Includes:'
			},
			duplicateError: 'A state with this name already exists.',
			emptyError: 'Name cannot be empty.',
			emptyStates: 'No saved states',
			removeConfirm: 'Are you sure you want to remove "%s"?',
			removeError: 'Failed to remove state.',
			removeJoiner: ' and ',
			removeSubmit: 'Remove',
			removeTitle: 'Remove State',
			renameButton: 'Rename',
			renameLabel: 'New Name for "%s":',
			renameTitle: 'Rename State',
		},
		modalCloseButton: true,
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
	public dom: IDom;
	public c: restoreType.IDefaults;
	public s: IS;

	public constructor(
		settings: any,
		opts: restoreType.IDefaults,
		identifier: string,
		state: IState = undefined,
		isPreDefined = false,
		successCallback = () => null
	) {
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
		this.classes = $.extend(true, {}, StateRestore.classes);

		// Get options from user
		this.c = $.extend(true, {}, StateRestore.defaults, opts);

		this.s = {
			dt: table,
			identifier,
			isPreDefined,
			savedState: state,
			tableId: state && state.stateRestore ? state.stateRestore.tableId : undefined
		};

		this.dom = {
			background: $('<div class="'+this.classes.background+'"/>'),
			closeButton: $('<div class="'+this.classes.closeButton+'">&times;</div>'),
			confirmation: $('<div class="'+this.classes.confirmation+'"/>'),
			confirmationButton: $('<button class="'+this.classes.confirmationButton+' '+this.classes.dtButton+'">'),
			confirmationTitleRow: $('<div class="'+this.classes.confirmationTitleRow+'"></div>'),
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
			removeContents: $(
				'<div class="'+this.classes.confirmationText+'"><span>'+
					this.s.dt
						.i18n('stateRestore.removeConfirm', this.c.i18n.removeConfirm)
						.replace(/%s/g, StateRestore.entityEncode(this.s.identifier)) +
				'</span></div>'
			),
			removeError: $(
				'<span class="'+this.classes.modalError+'">' +
					this.s.dt.i18n('stateRestore.removeError', this.c.i18n.removeError) +
				'</span>'),
			removeTitle: $(
				'<h2 class="'+this.classes.confirmationTitle+'">'+
					this.s.dt.i18n(
						'stateRestore.removeTitle',
						this.c.i18n.removeTitle
					)+
				'</h2>'
			),
			renameContents:$(
				'<div class="'+this.classes.confirmationText+' '+ this.classes.renameModal +'">' +
					'<label class="'+this.classes.confirmationMessage+'">'+
						this.s.dt
							.i18n('stateRestore.renameLabel', this.c.i18n.renameLabel)
							.replace(/%s/g, StateRestore.entityEncode(this.s.identifier))+
					'</label>' +
				'</div>'
			),
			renameInput: $(
				'<input class="'+this.classes.input+'" type="text"></input>'
			),
			renameTitle: $(
				'<h2 class="'+this.classes.confirmationTitle+'">'+
					this.s.dt.i18n(
						'stateRestore.renameTitle',
						this.c.i18n.renameTitle
					)+
				'</h2>'
			)
		};

		// When a StateRestore instance is created the current state of the table should also be saved.
		this.save(state, successCallback);
	}

	/**
	 * Removes a state from storage and then triggers the dtsr-remove event
	 * so that the StateRestoreCollection class can remove it's references as well.
	 *
	 * @param skipModal Flag to indicate if the modal should be skipped or not
	 */
	public remove(skipModal = false): boolean {
		// Check if removal of states is allowed
		if (!this.c.remove) {
			return false;
		}

		let removeFunction;
		let ajaxData = {
			action: 'remove',
			stateRestore: {
				[this.s.identifier]: this.s.savedState
			}
		};
		let successCallback = () => {
			this.dom.confirmation.trigger('dtsr-remove');
			$(this.s.dt.table().node()).trigger('stateRestore-change');
			this.dom.background.click();
			this.dom.confirmation.remove();
			$(document).unbind('keyup', e => this._keyupFunction(e));
			this.dom.confirmationButton.off('click');
		};

		// If the remove is not happening over ajax remove it from local storage and then trigger the event
		if (!this.c.ajax) {
			removeFunction = () => {
				try {
					localStorage.removeItem(
						'DataTables_stateRestore_'+this.s.identifier+'_'+location.pathname+
						(this.s.tableId ? '_' + this.s.tableId : '')
					);
					successCallback();
				}
				catch (e) {
					this.dom.confirmation.children('.'+this.classes.modalError).remove();
					this.dom.confirmation.append(this.dom.removeError);
					return 'remove';
				}

				return true;
			};
		}
		// Ajax property has to be a string, not just true
		// Also only want to save if the table has been initialised and the states have been loaded in
		else if (typeof this.c.ajax === 'string' && this.s.dt.settings()[0]._bInitComplete) {
			removeFunction = () => {
				$.ajax({
					data: ajaxData,
					success: successCallback,
					type: 'POST',
					url: this.c.ajax
				});
				return true;
			};
		}
		else if(typeof this.c.ajax === 'function') {
			removeFunction = () => {
				if (typeof this.c.ajax === 'function') {
					this.c.ajax.call(this.s.dt, ajaxData, successCallback);
				}
				return true;
			};
		}

		// If the modal is to be skipped then remove straight away
		if (skipModal) {
			this.dom.confirmation.appendTo(this.dom.dtContainer);
			$(this.s.dt.table().node()).trigger('dtsr-modal-inserted');
			removeFunction();
			this.dom.confirmation.remove();
		}
		// Otherwise display the modal
		else {
			this._newModal(
				this.dom.removeTitle,
				this.s.dt.i18n('stateRestore.removeSubmit', this.c.i18n.removeSubmit),
				removeFunction,
				this.dom.removeContents
			);
		}

		return true;
	}

	/**
	 * Compares the state held within this instance with a state that is passed in
	 *
	 * @param state The state that is to be compared against
	 * @returns boolean indicating if the states match
	 */
	public compare(state: IState): boolean {
		// Order
		if (!this.c.saveState.order) {
			state.order = undefined;
		}

		// Search
		if (!this.c.saveState.search) {
			state.search = undefined;
		}

		// Columns
		if (this.c.saveState.columns && state.columns) {
			for (let i=0, ien=state.columns.length ; i<ien ; i++) {

				// Visibility
				if (typeof this.c.saveState.columns !== 'boolean' && !this.c.saveState.columns.visible) {
					state.columns[i].visible = undefined;
				}

				// Search
				if (typeof this.c.saveState.columns !== 'boolean' && !this.c.saveState.columns.search) {
					state.columns[i].search = undefined;
				}
			}
		}
		else if (!this.c.saveState.columns) {
			state.columns = undefined;
		}

		// Paging
		if (!this.c.saveState.paging) {
			state.page = undefined;
		}

		// SearchBuilder
		if (!this.c.saveState.searchBuilder) {
			state.searchBuilder = undefined;
		}

		// SearchPanes
		if (!this.c.saveState.searchPanes) {
			state.searchPanes = undefined;
		}

		// Select
		if (!this.c.saveState.select) {
			state.select = undefined;
		}

		// ColReorder
		if (!this.c.saveState.colReorder) {
			state.ColReorder = undefined;
		}

		// Scroller
		if (!this.c.saveState.scroller) {
			state.scroller = undefined;
			if((dataTable as any).Scroller !== undefined) {
				state.start = 0;
			}
		}

		// Paging
		if (!this.c.saveState.paging) {
			state.start = 0;
		}

		// Page Length
		if (!this.c.saveState.length) {
			state.length = undefined;
		}

		// Need to delete properties that we do not want to compare
		delete state.time;
		let copyState = this.s.savedState;
		delete copyState.time;
		delete copyState.c;
		delete copyState.stateRestore;

		// Perform a deep compare of the two state objects
		return this._deepCompare(state, copyState);
	}

	/**
	 * Removes all of the dom elements from the document
	 */
	public destroy(): void {
		$.each(this.dom, (name, el) => {
			el.off().remove();
		});
	}

	/**
	 * Loads the state referenced by the identifier from storage
	 *
	 * @param state The identifier of the state that should be loaded
	 * @returns the state that has been loaded
	 */
	public load(): void | IState {
		let loadedState = this.s.savedState;
		let settings = this.s.dt.settings()[0];

		// Always want the states stored here to be loaded in - regardless of when they were created
		loadedState.time = + new Date();

		settings.oLoadedState = $.extend(true, {}, loadedState);

		// Click on a background if there is one to shut the collection
		$('div.dt-button-background').click();

		let loaded = () => {
			let correctPaging = (e, preSettings) => {
				setTimeout(() => {
					let currpage = preSettings._iDisplayStart / preSettings._iDisplayLength;
					let intendedPage = loadedState.start / loadedState.length;

					// If the paging is incorrect then we have to set it again so that it is correct
					// This happens when a searchpanes filter is removed
					// This has to happen in a timeout because searchpanes only deselects after a timeout
					if(currpage >= 0 && intendedPage >= 0 && currpage !== intendedPage) {
						this.s.dt.page(intendedPage).draw(false);
					}
				}, 50);
			};
			this.s.dt.one('preDraw', correctPaging);
			this.s.dt.draw(false);
		};

		// Call the internal datatables function to implement the state on the table
		if (DataTable.versionCheck('2')) {
			this.s.dt.state(loadedState);
			loaded();
		}
		else {
			// Legacy
			DataTable.ext.oApi._fnImplementState(settings, loadedState, loaded);
		}

		return loadedState;
	}

	/**
	 * Shows a modal that allows a state to be renamed
	 *
	 * @param newIdentifier Optional. The new identifier for this state
	 */
	public rename(newIdentifier: null|string = null, currentIdentifiers: string[]): void {
		// Check if renaming of states is allowed
		if (!this.c.rename) {
			return;
		}

		let renameFunction = () => {
			if(newIdentifier === null) {
				let tempIdentifier = $('input.'+this.classes.input.replace(/ /g, '.')).val();

				if (tempIdentifier.length === 0) {
					this.dom.confirmation.children('.'+this.classes.modalError).remove();
					this.dom.confirmation.append(this.dom.emptyError);
					return 'empty';
				}
				else if(currentIdentifiers.includes(tempIdentifier)) {
					this.dom.confirmation.children('.'+this.classes.modalError).remove();
					this.dom.confirmation.append(this.dom.duplicateError);
					return 'duplicate';
				}
				else {
					newIdentifier = tempIdentifier;
				}
			}

			let ajaxData = {
				action: 'rename',
				stateRestore: {
					[this.s.identifier]: newIdentifier
				}
			};
			let successCallback = () => {
				this.s.identifier = newIdentifier;
				this.save(this.s.savedState, () => null, false);
				this.dom.removeContents = $(
					'<div class="'+this.classes.confirmationText+'"><span>'+
						this.s.dt
							.i18n('stateRestore.removeConfirm', this.c.i18n.removeConfirm)
							.replace(/%s/g, this.s.identifier) +
					'</span></div>'
				);
				this.dom.confirmation.trigger('dtsr-rename');
				this.dom.background.click();
				this.dom.confirmation.remove();
				$(document).unbind('keyup', e => this._keyupFunction(e));
				this.dom.confirmationButton.off('click');
			};

			if (!this.c.ajax) {
				try {
					localStorage.removeItem(
						'DataTables_stateRestore_'+this.s.identifier+'_'+location.pathname+
						(this.s.tableId ? '_' + this.s.tableId : '')
					);
					successCallback();
				}
				catch (e) {
					this.dom.confirmation.children('.'+this.classes.modalError).remove();
					this.dom.confirmation.append(this.dom.removeError);
					return false;
				}
			}
			else if (typeof this.c.ajax === 'string' && this.s.dt.settings()[0]._bInitComplete) {
				$.ajax({
					data: ajaxData,
					success: successCallback,
					type: 'POST',
					url: this.c.ajax
				});
			}
			else if(typeof this.c.ajax === 'function') {
				this.c.ajax.call(this.s.dt, ajaxData, successCallback);
			}

			return true;
		};

		// Check if a new identifier has been provided, if so no need for a modal
		if (newIdentifier !== null) {
			if(currentIdentifiers.includes(newIdentifier)) {
				throw new Error(this.s.dt.i18n('stateRestore.duplicateError', this.c.i18n.duplicateError));
			}
			else if(newIdentifier.length === 0) {
				throw new Error(this.s.dt.i18n('stateRestore.emptyError', this.c.i18n.emptyError));
			}
			else{
				this.dom.confirmation.appendTo(this.dom.dtContainer);
				$(this.s.dt.table().node()).trigger('dtsr-modal-inserted');
				renameFunction();
				this.dom.confirmation.remove();
			}
		}
		else {
			this.dom.renameInput.val(this.s.identifier);
			this.dom.renameContents.append(this.dom.renameInput);
			this._newModal(
				this.dom.renameTitle,
				this.s.dt.i18n('stateRestore.renameButton', this.c.i18n.renameButton),
				renameFunction,
				this.dom.renameContents
			);
		}
	}

	/**
	 * Saves the tables current state using the identifier that is passed in.
	 *
	 * @param state Optional. If provided this is the state that will be saved rather than using the current state
	 */
	public save(state: IState, passedSuccessCallback, callAjax = true): void {
		// Check if saving states is allowed
		if (!this.c.save) {
			if(passedSuccessCallback) {
				passedSuccessCallback.call(this);
			}
			return;
		}

		// this.s.dt.state.save();
		let savedState: IState;

		// If no state has been provided then create a new one from the current state
		this.s.dt.state.save();

		if (state === undefined) {
			savedState = this.s.dt.state();
		}
		else if(typeof state !== 'object') {
			return;
		}
		else {
			savedState = state;
		}

		if (savedState.stateRestore) {
			savedState.stateRestore.isPreDefined = this.s.isPreDefined;
			savedState.stateRestore.state= this.s.identifier;
			savedState.stateRestore.tableId = this.s.tableId;
		}
		else {
			savedState.stateRestore = {
				isPreDefined: this.s.isPreDefined,
				state: this.s.identifier,
				tableId: this.s.tableId
			};
		}

		this.s.savedState = savedState;

		// Order
		if (!this.c.saveState.order) {
			this.s.savedState.order = undefined;
		}

		// Search
		if (!this.c.saveState.search) {
			this.s.savedState.search = undefined;
		}

		// Columns
		if (this.c.saveState.columns && this.s.savedState.columns) {
			for (let i=0, ien=this.s.savedState.columns.length ; i<ien ; i++) {

				// Visibility
				if (typeof this.c.saveState.columns !== 'boolean' && !this.c.saveState.columns.visible) {
					this.s.savedState.columns[i].visible = undefined;
				}

				// Search
				if (typeof this.c.saveState.columns !== 'boolean' && !this.c.saveState.columns.search) {
					this.s.savedState.columns[i].search = undefined;
				}
			}
		}
		else if (!this.c.saveState.columns) {
			this.s.savedState.columns = undefined;
		}

		// SearchBuilder
		if (!this.c.saveState.searchBuilder) {
			this.s.savedState.searchBuilder = undefined;
		}

		// SearchPanes
		if (!this.c.saveState.searchPanes) {
			this.s.savedState.searchPanes = undefined;
		}

		// Select
		if (!this.c.saveState.select) {
			this.s.savedState.select = undefined;
		}

		// ColReorder
		if (!this.c.saveState.colReorder) {
			this.s.savedState.ColReorder = undefined;
		}

		// Scroller
		if (!this.c.saveState.scroller) {
			this.s.savedState.scroller = undefined;
			if((dataTable as any).Scroller !== undefined) {
				this.s.savedState.start = 0;
			}
		}

		// Paging
		if (!this.c.saveState.paging) {
			this.s.savedState.start = 0;
		}

		// Page Length
		if (!this.c.saveState.length) {
			this.s.savedState.length = undefined;
		}

		this.s.savedState.c = this.c;

		// Need to remove the parent reference before we save the state
		// Its not needed to rebuild, but it does cause a circular reference when converting to JSON
		if (this.s.savedState.c.splitSecondaries.length) {
			for (let secondary of this.s.savedState.c.splitSecondaries) {
				if (secondary.parent) {
					secondary.parent = undefined;
				}
			}
		}

		let ajaxData = {
			action: 'save',
			stateRestore: {
				[this.s.identifier]: this.s.savedState
			}
		};

		let successCallback = () => {
			if(passedSuccessCallback) {
				passedSuccessCallback.call(this);
			}
			this.dom.confirmation.trigger('dtsr-save');
			$(this.s.dt.table().node()).trigger('stateRestore-change');
		};

		if (!this.c.ajax) {
			localStorage.setItem(
				'DataTables_stateRestore_'+this.s.identifier+'_'+location.pathname+
				(this.s.tableId ? '_' + this.s.tableId : ''),
				JSON.stringify(this.s.savedState)
			);
			successCallback();
		}
		else if (typeof this.c.ajax === 'string' && callAjax) {
			if(this.s.dt.settings()[0]._bInitComplete) {
				$.ajax({
					data: ajaxData,
					success: successCallback,
					type: 'POST',
					url: this.c.ajax
				});
			}
			else {
				this.s.dt.one('init', () => {
					$.ajax({
						data: ajaxData,
						success: successCallback,
						type: 'POST',
						url: this.c.ajax
					});
				});
			}
		}
		else if(typeof this.c.ajax === 'function' && callAjax) {
			this.c.ajax.call(this.s.dt, ajaxData, successCallback);
		}
	}

	/**
	 * Encode HTML entities
	 * 
	 * @param d String to encode
	 * @returns Encoded string
	 * @todo When DT1 support is dropped, switch to using `DataTable.util.escapeHtml`
	 */
	static entityEncode(d: string): string {
		return typeof d === 'string' ?
			d
				.replace(/&/g, '&amp;')
				.replace(/</g, '&lt;')
				.replace(/>/g, '&gt;')
				.replace(/"/g, '&quot;') :
			d;
	}

	/**
	 * Performs a deep compare of two state objects, returning true if they match
	 *
	 * @param state1 The first object to compare
	 * @param state2 The second object to compare
	 * @returns boolean indicating if the objects match
	 */
	private _deepCompare(state1: any, state2: any): boolean {
		if (state1 === null && state2 === null) {
			return true;
		}
		else if (state1 === null || state2 === null) {
			return false;
		}

		// Put keys and states into arrays as this makes the later code easier to work
		let states = [state1, state2];
		let keys = [Object.keys(state1).sort(), Object.keys(state2).sort()];
		let startIdx, i;

		// If scroller is included then we need to remove the start value
		//  as it can be different but yield the same results
		if (keys[0].includes('scroller')) {
			startIdx = keys[0].indexOf('start');

			if (startIdx) {
				keys[0].splice(startIdx, 1);
			}
		}

		if (keys[1].includes('scroller')) {
			startIdx = keys[1].indexOf('start');

			if (startIdx) {
				keys[1].splice(startIdx, 1);
			}
		}

		// We want to remove any private properties within the states
		for (i = 0; i < keys[0].length; i++) {
			if (keys[0][i].indexOf('_') === 0) {
				keys[0].splice(i, 1);
				i--;
				continue;
			}
			// If scroller is included then we need to remove the following values
			//  as they can be different but yield the same results
			if (
				keys[0][i] === 'baseRowTop' ||
				keys[0][i] === 'baseScrollTop' ||
				keys[0][i] === 'scrollTop' ||
				(!this.c.saveState.paging && keys[0][i] === 'page')
			) {
				keys[0].splice(i, 1);
				i--;
				continue;
			}
		}

		for (i = 0; i < keys[1].length; i++) {
			if (keys[1][i].indexOf('_') === 0) {
				keys[1].splice(i, 1);
				i--;
				continue;
			}
			if (
				keys[1][i] === 'baseRowTop' ||
				keys[1][i] === 'baseScrollTop' ||
				keys[1][i] === 'scrollTop' ||
				(!this.c.saveState.paging && keys[0][i] === 'page')
			) {
				keys[1].splice(i, 1);
				i--;
				continue;
			}
		}

		if (
			keys[0].length === 0 && keys[1].length > 0 ||
			keys[1].length === 0 && keys[0].length > 0
		) {
			return false;
		}

		// We are only going to compare the keys that are common between both states
		for (i = 0; i < keys[0].length; i++) {
			if(!keys[1].includes(keys[0][i])) {
				keys[0].splice(i,1);
				i--;
			}
		}

		for (i = 0; i < keys[1].length; i++) {
			if(!keys[0].includes(keys[1][i])) {
				keys[1].splice(i,1);
				i--;
			}
		}

		// Then each key and value has to be checked against each other
		for(i = 0; i < keys[0].length; i++) {
			// If the keys dont equal, or their corresponding types are different we can return false
			if (keys[0][i] !== keys[1][i] || typeof states[0][keys[0][i]] !== typeof states[1][keys[1][i]]) {
				return false;
			}

			// If the type is an object then further deep comparisons are required
			if (typeof states[0][keys[0][i]] === 'object') {
				// Arrays must be the same length to be matched
				if (Array.isArray(states[0][keys[0][i]]) && Array.isArray(states[1][keys[1][i]])) {
					if (states[0][keys[0][i]].length !== states[1][keys[0][i]].length) {
						return false;
					}
				}

				if (!this._deepCompare(states[0][keys[0][i]], states[1][keys[1][i]])) {
					return false;
				}
			}
			else if(typeof states[0][keys[0][i]] === 'number' && typeof states[1][keys[1][i]] === 'number') {
				if(Math.round(states[0][keys[0][i]]) !== Math.round(states[1][keys[1][i]])) {
					return false;
				}
			}
			// Otherwise we can just check the value
			else if(states[0][keys[0][i]] !== states[1][keys[1][i]]) {
				return false;
			}
		}

		// If we get all the way to here there are no differences so return true for this object
		return true;
	}

	private _keyupFunction(e) {
		// If enter same action as pressing the button
		if (e.key === 'Enter') {
			this.dom.confirmationButton.click();
		}
		// If escape close modal
		else if (e.key === 'Escape') {
			$('div.'+this.classes.background.replace(/ /g, '.')).click();
		}
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
		buttonAction: () => boolean | string,
		modalContents: JQuery<HTMLElement>,
	): void {
		this.dom.background.appendTo(this.dom.dtContainer);
		this.dom.confirmationTitleRow.empty().append(title);
		this.dom.confirmationButton.html(buttonText);
		this.dom.confirmation
			.empty()
			.append(this.dom.confirmationTitleRow)
			.append(modalContents)
			.append(
				$('<div class="'+this.classes.confirmationButtons+'"></div>')
					.append(this.dom.confirmationButton)
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
			this.dom.confirmationButton.focus();
		}

		let background = $('div.'+this.classes.background.replace(/ /g, '.'));

		if (this.c.modalCloseButton) {
			this.dom.confirmation.append(this.dom.closeButton);
			this.dom.closeButton.on('click', () => background.click());
		}

		// When the button is clicked, call the appropriate action,
		// remove the background and modal from the screen and unbind the keyup event.
		this.dom.confirmationButton.on('click', () => buttonAction());

		this.dom.confirmation.on('click', (e) => {
			e.stopPropagation();
		});

		// When the button is clicked, remove the background and modal from the screen and unbind the keyup event.
		background.one('click', () => {
			this.dom.background.remove();
			this.dom.confirmation.remove();
			$(document).unbind('keyup', e => this._keyupFunction(e));
		});

		$(document).on('keyup', e => this._keyupFunction(e));
	}
}
