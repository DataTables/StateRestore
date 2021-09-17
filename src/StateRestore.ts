let $;
let dataTable;

import * as restoreType from './StateRestoreCollection';

export function setJQuery(jq) {
	$ = jq;
	dataTable = jq.fn.dataTable;
}

export interface IClasses {
	background: string;
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
	savedState: null | IState;
}

export interface IDom {
	background: JQuery<HTMLElement>;
	confirmation: JQuery<HTMLElement>;
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
	childRows: number[];
	columns: IColumn[];
	length: number;
	order: Array<Array<string|number>>;
	paging: any;
	scroller: any;
	search: ISearch;
	searchBuilder: any;
	searchPanes: any;
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
	state: string;
}
export default class StateRestore {
	private static version = '0.0.1';

	private static classes: IClasses = {
		background: 'dtsr-background',
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
				name: 'Name:',
				order: 'Sorting:',
				paging: 'Paging:',
				scroller: 'Scroll Position:',
				search: 'Search:',
				searchBuilder: 'SearchBuilder:',
				searchPanes: 'SearchPanes:',
				title: 'Create New State',
				toggleLabel: 'Includes:'
			},
			duplicateError: 'A state with this name already exists.',
			emptyError: 'Name cannot be empty.',
			emptyStates: 'No saved states',
			removeSubmit: 'Remove',
			removeConfirm: 'Are you sure you want to remove %s?',
			removeError: 'Failed to remove state.',
			removeJoiner: ' and ',
			removeTitle: 'Remove State',
			renameButton: 'Rename',
			renameLabel: 'New Name for %s:',
			renameTitle: 'Rename State',
		},
		remove: true,
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
	public dom: IDom;
	public c: restoreType.IDefaults;
	public s: IS;

	public constructor(settings: any, opts: restoreType.IDefaults, identifier: string, state: IState = undefined) {
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
			savedState: null
		};

		this.dom = {
			background: $('<div class="'+this.classes.background+'"/>'),
			confirmation: $('<div class="'+this.classes.confirmation+'"/>'),
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
						.replace(/%s/g, this.s.identifier) +
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
							.replace(/%s/g, this.s.identifier)+
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
		this.save(state);
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

		// If the remove is not happening over ajax remove it from local storage and then trigger the event
		if (!this.c.ajax) {
			removeFunction = () => {
				try {
					sessionStorage.removeItem(
						'DataTables_stateRestore_'+this.s.identifier+'_'+location.pathname
					);

					this.dom.confirmation.trigger('dtsr-remove');
				}
				catch (e) {
					return 'remove';
				}

				return true;
			};
		}
		// Otherwise when it occurs just trigger the event
		else {
			removeFunction = () => this.dom.confirmation.trigger('dtsr-remove');
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
	 * Removes all of the dom elements from the document
	 */
	public destroy(): void {
		Object.values(this.dom).forEach((node)=> node.off().remove());
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

		// Call the internal datatables function to implement the state on the table
		$.fn.dataTable.ext.oApi._fnImplementState(settings, loadedState, () => {
			this.s.dt.draw(false);
		});

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
					return 'empty';
				}
				else if(currentIdentifiers.includes(tempIdentifier)) {
					return 'duplicate';
				}
				else {
					newIdentifier = tempIdentifier;
				}
			}

			if (!this.c.ajax) {
				try {
					sessionStorage.removeItem(
						'DataTables_stateRestore_'+this.s.identifier+'_'+location.pathname
					);
				}
				catch (e) {
					return false;
				}
			}

			this.s.identifier = newIdentifier;

			this.dom.removeContents = $(
				'<div class="'+this.classes.confirmationText+'"><span>'+
					this.s.dt
						.i18n('stateRestore.removeConfirm', this.c.i18n.removeConfirm)
						.replace(/%s/g, this.s.identifier) +
				'</span></div>'
			);

			this.save(this.s.savedState);
			this.dom.confirmation.trigger('dtsr-rename');

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
	public save(state?: IState): void {
		// Check if saving states is allowed
		if (!this.c.save) {
			return;
		}

		// this.s.dt.state.save();
		let savedState: IState;

		// If no state has been provided then create a new one from the current state
		if (state === undefined) {
			this.s.dt.state.save();
			savedState = this.s.dt.state();
		}
		else {
			savedState = state;
		}

		savedState.stateRestore = {
			state: this.s.identifier
		};

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

		// ColReorder
		if (!this.c.saveState.colReorder) {
			this.s.savedState.ColReorder = undefined;
		}

		// Scroller
		if (!this.c.saveState.scroller) {
			this.s.savedState.scroller = undefined;
		}

		// Paging
		if (!this.c.saveState.paging) {
			this.s.savedState.start = 0;
		}

		this.s.savedState.c = this.c;

		if (!this.c.ajax) {
			try {
				sessionStorage.setItem(
					'DataTables_stateRestore_'+this.s.identifier+'_'+location.pathname,
					JSON.stringify(this.s.savedState)
				);
				this.dom.confirmation.trigger('dtsr-save');
			}
			catch (e) {
				return;
			}
		}
		else {
			this.dom.confirmation.trigger('dtsr-save');
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
			let success = buttonAction();
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
	 * Convert from camelCase notation to the internal Hungarian.
	 * We could use the Hungarian convert function here, but this is cleaner
	 *
	 * @param {object} obj Object to convert
	 * @returns {object} Inverted object
	 * @memberof DataTable#oApi
	 */
	private _searchToHung(obj: ISearch): IHungSearch {
		return {
			bCaseInsensitive: obj.caseInsensitive,
			bRegex:           obj.regex,
			bSmart:           obj.smart,
			sSearch:          obj.search
		};
	}
}
