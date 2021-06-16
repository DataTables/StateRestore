let $;
let dataTable;

export function setJQuery(jq) {
	$ = jq;
	dataTable = jq.fn.dataTable;
}

export default class StateRestore {
	private static version = '0.0.1';

	private static classes = {

	};

	private static defaults = {
		delete: true,
		load: true,
		save: true,
	};

	public classes;
	public dom;
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
		this.classes = $.extend(true, {}, StateRestore.classes);

		// Get options from user
		this.c = $.extend(true, {}, StateRestore.defaults, opts);

		this.s = {
			dt: table
		};

		if (table.settings()[0]._stateRestore !== undefined) {
			return;
		}

		table.settings()[0]._stateRestore = this;

		this.s.dt.button().add(0, {
			config: {
				state: 1,
				stateRestore: this
			},
			extend: 'stateRestore',
			split: [
				{
					config: {
						state: 1,
						stateRestore: this
					},
					extend: 'saveState',
				},
				{
					config: {
						state: 1,
						stateRestore: this
					},
					extend: 'deleteState',
				},
			]
		});

		return this;
	}

	public delete(state) {
		console.log("delete", state);
	}

	public save(state) {
		console.log("save", state);
	}

	public load(state) {
		console.log("load", state);
	}
}
