import { Api } from 'datatables.net';
import { State, Storage } from '../interface';

function localStorageName(dt: Api) {
	return 'dtsr-' + location.pathname + '-' + dt.table().node().id;
}

/**
 * localStorage base for StateRestore. Really basic, the write actions just
 * write all states to the store.
 */
const local: Storage = {
	read: async function (dt) {
		let name = localStorageName(dt);
		let stored = localStorage.getItem(name);

		if (stored) {
			try {
				return JSON.parse(stored) as State[];
			} catch (e) {
				return [];
			}
		}

		// v1 compatibility - check if there are states from v1
		let states: State[] = [];
		var keys = Object.keys(localStorage);

		keys.forEach(key => {
			// Check if the key belongs to this page / table
			if (
				key.startsWith('DataTables_stateRestore_') &&
				(key.endsWith(location.pathname) ||
					key.endsWith(
						location.pathname + '_' + dt.table().node().id
					))
			) {
				try {
					let loadedState = JSON.parse(localStorage.getItem(key)!);

					states.push({
						id: null,
						isDefault: false,
						isSharedIn: false,
						isSharedOut: false,
						isStatic: false,
						name: key
							.replace(/^DataTables_stateRestore_/, '')
							.replace(location.pathname, ''),
						state: loadedState
					});
				} catch (e) {
					// noop
				}
			}
		});

		return states;
	},

	create: async function (dt, state, host) {
		if (!state.id) {
			// Create a random uid to act as the id for a local state
			state.id = host.randomId();
		}

		host.storeAdd(state);

		localStorage.setItem(
			localStorageName(dt),
			JSON.stringify(host.storeGet())
		);

		return true;
	},

	edit: async function (dt, oldState, newState, host) {
		host.storeReplace(oldState, newState);

		if (!oldState.isStatic) {
			localStorage.setItem(
				localStorageName(dt),
				JSON.stringify(host.storeGet())
			);
		}

		return true;
	},

	remove: async function (dt, states, host) {
		for (let i = 0; i < states.length; i++) {
			host.storeRemove(states[i]);
		}

		localStorage.setItem(
			localStorageName(dt),
			JSON.stringify(host.storeGet())
		);

		return true;
	}
};

export default local;
