import DataTable, { AjaxOptions, util } from 'datatables.net';
import { State, Storage } from '../interface';

const ajax: Storage = {
	read: function (dt, host) {
		let p = new Promise<State[]>((resolve, reject) => {
			let options = util.object.assignDeep<AjaxOptions>(
				{
					// Ajax properties that could be overridden
					method: 'post',
					dataType: 'json',
					data: {
						action: 'state-read',
						path: window.location.pathname,
						table: dt.table().node().id
					}
				},
				host.ajax(),
				{
					// Ajax properties that can't be overridden
					success: json => {
						if (json.error) {
							reject();
						}
						else {
							let loadedStates = json.data
								.map(s => {
									let state = Object.assign({}, s);

									try {
										state.state = JSON.parse(s.state);
										return state;
									} catch (e) {
										// noop
									}

									return null;
								})
								.filter(s => !!s);

							resolve(loadedStates);
						}
					},
					error: () => {
						host.error('Error in JSON response');
						resolve([]);
					}
				}
			);

			DataTable.ajax(options);
		});

		return p;
	},

	create: function (dt, state, host) {
		let p = new Promise<boolean>((resolve, reject) => {
			if (state.isStatic) {
				// Static states don't get sent to the server-side for storage,
				// so we just need to update the host's storage with the state.
				if (!state.id) {
					state.id = host.randomId();
				}

				host.storeAdd(state);
			}
			else {
				// Non-static (i.e. user) states, do get sent to the server.
				let options = util.object.assignDeep<AjaxOptions>(
					{
						// Ajax properties that could be overridden
						method: 'post',
						dataType: 'json',
						data: {
							action: 'state-create',
							isDefault: state.isDefault,
							isSharedOut: state.isSharedOut,
							name: state.name,
							path: window.location.pathname,
							state: JSON.stringify(state.state),
							table: dt.table().node().id
						}
					},
					host.ajax(),
					{
						// Ajax properties that can't be overridden
						success: json => {
							if (
								!json.error &&
								json.data &&
								json.data.length === 1
							) {
								let state = json.data[0];

								try {
									state.state = JSON.parse(state.state);
									host.storeAdd(state);
									resolve(true);
								} catch (e) {
									resolve(false);
								}
							}
							else {
								resolve(false);
							}
						},
						error: () => {
							host.error('Error in JSON response');
							resolve(false);
						}
					}
				);

				DataTable.ajax(options);
			}
		});

		return p;
	},

	edit: async function (dt, oldState, newState, host) {
		let p = new Promise<boolean>((resolve, reject) => {
			if (oldState.isStatic) {
				// Static states don't get sent to the server-side for storage,
				// so we just need to update the host's storage with the state.
				if (!oldState.id) {
					oldState.id = host.randomId();
				}

				host.storeReplace(oldState, newState);
			}
			else {
				// Non-static (i.e. user) states, do get sent to the server.
				let options = util.object.assignDeep<AjaxOptions>(
					{
						// Ajax properties that could be overridden
						method: 'post',
						dataType: 'json',
						data: {
							action: 'state-edit',
							id: oldState.id,
							isDefault: newState.isDefault,
							isSharedOut: newState.isSharedOut,
							name: newState.name,
							path: window.location.pathname,
							state: JSON.stringify(newState.state),
							table: dt.table().node().id
						}
					},
					host.ajax(),
					{
						// Ajax properties that can't be overridden
						success: json => {
							if (
								!json.error &&
								json.data &&
								json.data.length === 1
							) {
								let state = json.data[0];

								try {
									state.state = JSON.parse(state.state);
									host.storeReplace(oldState, state);
									resolve(true);
								} catch (e) {
									resolve(false);
								}
							}
							else {
								resolve(false);
							}
						},
						error: () => {
							host.error('Error in JSON response');
							resolve(false);
						}
					}
				);

				DataTable.ajax(options);
			}
		});

		return p;
	},

	remove: async function (dt, states, host) {
		let p = new Promise<boolean>((resolve, reject) => {
			// Can only deleted "owned" states
			let ids = states
				.filter(s => !s.isStatic && !s.isSharedIn)
				.map(s => s.id);

			if (ids.length) {
				let options = util.object.assignDeep<AjaxOptions>(
					{
						// Ajax properties that could be overridden
						method: 'post',
						dataType: 'json',
						data: {
							action: 'state-remove',
							ids: ids,
							path: window.location.pathname,
							table: dt.table().node().id
						}
					},
					host.ajax(),
					{
						// Ajax properties that can't be overridden
						success: json => {
							if (!json.error) {
								ids.forEach(id => {
									let state = states.find(s => s.id === id);

									if (state) {
										host.storeRemove(state);
									}
								});
							}
							else {
								host.error(json.error);
							}

							resolve(true);
						},
						error: () => {
							host.error('Error in JSON response');
							resolve(false);
						}
					}
				);

				DataTable.ajax(options);
			}
		});

		return p;
	}
};

export default ajax;
