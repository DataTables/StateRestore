import DataTable, {
	Api,
	Context,
	Dom,
	StateLoad as DTState,
	util
} from 'datatables.net';
import { Checkbox, Classes, Defaults, Settings, State } from './interface';
import stateManipulators from './manipulators';
import storageAjax from './storage/ajax';
import storageLocal from './storage/localStorage';

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
			error: 'dtsb-field-error',
			label: 'dtsb-field-label',
			value: 'dtsb-field-value',
			input: 'dtsb-field-input'
		},
		removeMessage: 'dtsb-remove-message'
	};

	public static defaults: Defaults = {
		ajax: null,
		canCreate: true,
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
		sharing: true,
		preDefined: []
	};

	public static modalClose() {
		Dom.s('div.dtsb-modal').remove();
		Dom.s('div.dtsb-modal-background').remove();
	}

	public static modal(
		title: string,
		body: Dom,
		btnText: string,
		submitAction: Function
	) {
		let modal = Dom.c('div').classAdd('dtsb-modal');

		let saveButton = Dom.c('button')
			.classAdd('dtsb-modal-button')
			.text(btnText)
			.on('click', e => {
				submitAction(e);
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
	 *
	 * @param state DataTables state to save
	 * @param name New name
	 */
	public add(
		state: DTState,
		newName: string | null = null,
		isStatic = false,
		isDefault = false
	) {
		if (isStatic) {
			this.s.store.push({
				id: null,
				isDefault,
				isSharedIn: false,
				isSharedOut: false,
				isStatic,
				name: newName || this._nextName(),
				state
			})
		}
		else {
			if (! this.c.canCreate) {
				return;
			}

			this._stateUserInput(
				this.s.dt.i18n('stateRestore.title.create', 'Save new state'),
				{
					id: null,
					isDefault,
					isSharedIn: false,
					isSharedOut: false,
					isStatic,
					name: newName || this._nextName(),
					state
				},
				async state => {
					let result = await this.s.storage.create(
						this.s.dt,
						state,
						this
					);

					if (result) {
						this.s.dt.trigger('stateRestore', ['create', state]);

						States.modalClose();
					}
				}
			);
		}
	}

	/**
	 * Is an end user allowed to create a new state?
	 *
	 * @returns Flag
	 */
	public canCreate() {
		return this.c.canCreate;
	}

	/**
	 * Get the default state
	 *
	 * @returns DataTables state object
	 */
	public getDefault(): DTState | null {
		let state = this.s.store.find(s => s.isDefault);

		return state ? state.state : null;
	}

	/**
	 * Check if a state is currently displayed. Note that a state is considered
	 * to be active if its properties match those for the current state, however
	 * it is not bidirectional - a current state could have additional
	 * properties added to it (e.g. a new extension added) and they would not
	 * be checked.
	 *
	 * @param state The state object to check
	 */
	public isCurrent(state: DTState) {
		// DataTables caches this, so it isn't an expensive call
		let currentState = this.s.dt.state();
		let keys = Object.keys(state);

		for (let i = 0; i < keys.length; i++) {
			let key = keys[i];

			// Ignore time
			if (key === 'time') {
				continue;
			}

			if (!this._isEqual(state[key], currentState[key])) {
				return false;
			}
		}

		return true;
	}

	/**
	 * Execute a function once the states have been loaded (allowing async
	 * loading)
	 *
	 * @param cb Function to execute
	 */
	public loaded(cb: () => void) {
		if (this.s.loading) {
			this.s.whenLoaded.push(cb);
		}
		else {
			cb();
		}
	}

	/**
	 * Update a state's properties
	 *
	 * @param state State object to update
	 */
	public update(state: State) {
		let idx = this.s.store.indexOf(state);

		if (idx !== -1) {
			this._stateUserInput(
				this.s.dt.i18n(
					'stateRestore.title.update',
					'Update state options'
				),
				this.s.store[idx],
				async state => {
					let result = await this.s.storage.update(
						this.s.dt,
						state,
						this
					);

					if (result) {
						this.s.dt.trigger('stateRestore', ['update', state]);

						States.modalClose();
					}
				}
			);
		}
	}

	/**
	 * Remove a state from the store
	 *
	 * @param state State object(s) to remove
	 */
	public remove(stateIn: State | State[]) {
		let states = Array.isArray(stateIn) ? stateIn : [stateIn];

		if (states.length === 0) {
			return;
		}

		let body = Dom.c('div')
			.classAdd(this.classes.removeMessage)
			.text(
				this.s.dt.i18n(
					'stateRestore.message.remove',
					{
						_: 'Are you sure you wish to remove the following states:',
						1: 'Are you sure you wish to remove the following state:'
					},
					states.length
				)
			);
		let ul = Dom.c('ul').appendTo(body);

		states.forEach(s => {
			ul.append(Dom.c('li').text(s.name));
		});

		States.modal(
			this.s.dt.i18n('stateRestore.title.remove', 'Delete state'),
			body,
			this.s.dt.i18n('stateRestore.buttons.remove', 'Delete'),
			async () => {
				let result = await this.s.storage.remove(
					this.s.dt,
					states,
					this
				);

				if (result) {
					this.s.dt.trigger('stateRestore', ['remove']);

					States.modalClose();
				}
			}
		);
	}

	/**
	 * Get the states stored for this table / instance
	 *
	 * @param includeStatics Indicate if static states should be included or not
	 * @returns Array of states
	 */
	public store(includeStatics= false) {
		if (includeStatics) {
			return this.s.store;
		}
		
		return this.s.store.filter(s => !s.isStatic);
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

		// Defaults can only be used if `stateRestore` is in the initialisation
		// options (as that will add the state loader - it won't work without
		// it!)
		if (!opts) {
			this.c.defaults = false;
		}

		// Sharing is only relevant if there is Ajax, since otherwise there is
		// no way to states!
		if (!this.c.ajax) {
			this.c.sharing = false;
		}

		this.s = {
			dt: dt,
			loading: false,
			store: [],
			storage: this.c.ajax ? storageAjax : storageLocal,
			whenLoaded: []
		};

		this.classes = util.object.assignDeep({}, States.classes);

		let settings = this.s.dt.settings()[0];

		// Check if StateRestore has already been initialised on this table
		if (settings._states) {
			return;
		}

		settings._states = this;

		// Add predefined states to the list
		// TODO should accept an object for legacy support
		// TODO need an `xhr` listener for look for a stateRestore object
		this.c.preDefined.forEach(s => {
			this.add(s.state, s.name, true, s.isDefault || false);
		});

		// Initial startup actions
		this._load();
	}

	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Private methods
	 */

	/**
	 * Load states and execute callbacks from `loaded()` when done
	 */
	private async _load() {
		this.s.loading = true;

		// Get the initial states
		let restore = await this.s.storage.read(this.s.dt);

		this.s.store.push(...restore);

		this.s.loading = false;

		this.s.dt.trigger('stateRestore', ['loaded']);

		// Execute callbacks
		this.s.whenLoaded.forEach(w => w());
		this.s.whenLoaded.length = 0;
	}

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

		Dom.c('div').classAdd(classes.error).appendTo(inputContainer);

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
	 * Check values to see if they are equal
	 *
	 * @param a First value
	 * @param b Second value
	 * @returns true if equal, false otherwise
	 */
	private _isEqual(a: any, b: any) {
		// Handles primitives, identical references, and NaN === NaN
		if (Object.is(a, b)) {
			return true;
		}

		// If either isn't an object (or is null), they aren't equal
		if (
			typeof a !== 'object' ||
			a === null ||
			typeof b !== 'object' ||
			b === null
		) {
			return false;
		}

		// Ensure both are arrays or both are standard objects
		if (Array.isArray(a) !== Array.isArray(b)) {
			return false;
		}

		const keysA = Object.keys(a);
		const keysB = Object.keys(b);

		// Mismatched number of keys or array elements
		if (keysA.length !== keysB.length) {
			return false;
		}

		// Recursively compare each key/value pair
		for (const key of keysA) {
			if (
				!Object.prototype.hasOwnProperty.call(b, key) ||
				!this._isEqual(a[key], b[key])
			) {
				return false;
			}
		}

		return true;
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

	/**
	 * Show a modal to get the user's options for this state
	 */
	private _stateUserInput(
		title: string,
		state: State,
		cb: (s: State) => void
	) {
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
			return this._stateUserInputProcess(state, body, cb);
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
	private _stateUserInputProcess(
		state: State,
		body: Dom,
		cb: (s: State) => void
	) {
		let nameInput = body.find('input[name=name]');
		let nameError = nameInput
			.parent()
			.find('div.' + this.classes.field.error);
		let defaultInput = body.find('input[name=default]');
		let shareInput = body.find('input[name=share]');

		if (!nameInput.val()) {
			// Show error - name is required
			nameError.text(
				this.s.dt.i18n(
					'stateRestore.state.required',
					'A name is required for the state'
				)
			);

			return;
		}
		else {
			state.name = nameInput.val();
			nameError.empty();
		}

		if (defaultInput.length) {
			state.isDefault = defaultInput.prop('checked') as boolean;

			// If this is the default, no other state can be
			if (state.isDefault) {
				this.s.store
					.filter(s => s !== state)
					.forEach(s => (s.isDefault = false));
			}
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
				if (!body.find(`input[name=""]`).prop('checked')) {
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
}
