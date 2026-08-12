import DataTable, { Api, Dom, util } from 'datatables.net';
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

DataTable.StateRestore = States;
