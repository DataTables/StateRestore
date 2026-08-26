import DataTable, { Api, Dom } from 'datatables.net';
import States from './States';

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

	public display() {
		// Show in the modal
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
		let table = Dom.c('table').classAdd('display');

		let statesDt = new DataTable(table[0], {
			columns: this._columns(states),
			layout: {
				topStart: {
					buttons: this._buttons(states)
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

		hostDt.on('stateRestore', () => {
			statesDt.clear().rows.add(states.storeGet(true).slice()).draw();
		});
	}

	private _buttons(states: States) {
		let buttons: any[] = [
			{
				text: 'Create state',
				action: () => {
					states.add(this.s.hostDt.state());
				}
			}
		];

		// TODO
		// Edit
		// Replace
		// Copy

		buttons.push({
			extend: 'selected',
			text: 'Delete',
			action: () => {
				let state = this.s.statesDt.rows({selected: true} as any).data();

				if (state) {
					this.s.states.remove(state.toArray());
				}
			}
		});

		return buttons;
	}

	private _columns(states: States) {
		let columns: any[] = [
			{
				orderable: false,
				render: (DataTable.render as any).select()
			},
			{
				title: 'Name',
				data: 'name'
			}
		];

		if (states.can('default')) {
			columns.push({
				title: 'Default',
				data: 'isDefault',
				className: 'dt-body-center'
			});
		}

		if (states.can('share')) {
			columns.push({
				title: 'Share',
				data: 'isSharedIn',
				className: 'dt-body-center'
				// TODO rendering for in or out status
			});
		}

		columns.push({
			data: null,
			defaultContent: '<button>Load</button>',
			orderable: false
		});

		return columns;
	}
}
