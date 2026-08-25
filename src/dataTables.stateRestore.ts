import DataTable, { Api, Dom, Options, util } from 'datatables.net';
import States from './States';

let buttonCounter = 0;

DataTable.ext.buttons.stateCreate = {
	action(e: Event, dt: Api, node: Dom, config: any) {
		let states: States = dt.settings()[0]._states;

		states.add(dt.state());
	},
	init(dt: Api, node: Dom, config: any) {
		let ctx = dt.settings()[0];

		if (!ctx._states) {
			new States(dt);
		}

		if (!ctx._states.canCreate()) {
			this.disable();
		}
	},
	text: dt => dt.i18n('stateRestore.button.createState', 'Create New State')
};

DataTable.ext.buttons.statesRemoveAll = {
	action(e: Event, dt: Api, node: Dom, config: any) {
		let ctx = dt.settings()[0];
		let states = ctx._states;

		// Get all owned states
		let myStates = states.storeGet().filter(s => !s.isSharedIn);

		states.remove(myStates);
	},
	init(dt: Api, node: Dom, config: any) {
		let ctx = dt.settings()[0];

		if (!ctx._states) {
			new States(dt);
		}

		let states = ctx._states;

		dt.on('stateRestore', () => {
			this.enable(states.storeGet().length > 0);
		});

		this.enable(states.storeGet().length > 0);
	},
	text: dt =>
		dt.i18n('stateRestore.button.statesRemoveAll', 'Remove All States')
};

DataTable.ext.buttons.statesList = {
	extend: 'collection',
	action(e: Event, dt: any, node: Dom, config, cb) {
		let states: States = dt.settings()[0]._states;
		let buttons = [];

		if (config.buttons && config.buttons.length) {
			config.buttons.forEach(btn => buttons.push(btn));
		}

		if (states.storeGet(true).length) {
			states.storeGet(true).forEach(state => {
				let namespace = '.dtst-' + buttonCounter++;
				let splits = [];

				// Split buttons
				if (!state.isSharedIn && !state.isStatic) {
					// Edit and delete actions available for buttons which are
					// owned by this user only.
					splits.push({
						text: dt.i18n(
							'stateRestore.button.edit',
							'Edit'
						),
						action: () => {
							states.edit(state);
						}
					});

					splits.push({
						text: dt.i18n('stateRestore.button.replace', 'Replace'),
						action: () => {
							states.edit(state, {state: dt.state()});
						}
					});

					splits.push({
						text: dt.i18n('stateRestore.button.remove', 'Delete'),
						action: () => {
							states.remove(state);
						}
					});
				}
				else {
					// If the state is shared in or static, then we can't edit
					// it, but we do allow it to be copied so that it can then
					// be edited
					if (states.canCreate()) {
						splits.push({
							text: dt.i18n(
								'stateRestore.button.duplicate',
								'Copy'
							),
							action: () => {
								states.add(
									state.state,
									state.name +
										dt.i18n(
											'stateRestore.copyName',
											' (copy)'
										)
								);
							}
						});
					}
				}

				buttons.push({
					action: (e, dt) => {
						dt.state(state.state).draw(false);
					},
					popoverTitle: util.escapeHtml(state.name),
					split: splits,
					init: function (dt) {
						// This is only really needed for a change of state when the
						// dropdown is open, since the dropdown redraws every time
						// it is displayed.
						dt.on('draw' + namespace, () => {
							this.active(states.isCurrent(state.state));
						});

						this.active(states.isCurrent(state.state));
					},
					destroy: function (dt) {
						dt.off('draw' + namespace);
					},
					text: util.escapeHtml(state.name)
				});
			});
		}
		else {
			buttons.push({
				extend: 'spacer',
				text: dt.i18n('stateRestore.button.empty', 'No Saved States'),
				style: 'empty'
			});
		}

		dt.button(node).collectionRebuild(buttons);

		DataTable.ext.buttons.collection.action.call(
			this,
			e,
			dt,
			node,
			config,
			cb
		);
	},
	buttons: [],
	text: dt => dt.i18n('stateRestore.button.savedStates', 'Saved states')
};

// Legacy aliases
DataTable.ext.buttons.createState = DataTable.ext.buttons.stateCreate;
DataTable.ext.buttons.savedStates = DataTable.ext.buttons.statesList;
DataTable.ext.buttons.removeAllStates = DataTable.ext.buttons.statesRemoveAll;

// Attach a listener to the document which listens for DataTables initialisation
// events so we can automatically initialise
Dom.s(document).on('options.dt.stateRestore', function (e, init: Options) {
	if (e.namespace !== 'dt') {
		return;
	}

	if (init.stateRestore || DataTable.defaults.stateRestore) {
		// We need to allow the DataTable to load an initial state, which it
		// does using its `stateSave` feature, so it has to be enabled, and then
		// restored to what the dev wants the value to be, once we've made use
		// of it.
		let initialValue = init.stateSave || DataTable.defaults.stateSave;

		init.stateSave = true;
		init.stateLoadCallback = (ctx, cb) => {
			let controller = (ctx._states as States) || new States(ctx);

			// stateLoadCallback uses the callback if the return from its
			// function is undefined, but it doesn't accept a Promise
			// itself, and we need the function to return before executing the
			// callback, so use a setTimeout
			setTimeout(async () => {
				controller.loaded(() => {
					// Get default
					let def = controller.getDefault();

					// Callback state
					cb(def || {}, true);
				});
			}, 10);

			// Restore state saving feature to dev's selection.
			ctx.features.stateSave = initialValue;
		};
	}
});

/*
 * DT API interface
 */
Api.register('stateRestore.activeStates()', function () {
	let states = this.context[0]._states as States;

	if (!states) {
		return this;
	}

	return states.storeGet().filter(s => states.isCurrent(s.state));
});

Api.register('stateRestore.state.add()', function (name) {
	let states = this.context[0]._states as States;

	if (states) {
		states.add(this.state(), name, false, false);
	}

	return this;
});

Api.register('stateRestore.state()', function (id: string | number) {
	let states = this.context[0]._states as States;

	if (states) {
		this.context[0]._stateSelected = states
			.storeGet()
			.find(s => id === s.id);
	}

	return this;
});

Api.register('stateRestore.state().details()', function () {
	return this.context[0]._stateSelected || null;
});

Api.register('stateRestore.state().load()', function () {
	let selected = this.context[0]._stateSelected;

	if (selected) {
		this.state(selected.state).draw(false);
	}

	return this;
});

Api.register('stateRestore.state().remove()', function (skipConfirm = false) {
	let states = this.context[0]._states as States;
	let selected = this.context[0]._stateSelected;

	if (states && selected) {
		states.remove(selected, skipConfirm);
	}
});

Api.register('stateRestore.state().rename()', function (name: string) {
	let states = this.context[0]._states as States;
	let selected = this.context[0]._stateSelected;

	if (states && selected && name) {
		states.edit(
			selected,
			{
				name
			},
			true
		);
	}

	return this;
});

Api.register('stateRestore.state().edit()', function () {
	let states = this.context[0]._states as States;
	let selected = this.context[0]._stateSelected;

	if (states && selected) {
		states.edit(selected);
	}
});

Api.register('stateRestore.state().save()', function (skipModal = true) {
	let states = this.context[0]._states as States;
	let selected = this.context[0]._stateSelected;

	if (states && selected) {
		states.edit(
			selected,
			{
				state: this.state()
			},
			skipModal
		);
	}
});

Api.register(
	'stateRestore.states()',
	function (idOrIds: string | number | Array<string | number>) {
		let states = this.context[0]._states as States;
		let ids = Array.isArray(idOrIds) ? idOrIds : [idOrIds];

		if (states) {
			this.context[0]._statesSelected = states
				.storeGet()
				.filter(s => ids.includes(s.id));
		}

		return this;
	}
);

Api.register('stateRestore.states().remove()', function (skipConfirm = false) {
	let states = this.context[0]._states as States;
	let selected = this.context[0]._statesSelected;

	if (states && selected) {
		states.remove(selected, skipConfirm);
	}
});

DataTable.StateRestore = States;
