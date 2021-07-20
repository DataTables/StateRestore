let $;
let dataTable;

import StateRestore from './StateRestore';

export function setJQuery(jq) {
	$ = jq;
	dataTable = jq.fn.dataTable;
}

export interface IClasses {
	emptyStates: string;
}

export interface IDefaults {
	colReorder: boolean;
	columns: IColumnDefault | boolean;
	create: boolean;
	delete: boolean;
	i18n: II18n;
	order: boolean;
	paging: boolean;
	rename: boolean;
	save: boolean;
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

	private static classes = {
		emptyStates: 'dtsr-emptyStates'
	};

	private static defaults: IDefaults = {
		colReorder: true,
		columns: {
			search: true,
			visible: true
		},
		create: true,
		delete: true,
		i18n: {
			deleteButton: 'Delete',
			deleteConfirm: 'Are you sure you want to delete this state?',
			emptyStates: 'No saved states',
			renameButton: 'Rename',
			renameLabel: 'New Name:'
		},
		order: true,
		paging: true,
		rename: true,
		save: true,
		scroller: true,
		search: true,
		searchBuilder: true,
		searchPanes: true
	};

	public classes: IClasses;
	public c: IDefaults;
	public s: IS;

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
	public addState(identifier: string): StateRestore {
		// If creation/saving is not allowed then return
		if (!this.c.create || !this.c.save) {
			return;
		}

		// Check if the state exists before creating a new ones
		let state = this.getState(identifier);

		if (state === null) {
			let newState = new StateRestore(this.s.dt.settings()[0], this.c, identifier);
			newState.dom.confirmation.on('dtsr-delete', () => this._deleteCallback(identifier));
			newState.dom.confirmation.on('dtsr-rename', () => this._collectionRebuild());
			this.s.states.push(newState);
			this._collectionRebuild();

			return newState;
		}

		return state;
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
