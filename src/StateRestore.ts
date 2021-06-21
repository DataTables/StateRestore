let $;
let dataTable;

export function setJQuery(jq) {
	$ = jq;
	dataTable = jq.fn.dataTable;
}

export default class StateRestore {
	private static version = '0.0.1';

	private static classes = {
		background: 'dtsr-background',
		confirmation: 'dtsr-confirmation',
		confirmationButton: 'dtsr-confirmation-button',
		confirmationButtons: 'dtsr-confirmation-buttons',
		confirmationText: 'dtsr-confirmation-text',
		dtButton: 'dt-button',
		input: 'dtsr-input'
	};

	private static defaults = {
		delete: true,
		i18n: {
			deleteButton: 'Delete',
			deleteConfirm: 'Are you sure you want to delete this state?',
			emptyStates: 'No saved states',
			renameButton: 'Rename',
			renameLabel: 'New Name:'
		},
		load: true,
		save: true
	};

	public classes;
	public dom;
	public c;
	public s;

	public constructor(settings, opts, identifier) {
		// Check that the required version of DataTables is included
		if (! dataTable || ! dataTable.versionCheck || ! dataTable.versionCheck('1.10.0')) {
			throw new Error('StateRestore requires DataTables 1.10 or newer');
		}

		// Check that Select is included
		if (! (dataTable as any).Buttons) {
			throw new Error('StateRestore requires Buttons');
		}

		let table = new dataTable.Api(settings);
		this.classes = $.extend(true, {}, StateRestore.classes);

		// Get options from user
		this.c = $.extend(true, {}, StateRestore.defaults, opts);

		this.s = {
			dt: table,
			identifier
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
	 * @param state The identifier of the state that should be deleted
	 */
	public delete() {
		try {
			this.confirmationModal(
				this.s.dt.i18n('stateRestore.deleteConfirm', this.c.i18n.deleteConfirm),
				this.s.dt.i18n('stateRestore.deleteButton', this.c.i18n.deleteButton),
				() => {
					sessionStorage.removeItem(
						'DataTables_stateRestore_'+this.s.idenfitier+'_'+location.pathname
					);
					console.log('delete' + this.s.idenfitier);
					this.dom.confirmation.trigger('dtsr-delete');
				}
			);
		}
		catch (e) {}
	}

	/**
	 * Shows a modal that allows a state to be renamed
	 *
	 * @param identifier The identifier for the state that is to be renamed
	 */
	public rename() {
		try {
			this.renameModal(
				this.s.dt.i18n('stateRestore.renameLabel', this.c.i18n.renameLabel),
				this.s.dt.i18n('stateRestore.renameButton', this.c.i18n.renameButton),
				(newIdentifier) => {
					try {
						sessionStorage.removeItem(
							'DataTables_stateRestore_'+this.s.identifier+'_'+location.pathname
						);
					}
					catch (e) {}

					this.s.identifier = newIdentifier;
					this.save(this.s.savedState);
					this.dom.confirmation.trigger('dtsr-rename');
				}
			);
		}
		catch (e) {}
	}

	/**
	 * Saves the tables current state using the identifier that is passed in.
	 *
	 * @param identifier The identifier of the state that should be saved
	 * @param state Optional. If provided this is the state that will be saved rather than using the current state
	 */
	public save(state=false) {
		let savedState;

		// If no state has been provided then create a new one from the current state
		if (!state) {
			this.s.dt.state.save();
			savedState = this.s.dt.state();
		}
		else {
			savedState = state;
		}
		savedState.stateRestore = {
			state: this.s.identifier
		};

		console.log('save', this.s.identifier, savedState);

		this.s.savedState = savedState;

		try {
			sessionStorage.setItem(
				'DataTables_stateRestore_'+this.s.identifier+'_'+location.pathname,
				JSON.stringify(savedState)
			);
		}
		catch (e) {}
	}

	/**
	 * Loads the state referenced by the identifier from storage
	 *
	 * @param state The identifier of the state that should be loaded
	 * @returns the state that has been loaded
	 */
	public load() {
		try {
			let loadedState = JSON.parse(
				sessionStorage.getItem(
					'DataTables_stateRestore_'+this.s.identifier+'_'+location.pathname,
				)
			);
			console.log('load', this.s.identifier, loadedState);

			if (loadedState === null) {
				return;
			}

			let settings = this.s.dt.settings()[0];

			if (settings.aoColumns && settings.aoColumns.length !== loadedState.columns.length) {
				return;
			}

			settings.oLoadedState = $.extend(true, {}, loadedState);

			// Order
			if (loadedState.order !== undefined) {
				settings.aaSorting = [];
				$.each(loadedState.order, function(i, col) {
					settings.aaSorting.push(col[0] >= settings.aoColumns.length ?
						[ 0, col[1] ] :
						col
					);
				});
			}

			// Search
			if (loadedState.search !== undefined) {
				$.extend(settings.oPreviousSearch, this.searchToHung(loadedState.search));
			}

			// Columns
			if (loadedState.columns) {
				for (let i=0, ien=loadedState.columns.length ; i<ien ; i++) {
					let col = loadedState.columns[i];

					// Visibility
					if (col.visible !== undefined) {
						settings.aoColumns[i].bVisible = col.visible;
					}

					// Search
					if (col.search !== undefined) {
						$.extend(settings.aoPreSearchCols[i], this.searchToHung(col.search));
					}
				}
			}

			// SearchBuilder
			if (loadedState.searchBuilder) {
				this.s.dt.searchBuilder.rebuild(loadedState.searchBuilder);
			}

			// SearchPanes
			if (loadedState.searchPanes) {
				this.s.dt.context[0]._searchPanes.s.selectionList = loadedState.searchPanes.selectionList;
				this.s.dt.context[0]._searchPanes.s.panes = loadedState.searchPanes.panes;
				this.s.dt.searchPanes.rebuildPane(false, true);
			}

			// ColReorder
			if (loadedState.ColReorder) {
				this.s.dt.colReorder.order(loadedState.ColReorder, true);
			}

			// Scroller
			if (loadedState.scroller) {
				this.s.dt.scroller.toPosition(loadedState.scroller.topRow);
			}

			this.s.dt.draw();
		}
		catch (e) {
			return {};
		}
	}

	/**
	 * Displays a confirmation modal for the user to confirm their action
	 *
	 * @param message The message that should be displayed within the confirmation modal.
	 * @param buttonText The text that should be displayed in the confirmation button.
	 * @param buttonAction The action that should be taken when the confirmation button is pressed.
	 */
	private confirmationModal(message, buttonText, buttonAction) {
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

		$('button.'+this.classes.confirmationButton).one('click', () => {
			buttonAction();
			this.dom.background.remove();
			this.dom.confirmation.remove();
		});

		$('div.'+this.classes.background).one('click', (event) => {
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
	private renameModal(message, buttonText, buttonAction) {
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

		$('button.'+this.classes.confirmationButton).one('click', () => {
			buttonAction($('input.'+this.classes.input).val());
			this.dom.background.remove();
			this.dom.confirmation.remove();
		});

		$('div.'+this.classes.background).one('click', (event) => {
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
	private searchToHung(obj) {
		return {
			bCaseInsensitive: obj.caseInsensitive,
			bRegex:           obj.regex,
			bSmart:           obj.smart,
			sSearch:          obj.search
		};
	}
}
