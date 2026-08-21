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
	},
	text: dt => dt.i18n('stateRestore.button.createState', 'Create New State')
};

DataTable.ext.buttons.statesRemoveAll = {
	action(e: Event, dt: Api, node: Dom, config: any) {
		let ctx = dt.settings()[0];
		let states = ctx._states;

		// Get all owned states
		let myStates = states.store().filter(s => !s.isSharedIn);

		states.remove(myStates);
	},
	init(dt: Api, node: Dom, config: any) {
		let ctx = dt.settings()[0];

		if (!ctx._states) {
			new States(dt);
		}

		let states = ctx._states;

		dt.on('stateRestore', () => {
			this.enable(states.store().length > 0);
		});

		this.enable(states.store().length > 0);
	},
	text: dt =>
		dt.i18n('stateRestore.button.statesRemoveAll', 'Remove All States')
};

DataTable.ext.buttons.states = {
	extend: 'collection',
	action(e: Event, dt: any, node: Dom, config, cb) {
		let states: States = dt.settings()[0]._states;
		let buttons = [];

		if (config.buttons && config.buttons.length) {
			config.buttons.forEach(btn => buttons.push(btn));
		}
		
		if (states.store().length) {
			states.store().forEach(state => {
				let namespace = '.dtst-' + buttonCounter++;

				buttons.push({
					action: (e, dt) => {
						dt.state(state.state).draw(false);
					},
					popoverTitle: util.escapeHtml(state.name),
					split: [
						// TODO duplicate button for isSharedIn
						{
							// TODO this should only be shown if !isSharedIn
							text: dt.i18n('stateRestore.button.edit', 'Edit'),
							action: () => {
								states.update(state);
							}
						},
						{
							// TODO this should only be shown if !isSharedIn
							text: dt.i18n('stateRestore.button.remove', 'Delete'),
							action: () => {
								states.remove(state);
							}
						}
					],
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
DataTable.ext.buttons.savedStates = DataTable.ext.buttons.states;
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

DataTable.StateRestore = States;
