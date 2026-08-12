import DataTable, {
	Api,
	Context,
	Dom,
	State as DTState,
	util
} from 'datatables.net';
import { Checkbox, Classes, Defaults, Settings, State } from './interface';
import stateManipulators from './manipulators';

// Sanity check
if (!DataTable || !DataTable.versionCheck || !DataTable.versionCheck('3')) {
	throw 'DataTables StateRestore requires DataTables 3 or newer';
}

export default class States {
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Statics
	 */
	public static classes: Classes = {
		field: {
			container: 'dtsb-field',
			label: 'dtsb-field-label',
			value: 'dtsb-field-value',
			input: 'dtsb-field-input'
		}
	};

	public static defaults: Defaults = {
		ajax: null,
		defaults: true,
		include: {
			cardView: true,
			columnVisibility: true,
			columnSearch: true,
			columnControl: true,
			columnOrder: true,
			order: true,
			paging: false,
			scroller: false,
			search: true,
			searchBuilder: true,
			searchPanes: true,
			select: false
		},
		name: null,
		newName: 'State #',
		sharing: true
	};

	public static modalClose() {
		Dom.s('div.dtsb-modal').remove();
		Dom.s('div.dtsb-modal-background').remove();
	}

	public static modal(
		title: string,
		body: Dom,
		btnText: string,
		callback: Function
	) {
		let modal = Dom.c('div').classAdd('dtsb-modal');

		let saveButton = Dom.c('button')
			.classAdd('dst-modal-button')
			.text(btnText)
			.on('click', e => {
				let result = callback();

				if (result) {
					// TODO - Not sure about this here. What if the Ajax call
					// fails? Might be best waiting until that is completed.
					States.modalClose();
				}
			});

		let closeButton = Dom.c('button')
			.classAdd('dtsb-modal-close')
			.attr('type', 'button')
			.html('&times;')
			.on('click', () => {
				States.modalClose();
			});

		modal
			.append(
				Dom.c('div')
					.classAdd('dtsb-modal-header')
					.text(title)
					.append(closeButton)
			)
			.append(Dom.c('div').classAdd('dtsb-modal-body').append(body))
			.append(
				Dom.c('div').classAdd('dtsb-modal-footer').append(saveButton)
			)
			.appendTo('body');

		Dom.c('div')
			.classAdd('dtsb-modal-background')
			.on('click', () => {
				States.modalClose();
			})
			.appendTo('body');
	}

	public static manipulators = stateManipulators;

	public static version = '2.0.0-dev';

	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Properties
	 */
	private c: Defaults;
	private s: Settings;
	private classes: Classes;

	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Public methods
	 */

	/**
	 * Add a new state to the collection but taking the state object to be saved
	 * (this will most likely come from `table.state()`), showing a modal to
	 * allow customisation of it (name and which properties to include), then
	 * eventually adding it to the collection.
	 */
	public add(state: DTState) {
		this._modal(
			this.s.dt.i18n('stateRestore.title.create', 'Save new state'),
			{
				id: null,
				isDefault: false,
				isSharedIn: false,
				isSharedOut: false,
				name: this._nextName(),
				state: state
			},
			state => {
				this.s.store.push(state);
				States.modalClose();
			}
		);
	}

	/**
	 * Update a state's properties
	 *
	 * @param state State object to update
	 */
	public update(state: State) {
		let idx = this.s.store.indexOf(state);

		if (idx !== -1) {
			this._modal(
				this.s.dt.i18n(
					'stateRestore.title.update',
					'Update state options'
				),
				this.s.store[idx],
				state => {
					States.modalClose();
				}
			);
		}
	}

	/**
	 * Remove a state from the store
	 *
	 * @param state State object to remove
	 */
	public remove(state: State) {
		let idx = this.s.store.indexOf(state);

		// TODO need confirmation modal

		if (idx !== -1) {
			this.s.store.splice(idx, 1);
		}
	}

	/**
	 * Get the states stored for this table / instance
	 *
	 * @returns Array of states
	 */
	public store() {
		return this.s.store;
	}

	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Constructor
	 */

	constructor(host: Context | Api) {
		let dt = new DataTable.Api(host);
		let opts = dt.init().stateRestore;

		this.c = util.object.assignDeep(
			{},
			States.defaults,
			DataTable.defaults.stateRestore,
			opts
		);

		this.s = {
			dt: dt,
			store: []
		};

		this.classes = util.object.assignDeep({}, States.classes);

		let settings = this.s.dt.settings()[0];

		// Check if responsive has already been initialised on this table
		if (settings._states) {
			return;
		}

		settings._states = this;
		this._init();
	}

	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Private methods
	 */

	private _init() {}

	/**
	 * Display an editing field
	 *
	 * @param label Field label
	 * @param name Name for the input
	 * @param value Value for the input
	 * @param type Input type
	 * @returns The DOM instance containing the element
	 */
	private _field(
		label: string,
		name: string,
		value: any,
		type: 'text' | 'checkbox' = 'text'
	): Dom {
		let classes = this.classes.field;

		let field = Dom.c('div').classAdd(classes.container);

		Dom.c('label').classAdd(classes.label).text(label).appendTo(field);

		let inputContainer = Dom.c('div')
			.classAdd(classes.value)
			.appendTo(field);

		if (type === 'text') {
			Dom.c('input')
				.attr('type', 'text')
				.attr('name', name)
				.attr('autocomplete', 'off')
				.val(value)
				.classAdd(classes.input)
				.appendTo(inputContainer);
		}
		else if (type === 'checkbox') {
			Dom.c('input')
				.attr('type', 'checkbox')
				.attr('name', name)
				.prop('checked', value)
				.classAdd(classes.input)
				.appendTo(inputContainer);
		}

		return field;
	}

	/**
	 * Display a field with checkboxes
	 *
	 * @param label Field label
	 * @param checkboxes Checkboxes for the field
	 * @returns The DOM instance containing the element
	 */
	private _fieldCheckboxes(label: string, checkboxes: Checkbox[]): Dom {
		let classes = this.classes.field;
		let field = Dom.c('div').classAdd(classes.container);

		Dom.c('label').classAdd(classes.label).text(label).appendTo(field);

		let inputContainer = Dom.c('div')
			.classAdd(classes.value)
			.appendTo(field);

		checkboxes.forEach(checkbox => {
			Dom.c('div')
				.appendTo(inputContainer)
				.append(
					Dom.c('input')
						.attr('type', 'checkbox')
						.attr('name', checkbox.name)
						.prop('checked', checkbox.value)
						.classAdd(classes.input)
						.appendTo(inputContainer)
				)
				.append(Dom.c('span').text(checkbox.label));
		});

		return field;
	}

	/**
	 * Show a modal to get the user's options for this state
	 */
	private _modal(title: string, state: State, cb: (s: State) => void) {
		let body = Dom.c('div');
		let dt = this.s.dt;

		body.append(
			this._field(
				dt.i18n('stateRestore.state.name', 'Name:'),
				'name',
				state.name
			)
		);

		if (this.c.defaults) {
			body.append(
				this._field(
					dt.i18n('stateRestore.state.defaults', 'Default:'),
					'default',
					state.isDefault,
					'checkbox'
				)
			);
		}

		if (this.c.sharing) {
			body.append(
				this._field(
					dt.i18n('stateRestore.state.share', 'Share:'),
					'share',
					state.isSharedOut,
					'checkbox'
				)
			);
		}

		// List of options to that the user can toggle
		let checkboxes: Checkbox[] = [];

		for (const [name, manipulator] of Object.entries(stateManipulators)) {
			// null indicates that the user can make the selection themselves
			if (this.c.include[name] === null) {
				checkboxes.push({
					name: name,
					label: manipulator.text(dt),
					value: true
				});
			}
		}

		if (checkboxes.length) {
			// Order the available checkboxes alphabetically
			checkboxes.sort((a, b) => a.name.localeCompare(b.name));

			body.append(
				this._fieldCheckboxes(
					dt.i18n(
						'stateRestore.state.properties',
						'State properties:'
					),
					checkboxes
				)
			);
		}

		// Finally, show the modal
		States.modal(title, body, 'Save', () => {
			// Post process the modal based on the inputs
			return this._modalProcess(state, body, cb);
		});
	}

	/**
	 * Once the end user submits the modal for saving the state, we need to
	 * process it.
	 *
	 * @param state State to update based on the modal input
	 * @param body Dom instance with the form elements
	 * @param cb Callback for when the state has been updated
	 */
	private _modalProcess(state: State, body: Dom, cb: (s: State) => void) {
		let nameInput = body.find('input[name=name]');
		let defaultInput = body.find('input[name=defaults]');
		let shareInput = body.find('input[name=share]');

		if (!nameInput.val()) {
			// TODO show error - name is required
		}
		else {
			state.name = nameInput.val();
		}

		if (defaultInput.length) {
			state.isDefault = defaultInput.prop('checked') as boolean;
		}

		if (shareInput.length) {
			state.isSharedOut = shareInput.prop('checked') as boolean;
		}

		// Work through the list of options and see if they should be included /
		// excluded
		let includes = this.c.include;

		for (const [name, manipulator] of Object.entries(stateManipulators)) {
			if (includes[name] === null) {
				// User selectable, depends on the checkbox state
				if (! body.find(`input[name=""]`).prop('checked')) {
					manipulator.remove(state.state);
				}
			}
			else if (includes[name] === false) {
				// Options specify that the option shouldn't be included
				manipulator.remove(state.state);
			}
		}

		cb(state);
	}

	/**
	 * Determine the default name for the next state (used when creating a new
	 * state).
	 *
	 * @returns New name
	 */
	private _nextName(): string {
		let matcher = new RegExp(
			'^' + this.c.newName.replace('#', '(\\d?)') + '$'
		);
		let found: number[] = [];

		this.s.store.forEach(state => {
			let match = state.name.match(matcher);

			if (match && match[1]) {
				found.push(parseInt(match[1]));
			}
		});

		found.sort((a, b) => b - a);

		let next = !found.length ? '1' : (found[0] + 1).toString();

		return this.c.newName.replace('#', next);
	}
}
