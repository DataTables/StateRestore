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

	public addState(identifier) {
		let state = this.getState(identifier);
		if(state === null) {
			let newState = new StateRestore(this.s.dt.settings()[0], this.c, identifier);
			this.s.states.push(newState);
			return newState;
		}
		else {
			return state;
		}
	}

	public getState(identifier) {
		for (let state of this.s.states) {
			if (state.s.identifier === identifier) {
				return state;
			}
		}
		return null;
	}

	public getStates(identifier) {
		if(identifier === undefined) {
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

	private _searchForStates() {
		let keys = Object.keys(sessionStorage);
		for(let key of keys) {
			if(key.match(new RegExp("^DataTables_stateRestore_.*_"+location.pathname.replace(/\//g, "\/")+"$"))) {
				let loadedState = JSON.parse(
					sessionStorage.getItem(
						key
					)
				);
				let newState = new StateRestore(this.s.dt, this.c, loadedState.stateRestore.state);
				newState.s.savedState = loadedState;
				this.s.states.push(newState);
			}
		}
	}
}
