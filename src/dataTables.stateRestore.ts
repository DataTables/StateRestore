import DataTable, { Api, Dom, Options, util } from 'datatables.net';
import States from './States';

DataTable.ext.buttons.createState = {
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
	text: dt => dt.i18n('stateRestore.button.createState', 'Create new state')
};

DataTable.ext.buttons.savedStates = {
	extend: 'collection',
	action(e: Event, dt: any, node: Dom, config, cb) {
		let states: States = dt.settings()[0]._states;
		let buttons = states.store().map(state => {
			return {
				action: (e, dt) => {
					dt.state(state.state).draw(false);
				},
				popoverTitle: util.escapeHtml(state.name),
				split: [
					{
						text: dt.i18n('stateRestore.button.edit', 'Edit'),
						action: () => {
							states.update(state);
						}
					},
					{
						text: dt.i18n('stateRestore.button.remove', 'Delete'),
						action: () => {
							states.remove(state);
						}
					}
				],
				text: util.escapeHtml(state.name)
			};
		});

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
			let controller = ctx._states as States || new States(ctx);

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
		}
	}
});

DataTable.StateRestore = States;
