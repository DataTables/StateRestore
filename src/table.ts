import DataTable, { Api, Dom } from 'datatables.net';
import States from './States';
import icons from './icons';

// Quite a few `any`s in this file, as Select is not a dependency of
// StateRestore as a whole, but is for this view of the states.

export default function setup(dt: Api, hostButton: Dom) {
	let ctx = dt.settings()[0];

	if (!(DataTable as any).select) {
		throw new Error(
			"The Select extension is required for StateRestore's table view"
		);
	}

	if (!ctx._statesTable) {
		ctx._statesTable = new StateTable(dt, hostButton);
	}

	ctx._statesTable.display();
}

export class StateTable {
	private s: {
		hostButton: Dom;
		states: States;
		statesDt: Api;
		hostDt: Api;
	};

	/**
	 * Show the table in a States modal
	 */
	public display() {
		this.s.states.modal(
			'Saved states',
			Dom.s(this.s.statesDt.table().container()),
			true
		);
	}

	constructor(hostDt, hostButton) {
		let ctx = hostDt.settings()[0];

		if (!ctx._states) {
			new States(hostDt);
		}

		let states = ctx._states;
		let table = Dom.c('table').classAdd(States.classes.table.table);

		let statesDt = new DataTable(table[0], {
			columns: this._columns(states),
			layout: {
				topStart: {
					buttons: this._buttons(states, hostDt)
				}
			},
			paging: false,
			select: {
				style: 'os',
				selector: 'td:first-child'
			},
			order: [[1, 'asc']],
			scrollY: 300,
			scrollCollapse: true,
			rowId: 'id',
			language: {
				// TODO should extend from the host table
				entries: {
					_: 'states',
					1: 'state'
				}
			}
		} as any);

		this.s = {
			hostButton,
			hostDt,
			states,
			statesDt
		};

		// Load button event handler
		statesDt.on('click', 'tbody button', function () {
			let row = statesDt.row(this.closest('tr')).data();

			hostDt.state(row.state).draw(false);
		});

		states.loaded(() => {
			statesDt.clear().rows.add(states.storeGet(true).slice()).draw();
		});

		hostDt
			.on('stateRestore', () => {
				// When the states change, we just redraw completely
				statesDt.clear().rows.add(states.storeGet(true).slice()).draw();
			})
			.on('draw', () => {
				// Update for the "current" state indicator
				statesDt.rows().invalidate().draw();
			});
	}

	/**
	 * Create the list of buttons
	 *
	 * @param states Host states instance
	 * @param hostDt Host DataTable
	 * @returns Array of buttons
	 */
	private _buttons(states: States, hostDt: Api) {
		// Create button is always active
		let buttons: any[] = [];

		if (states.can('create')) {
			// Create button is always enabled if available
			buttons.push({
				text: hostDt.i18n('stateRestore.button.create', 'Create state'),
				action: () => {
					states.add(hostDt.state());
				}
			});
		}

		// A common action between buttons is to get the state, and moreover,
		// the actions can typically only be performed on states the user owns.
		let selectedData = (own: boolean) => {
			let selected = this.s.statesDt
				.rows({ selected: true } as any)
				.data()
				.toArray();

			return own
				? selected.filter(s => !s.isSharedIn && !s.isStatic)
				: selected;
		};

		// Edit button - only enable for a single state, and one which the user
		// can actually edit
		buttons.push({
			text: hostDt.i18n('stateRestore.button.edit', 'Edit'),
			action: () => {
				this.s.states.edit(selectedData(true)[0]);
			},
			init: function (dt) {
				this.disable();

				dt.on('select deselect', () => {
					this.enable(selectedData(true).length === 1);
				});
			}
		});

		// Replace button - same as edit
		buttons.push({
			extend: 'selectedSingle',
			text: hostDt.i18n('stateRestore.button.replace', 'Replace'),
			action: () => {
				let state = selectedData(true)[0];

				states.edit(state, { state: this.s.statesDt.state() });
			},
			init: function (dt) {
				this.disable();

				dt.on('select deselect', () => {
					this.enable(selectedData(true).length === 1);
				});
			}
		});

		// Copy button - any row can be copied (allowing it here in the table,
		// while the list view doesn't have a duplicate for one's own states)
		buttons.push({
			extend: 'selectedSingle',
			text: hostDt.i18n('stateRestore.button.duplicate', 'Copy'),
			action: () => {
				let state = selectedData(true)[0];

				states.add(
					state.state,
					state.name + hostDt.i18n('stateRestore.copyName', ' (copy)')
				);
			}
		});

		// Delete button - can only delete one's own states
		buttons.push({
			text: hostDt.i18n('stateRestore.button.remove', 'Delete'),
			action: () => {
				let state = selectedData(true);

				this.s.states.remove(state);
			},
			init: function (dt) {
				this.disable();

				dt.on('select deselect', () => {
					this.enable(selectedData(true).length !== 0);
				});
			}
		});

		return buttons;
	}

	/**
	 * Define the columns for the DataTable
	 *
	 * @param states Host states instance
	 * @returns Column array
	 */
	private _columns(states: States) {
		let columns: any[] = [
			{
				orderable: false,
				render: (DataTable.render as any).select()
			},
			{
				title: 'Name',
				data: 'name'
			},
			{
				title: 'Active',
				data: null,
				className: 'dt-center',
				render: data => (states.isCurrent(data.state) ? icons.tick : '')
			}
		];

		if (states.can('default')) {
			columns.push({
				title: 'Default',
				data: 'isDefault',
				className: 'dt-center',
				render: data => (data ? icons.tick : '')
			});
		}

		if (states.can('share')) {
			columns.push({
				title: 'Share',
				data: null,
				className: 'dt-center',
				render: data => {
					if (data.isSharedIn) {
						return icons.shareIn;
					}
					else if (data.isSharedOut) {
						return icons.shareOut;
					}

					return '';
				}
			});
		}

		columns.push({
			data: null,
			defaultContent:
				'<button class="' +
				States.classes.table.button +
				'">Load</button>',
			orderable: false
		});

		return columns;
	}
}
