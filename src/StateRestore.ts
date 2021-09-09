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
	deleteContents: JQuery<HTMLElement>;
	deleteTitle: JQuery<HTMLElement>;
	renameContents: JQuery<HTMLElement>;
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
		renameModal: 'dtsr-rename-modal'
	};

	private static defaults: restoreType.IDefaults = {
		ajax: false,
		create: true,
		creationModal: false,
		delete: true,
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
			deleteButton: 'Delete',
			deleteConfirm: 'Are you sure you want to delete %s?',
			deleteTitle: 'Delete State',
			emptyStates: 'No saved states',
			renameButton: 'Rename',
			renameLabel: 'New Name for %s:',
			renameTitle: 'Rename State',
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
	public dom: IDom;
	public c: restoreType.IDefaults;
	public s: IS;

	public constructor(settings: any, opts: restoreType.IDefaults, identifier: string) {
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
			deleteContents: $(
				'<div class="'+this.classes.confirmationText+'"><span>'+
					this.s.dt
						.i18n('stateRestore.deleteConfirm', this.c.i18n.deleteConfirm)
						.replace(/%s/g, this.s.identifier) +
				'</span></div>'
			),
			deleteTitle: $(
				'<h2 class="'+this.classes.confirmationTitle+'">'+
					this.s.dt.i18n(
						'stateRestore.deleteTitle',
						this.c.i18n.deleteTitle
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
					'<input class="'+this.classes.input+'" type="text"></input>' +
				'</div>'
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
		this.save();
	}

	/**
	 * Removes a state from storage and then triggers the dtsr-delete event
	 * so that the StateRestoreCollection class can remove it's references as well.
	 *
	 * @param skipModal Flag to indicate if the modal should be skipped or not
	 */
	public delete(skipModal = false): void {
		// Check if deletion of states is allowed
		if (!this.c.delete) {
			return;
		}

		let deleteFunction;

		// If the delete is not happening over ajax remove it from local storage and then trigger the event
		if (!this.c.ajax) {
			deleteFunction = () => {
				try {
					sessionStorage.removeItem(
						'DataTables_stateRestore_'+this.s.identifier+'_'+location.pathname
					);

					this.dom.confirmation.trigger('dtsr-delete');
				}
				catch (e) {
					return;
				}

			};
		}
		// Otherwise when it occurs just trigger the event
		else {
			deleteFunction = () => this.dom.confirmation.trigger('dtsr-delete');
		}

		// If the modal is to be skipped then delete straight away
		if (skipModal) {
			this.dom.confirmation.appendTo('body');
			deleteFunction();
			this.dom.confirmation.remove();
		}
		// Otherwise display the modal
		else {
			this._newModal(
				this.dom.deleteTitle,
				this.s.dt.i18n('stateRestore.deleteButton', this.c.i18n.deleteButton),
				deleteFunction,
				this.dom.deleteContents
			);
		}
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

		if (settings.aoColumns && settings.aoColumns.length !== loadedState.columns.length) {
			return;
		}

		settings.oLoadedState = $.extend(true, {}, loadedState);

		// Order
		if (this.c.saveState.order && loadedState.order !== undefined) {
			settings.aaSorting = [];
			$.each(loadedState.order, function(i, col) {
				settings.aaSorting.push(col[0] >= settings.aoColumns.length ?
					[0, col[1]] :
					col
				);
			});
		}

		// Paging
		if(this.c.saveState.paging && loadedState.start !== undefined) {
			this.s.dt.page(loadedState.start / loadedState.length);
		}

		// Search
		if (this.c.saveState.search && loadedState.search !== undefined) {
			$.extend(settings.oPreviousSearch, this._searchToHung(loadedState.search));
		}

		// Columns
		if (this.c.saveState.columns && loadedState.columns) {
			for (let i=0, ien=loadedState.columns.length ; i<ien ; i++) {
				let col = loadedState.columns[i];

				// Visibility
				if (
					typeof this.c.saveState.columns !== 'boolean' &&
					this.c.saveState.columns.visible &&
					col.visible !== undefined
				) {
					settings.aoColumns[i].bVisible = col.visible;
				}

				// Search
				if (
					typeof this.c.saveState.columns !== 'boolean' &&
					this.c.saveState.columns.search &&
					col.search !== undefined
				) {
					$.extend(settings.aoPreSearchCols[i], this._searchToHung(col.search));
				}
			}
		}

		// SearchBuilder
		if (this.c.saveState.searchBuilder && loadedState.searchBuilder) {
			this.s.dt.searchBuilder.rebuild(loadedState.searchBuilder);
		}

		// SearchPanes
		if (this.c.saveState.searchPanes && loadedState.searchPanes) {
			this.s.dt.searchPanes.clearSelections();
			// Set the selection list for the panes so that the correct
			// rows can be reselected and in the right order
			this.s.dt.context[0]._searchPanes.s.selectionList =
				loadedState.searchPanes.selectionList !== undefined ?
					loadedState.searchPanes.selectionList :
					[];

			// Find the panes that match from the state and the actual instance
			for (let loadedPane of loadedState.searchPanes.panes) {
				for (let pane of this.s.dt.context[0]._searchPanes.s.panes) {
					if (loadedPane.id === pane.s.index) {
						// Set the value of the searchbox
						pane.dom.searchBox.val(loadedPane.searchTerm);
						// Set the value of the order
						pane.s.dtPane.order(loadedPane.order);
					}
				}
			}

			this.s.dt.searchPanes.rebuildPane(false, true);
		}

		// ColReorder
		if (this.c.saveState.ColReorder && loadedState.ColReorder) {
			this.s.dt.colReorder.order(loadedState.ColReorder, true);
		}

		// Scroller
		if (this.c.saveState.scroller && loadedState.scroller) {
			this.s.dt.scroller.toPosition(loadedState.scroller.topRow);
		}

		this.s.dt.draw(false);

		// Click on a background if there is one to shut the collection
		$('div.dt-button-background').click();

		return loadedState;
	}

	/**
	 * Shows a modal that allows a state to be renamed
	 *
	 * @param newIdentifier Optional. The new identifier for this state
	 */
	public rename(newIdentifier: null|string = null): void {
		// Check if renaming of states is allowed
		if (!this.c.rename) {
			return;
		}

		let renameFunction = () => {
			if (!this.c.ajax) {
				try {
					sessionStorage.removeItem(
						'DataTables_stateRestore_'+this.s.identifier+'_'+location.pathname
					);
				}
				catch (e) {
					return;
				}
			}

			this.s.identifier = $('input.'+this.classes.input.replace(/ /g, '.')).val();
			this.save(this.s.savedState);
			this.dom.confirmation.trigger('dtsr-rename');
		};

		// Check if a new identifier has been provided, if so no need for a modal
		if (newIdentifier !== null) {
			this.dom.confirmation.appendTo('body');
			renameFunction();
			this.dom.confirmation.remove();
		}
		else {
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
				if (typeof this.c.saveState.columns !== 'boolean' && this.c.saveState.columns.search) {
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
		if (!this.c.saveState.ColReorder) {
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

	/* Displays a confirmation modal for the user to confirm their action
	 *
	 * @param message The message that should be displayed within the confirmation modal.
	 * @param buttonText The text that should be displayed in the confirmation button.
	 * @param buttonAction The action that should be taken when the confirmation button is pressed.
	 */
	private _newModal(
		title: JQuery<HTMLElement>,
		buttonText: string,
		buttonAction: () => void,
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
			buttonAction();
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
