let $;
let dataTable;

import StateRestore from './StateRestore';

export function setJQuery(jq) {
	$ = jq;
	dataTable = jq.fn.dataTable;
}

export default class StateRestoreCollection {
	private static version = '0.0.1';

	private static defaults = {

	};

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
	public addState(identifier) {
		// Check if the state exists before creating a new ones
		let state = this.getState(identifier);
		if (state === null) {
			let newState = new StateRestore(this.s.dt.settings()[0], this.c, identifier);
			newState.dom.confirmation.on('dtsr-delete', () => this._deleteCallback(identifier));
			this.s.states.push(newState);

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
	public getState(identifier) {
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
	public getStates(identifier) {
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
	private _searchForStates() {
		let keys = Object.keys(sessionStorage);
		for (let key of keys) {
			// eslint-disable-next-line no-useless-escape
			if (key.match(new RegExp('^DataTables_stateRestore_.*_'+location.pathname.replace(/\//g, '\/')+'$'))) {
				let loadedState = JSON.parse(sessionStorage.getItem(key));
				let newState = new StateRestore(this.s.dt, this.c, loadedState.stateRestore.state);
				newState.s.savedState = loadedState;
				this.s.states.push(newState);
				newState.dom.confirmation.on('dtsr-delete', () => this._deleteCallback(loadedState.stateRestore.state));
			}
		}
	}

	/**
	 * This callback is called when a state is deleted.
	 * This removes the state from storage and also strips it's button from the container
	 *
	 * @param identifier The value that is used to identify a state
	 */
	private _deleteCallback(identifier) {
		for (let i = 0; i < this.s.states.length; i++) {
			if (this.s.states[i].s.savedState.stateRestore.state === identifier) {
				this.s.states.splice(i, 1);
				i--;
			}
		}

		let stateButtons = [];

		for (let remainingState of this.s.states) {
			stateButtons.push({
				_stateRestore: remainingState,
				config: {
					split: ['saveState', 'deleteState'],
				},
				extend: 'stateRestore',
				text: remainingState.s.savedState.stateRestore.state
			});
		}

		this.s.dt.button('SaveStateRestore:name').collectionRebuild(stateButtons);
	}
}
