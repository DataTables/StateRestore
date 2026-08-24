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

	create: async function (dt, state, states) {
		let store = states.store();

		store.push(state);

		localStorage.setItem(localStorageName(dt), JSON.stringify(store));

		return true;
	},

	update: async function (dt, state, states) {
		if (!state.isStatic) {
			// The state is updated in place, so we can just store it
			localStorage.setItem(
				localStorageName(dt),
				JSON.stringify(states.store())
			);
		}

		return true;
	},

	remove: async function (dt, states, host) {
		let store = host.store();

		for (let i = 0; i < states.length; i++) {
			if (states[i].isStatic) {
				continue;
			}

			let idx = store.indexOf(states[i]);

			if (idx !== -1) {
				store.splice(idx, 1);
			}
		}

		localStorage.setItem(localStorageName(dt), JSON.stringify(store));

		return true;
	}
};

export default local;
