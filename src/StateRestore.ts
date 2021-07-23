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
	confirmationText: string;
	dtButton: string;
	input: string;
}

export interface IS {
	dt: any;
	identifier: string;
	savedState: null | IState;
}

export interface IDom {
	background: JQuery<HTMLElement>;
	confirmation: JQuery<HTMLElement>;
}

export interface IState {
	childRows: number[];
	colReorder: any;
	columns: IColumn[];
	length: number;
	order: Array<Array<string|number>>;
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
		confirmationText: 'dtsr-confirmation-text',
		dtButton: 'dt-button',
		input: 'dtsr-input'
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
			confirmation: $('<div class="'+this.classes.confirmation+'"/>')
		};

		// When a StateRestore instance is created the current state of the table should also be saved.
		this.save();
	}

	/**
	 * Removes a state from storage and
	 * then triggers the dtsr-delete event so that the StateRestoreCollection class can remove it's references as well.
	 *
	 * @param skipModal Flag to indicate if the modal should be skipped or not
	 */
	public delete(skipModal = false): void {
		try {
			// Check if deletion of states is allowed
			if (!this.c.delete) {
				return;
			}

			let deleteFunction;
			if(!this.c.ajax) {
				deleteFunction = () => {
					sessionStorage.removeItem(
						'DataTables_stateRestore_'+this.s.identifier+'_'+location.pathname
					);

					this.dom.confirmation.trigger('dtsr-delete');
				};
			}
			else {
				deleteFunction = () => this.dom.confirmation.trigger('dtsr-delete');
			}

			if (skipModal) {
				this.dom.confirmation.appendTo('body');
				deleteFunction();
				this.dom.confirmation.remove();
			}
			else {
				this.confirmationModal(
					this.s.dt.i18n('stateRestore.deleteConfirm', this.c.i18n.deleteConfirm),
					this.s.dt.i18n('stateRestore.deleteButton', this.c.i18n.deleteButton),
					deleteFunction
				);
			}
		}
		catch (e) {
			return;
		}
	}

	/**
	 * Shows a modal that allows a state to be renamed
	 *
	 * @param newIdentifier Optional. The new identifier for this state
	 */
	public rename(newIdentifier: null|string = null): void {
		try {
			// Check if renaming of states is allowed
			if (!this.c.rename) {
				return;
			}

			let renameFunction = (newId) => {
				try {
					if(!this.c.ajax) {
						sessionStorage.removeItem(
							'DataTables_stateRestore_'+this.s.identifier+'_'+location.pathname
						);
					}
				}
				catch (e) {
					return;
				}

				this.s.identifier = newId;
				this.save(this.s.savedState);
				this.dom.confirmation.trigger('dtsr-rename');
			};

			// Check if a new identifier has been provided, if so no need for a modal
			if (newIdentifier !== null) {
				this.dom.confirmation.appendTo('body');
				renameFunction(newIdentifier);
				this.dom.confirmation.remove();
			}
			else {
				this.renameModal(
					this.s.dt.i18n('stateRestore.renameLabel', this.c.i18n.renameLabel),
					this.s.dt.i18n('stateRestore.renameButton', this.c.i18n.renameButton),
					renameFunction
				);
			}

		}
		catch (e) {
			return;
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
				let col = this.s.savedState.columns[i];

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
		if (!this.c.saveState.colReorder) {
			this.s.savedState.colReorder = undefined;
		}

		// Scroller
		if (!this.c.saveState.scroller) {
			this.s.savedState.scroller = undefined;
		}

		// Paging
		if (!this.c.saveState.paging) {
			this.s.savedState.start = 0;
		}

		try {
			if(!this.c.ajax) {
				sessionStorage.setItem(
					'DataTables_stateRestore_'+this.s.identifier+'_'+location.pathname,
					JSON.stringify(this.s.savedState)
				);

				this.dom.confirmation.trigger('dtsr-save');
			}
			else {
				this.dom.confirmation.trigger('dtsr-save');
			}
		}
		catch (e) {
			return;
		}
	}

	/**
	 * Loads the state referenced by the identifier from storage
	 *
	 * @param state The identifier of the state that should be loaded
	 * @returns the state that has been loaded
	 */
	public load(): void | IState {
		try {
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

			// Search
			if (this.c.saveState.search && loadedState.search !== undefined) {
				$.extend(settings.oPreviousSearch, this.searchToHung(loadedState.search));
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
						$.extend(settings.aoPreSearchCols[i], this.searchToHung(col.search));
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
			if (this.c.saveState.colReorder && loadedState.colReorder) {
				this.s.dt.colReorder.order(loadedState.colReorder, true);
			}

			// Scroller
			if (this.c.saveState.scroller && loadedState.scroller) {
				this.s.dt.scroller.toPosition(loadedState.scroller.topRow);
			}

			this.s.dt.draw();

			return loadedState;
		}
		catch (e) {
			return;
		}
	}

	/**
	 * Displays a confirmation modal for the user to confirm their action
	 *
	 * @param message The message that should be displayed within the confirmation modal.
	 * @param buttonText The text that should be displayed in the confirmation button.
	 * @param buttonAction The action that should be taken when the confirmation button is pressed.
	 */
	private confirmationModal(message: string, buttonText: string, buttonAction: () => void): void {
		this.dom.confirmation.empty();
		this.dom.confirmation
			.append($('<div class="'+this.classes.confirmationText+'"><span>'+message+'</span></div>'))
			.append(
				$('<div class="'+this.classes.confirmationButtons+'">' +
						'<button class="'+this.classes.confirmationButton+' '+this.classes.dtButton+'">'+
							buttonText+
						'</button>' +
					'</div>'
				)
			);
		this.dom.background.appendTo('body');
		this.dom.confirmation.appendTo('body');

		$('button.'+this.classes.confirmationButton.replace(/ /g, '.')).one('click', () => {
			buttonAction();
			this.dom.background.remove();
			this.dom.confirmation.remove();
		});

		$('div.'+this.classes.background.replace(/ /g, '.')).one('click', (event) => {
			event.stopPropagation();
			this.dom.background.remove();
			this.dom.confirmation.remove();
		});
	}

	/**
	 * Displays a rename modal for the user to rename the selected state
	 *
	 * @param message The message that should be displayed within the confirmation modal.
	 * @param buttonText The text that should be displayed in the confirmation button.
	 * @param buttonAction The action that should be taken when the confirmation button is pressed.
	 */
	private renameModal(message: string, buttonText: string, buttonAction: (newIdentifier: string) => void): void {
		this.dom.confirmation.empty();
		this.dom.confirmation
			.append(
				$('<div class="'+this.classes.confirmationText+'">' +
					'<span>'+message+'</span>' +
					'<input class="'+this.classes.input+'"></input>' +
				'</div>')
			)
			.append(
				$('<div class="'+this.classes.confirmationButtons+'">' +
						'<button class="'+this.classes.confirmationButton+' '+this.classes.dtButton+'">'+
							buttonText+
						'</button>' +
					'</div>'
				)
			);
		this.dom.background.appendTo('body');
		this.dom.confirmation.appendTo('body');

		$('button.'+this.classes.confirmationButton.replace(/ /g, '.')).one('click', () => {
			buttonAction($('input.'+this.classes.input.replace(/ /g, '.')).val());
			this.dom.background.remove();
			this.dom.confirmation.remove();
		});

		$('div.'+this.classes.background.replace(/ /g, '.')).one('click', (event) => {
			event.stopPropagation();
			this.dom.background.remove();
			this.dom.confirmation.remove();
		});
	}

	/**
	 * Convert from camelCase notation to the internal Hungarian. We could use the
	 * Hungarian convert function here, but this is cleaner
	 *
	 * @param {object} obj Object to convert
	 * @returns {object} Inverted object
	 * @memberof DataTable#oApi
	 */
	private searchToHung(obj: ISearch): IHungSearch {
		return {
			bCaseInsensitive: obj.caseInsensitive,
			bRegex:           obj.regex,
			bSmart:           obj.smart,
			sSearch:          obj.search
		};
	}
}
