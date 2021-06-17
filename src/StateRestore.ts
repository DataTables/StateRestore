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
		dtButton: 'dt-button'
	};

	private static defaults = {
		delete: true,
		load: true,
		save: true,
	};

	public classes;
	public dom;
	public c;
	public s;

	public constructor(settings, opts) {
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
			dt: table
		};

		this.dom = {
			background: $('<div class="'+this.classes.background+'"/>'),
			confirmation: $('<div class="'+this.classes.confirmation+'"/>')
		};

		if (table.settings()[0]._stateRestore !== undefined) {
			return;
		}

		table.settings()[0]._stateRestore = this;

		return this;
	}

	public delete(state) {
		try {
			this.confirmationModal(
				"Are you sure you want to delete this state?",
				"Delete",
				function(){
					sessionStorage.removeItem(
						'DataTables_stateRestore'+state+'_'+location.pathname
					);
					console.log("delete" + state)
				}
			);
		}
		catch (e) {};
	}

	public save(state) {
		this.s.dt.state.save();
		let savedState = this.s.dt.state();
		savedState.stateRestore = {
			state
		};
		console.log("save", state, savedState);

		try {
			sessionStorage.setItem(
				'DataTables_stateRestore'+state+'_'+location.pathname,
				JSON.stringify(savedState)
			);
		}
		catch (e) {};
	}

	public load(state) {
		try {
			let loadedState = JSON.parse(
				sessionStorage.getItem(
					'DataTables_stateRestore'+state+'_'+location.pathname,
				)
			);
			console.log("load", state, loadedState);

			if(loadedState === null) {
				return;
			}

			let settings = this.s.dt.settings()[0];

			if(settings.aoColumns && settings.aoColumns.length !== loadedState.columns.length) {
				return;
			}

			settings.oLoadedState = $.extend(true, {}, loadedState);

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

			this.s.dt.draw();
		}
		catch (e) {
			return {};
		}
	}

	private confirmationModal(message, buttonText, buttonAction) {
		console.log(message)
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
		console.log("appended to body")
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
