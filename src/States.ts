import DataTable, {
	Api,
	Context,
	Dom,
	StateLoad as DTState,
	util
} from 'datatables.net';
import {
	Checkbox,
	Classes,
	Defaults,
	Predefined,
	Settings,
	State
} from './interface';
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
			info: 'dtsb-field-info',
			label: 'dtsb-field-label',
			value: 'dtsb-field-value',
			input: 'dtsb-field-input'
		},
		modal: {
			wide: 'dtsb-modal_wide'
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
			pageStart: false,
			pageLength: true,
			scroller: false,
			search: true,
			searchBuilder: true,
			searchPanes: true,
			select: false
		},
		newName: null,
		sharing: true,
		predefined: []
	};

	public static modalClose() {
		Dom.s(document).off('keyup.dtsr');

		Dom.s('div.dtsb-modal').remove();
		Dom.s('div.dtsb-modal-background').remove();
	}

	public static modal(
		title: string,
		body: Dom,
		className: string,
		close: () => void
	) {
		let modal = Dom.c('div').classAdd('dtsb-modal').classAdd(className);
		let closeButton = Dom.c('button')
			.classAdd('dtsb-modal-close')
			.attr('type', 'button')
			.html('&times;')
			.on('click', () => {
				close();
			});

		// Esc will close and cancel the modal
		Dom.s(document).on('keyup.dtsr', e => {
			e.stopPropagation();

			if (e.keyCode === 27) {
				close();
			}
		});

		modal
			.append(
				Dom.c('div')
					.classAdd('dtsb-modal-header')
					.text(title)
					.append(closeButton)
			)
			.append(Dom.c('div').classAdd('dtsb-modal-body').append(body))
			.appendTo('body');

		Dom.c('div')
			.classAdd('dtsb-modal-background')
			.on('click', () => {
				close();
			})
			.appendTo('body');

		// Initial focus
		modal
			.find('input, button')
			.filter(':not(.dtsb-modal-close)')
			.eq(0)
			.focus();
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
			});
		}
		else {
			if (!this.c.canCreate) {
				return;
			}

			this._stateUserInput(
				this.s.dt.i18n('stateRestore.create.title', 'Save new state'),
				this.s.dt.i18n('stateRestore.create.info', ''),
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

						this.modalClose();
					}
				}
			);
		}
	}

	/**
	 * Is an end user allowed to perform a particular action
	 *
	 * @returns Flag
	 */
	public can(action: 'create' | 'default' | 'share') {
		switch (action) {
			case 'create':
				return this.c.canCreate;

			case 'default':
				return this.c.defaults;

			case 'share':
				return this.c.sharing;

			default:
				return false;
		}
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
	 * Edit a state's properties. Can be used to replace a state if a new state
	 * object is passed in with the `state` property set.
	 *
	 * @param oldState State object to update
	 */
	public edit(oldState: State, newState?: Partial<State>, skipModal = false) {
		let idx = this.s.store.indexOf(oldState);

		if (idx !== -1) {
			// We need a copy of the object, in case it is rejected by an error
			// - i.e. we don't want to mutate the original object.
			let copy = util.object.assignDeep<State>({}, oldState);
			let title = this.s.dt.i18n('stateRestore.edit.title', 'Edit state');
			let info = this.s.dt.i18n('stateRestore.edit.info', '');

			if (newState && newState.state) {
				title = this.s.dt.i18n(
					'stateRestore.replace.title',
					'Replace state'
				);
				info = this.s.dt.i18n(
					'stateRestore.replace.info',
					"Replace the currently saved state with the table's current state."
				);
			}

			// Shallow copy to allow partial input
			util.object.assign(copy, newState);

			this._stateUserInput(title, info, copy, async state => {
				let result = await this.s.storage.edit(
					this.s.dt,
					oldState,
					state,
					this
				);

				if (result) {
					this.s.dt.trigger('stateRestore', ['edit', state]);

					this.modalClose();
				}
			});
		}
	}

	/**
	 * Display a modal, allowing for layering, so a modal can have an action
	 * that will display an "inner" modal, but uses the same modal display,
	 * and then allows it to be returned to.
	 *
	 * @param title Modal title
	 * @param body Element to show in the modal body
	 * @param wide Indicate if the modal should be wide
	 */
	public modal(title: string, body: Dom, wide = false) {
		// Add the modal to the layers, so we can restore to it if needed
		this.s.modalLayers.push({
			title,
			body,
			wide
		});

		// Remove any existing modal
		States.modalClose();

		// And display
		States.modal(title, body, wide ? this.classes.modal.wide : '', () => {
			this.modalClose();
		});
	}

	/**
	 * Close a modal and if there are any layered above it, display them.
	 */
	public modalClose() {
		// Tidy up from the last modal
		States.modalClose();

		// Pop off the last state
		this.s.modalLayers.pop();

		// And if there are any left, then we need to display them again
		if (this.s.modalLayers.length) {
			let layer = this.s.modalLayers[this.s.modalLayers.length - 1];

			States.modal(
				layer.title,
				layer.body,
				layer.wide ? this.classes.modal.wide : '',
				() => {
					this.modalClose();
				}
			);
		}
	}

	/**
	 * Remove a state from the store
	 *
	 * @param state State object(s) to remove
	 */
	public remove(stateIn: State | State[], skipConfirm = false) {
		let states = Array.isArray(stateIn) ? stateIn : [stateIn];

		if (states.length === 0) {
			return;
		}
		else if (skipConfirm) {
			this.s.storage.remove(this.s.dt, states, this);
		}
		else {
			let body = Dom.c('div')
				.classAdd(this.classes.removeMessage)
				.text(
					this.s.dt.i18n(
						'stateRestore.remove.message',
						{
							_: 'Are you sure you wish to remove the following states:',
							1: 'Are you sure you wish to remove the following state:'
						},
						states.length
					)
				);
			let form = Dom.c<HTMLFormElement>('form').appendTo(body);
			let ul = Dom.c('ul').appendTo(form);

			states.forEach(s => {
				ul.append(Dom.c('li').text(s.name));
			});

			form.append(
				this._submitButton(
					this.s.dt.i18n('stateRestore.remove.button', 'Delete')
				)
			);

			// Event handler for the submission
			form.on('submit', async e => {
				e.preventDefault();
				e.stopPropagation();

				let result = await this.s.storage.remove(
					this.s.dt,
					states,
					this
				);

				if (result) {
					this.s.dt.trigger('stateRestore', ['remove']);

					this.modalClose();
				}
			});

			this.modal(
				this.s.dt.i18n('stateRestore.title.remove', 'Delete state'),
				body
			);
		}
	}

	/**
	 * Get the states stored for this table / instance
	 *
	 * @param includeStatics Indicate if static states should be included or not
	 * @returns Array of states
	 */
	public storeGet(includeStatics = false) {
		if (includeStatics) {
			return this.s.store;
		}

		return this.s.store.filter(s => !s.isStatic);
	}

	/**
	 * Add a new state to the store
	 *
	 * @param state To add
	 */
	public storeAdd(state: State) {
		this.s.store.push(state);
	}

	/**
	 * Remove a state from the store
	 *
	 * @param state To remove
	 * @returns Void
	 */
	public storeRemove(state: State) {
		let store = this.s.store;
		let idx = store.indexOf(state);

		if (state.isStatic) {
			return;
		}

		if (idx !== -1) {
			store.splice(idx, 1);
		}
	}

	public storeReplace(oldState: State, newState: State) {
		let store = this.s.store;
		let idx = store.indexOf(oldState);

		if (oldState.isStatic) {
			return;
		}

		if (idx !== -1) {
			store.splice(idx, 1, newState);
		}
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

		// Allow the new state name to be defined from the language object
		if (!this.c.newName) {
			this.c.newName = dt.i18n('stateRestore.newName', 'State #');
		}

		this.s = {
			dt: dt,
			loading: false,
			modalLayers: [],
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
		this._addPredefined(this.c.predefined);

		this.s.dt.on('xhr.dtsr', (e, s, json) => {
			if (json && json.stateRestore) {
				this._addPredefined(json.stateRestore);
			}
		});

		// Initial startup actions
		this._load();
	}

	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Private methods
	 */

	/**
	 * Add predefined states to the list
	 *
	 * @param predefined Array of states, or object of states
	 */
	private async _addPredefined(
		predefined: Predefined[] | Record<string, DTState>
	) {
		if (Array.isArray(predefined)) {
			predefined.forEach(s => {
				this.add(s.state, s.name, true, s.isDefault || false);
			});
		}
		else {
			// Legacy support - v1 used objects keyed by the state name
			Object.keys(predefined).forEach(k => {
				this.add(predefined[k], k, true, false);
			});
		}
	}

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
	 * @param info Extra field details
	 * @param name Name for the input
	 * @param value Value for the input
	 * @param type Input type
	 * @returns The DOM instance containing the element
	 */
	private _field(
		label: string,
		info: string,
		name: string,
		value: any,
		type: 'text' | 'checkbox' = 'text'
	): Dom {
		let classes = this.classes.field;

		let field = Dom.c('div').classAdd(classes.container);

		Dom.c('label')
			.attr('for', 'dtsr-' + name)
			.classAdd(classes.label)
			.text(label)
			.appendTo(field);

		let inputContainer = Dom.c('div')
			.classAdd(classes.value)
			.appendTo(field);

		if (type === 'text') {
			Dom.c('input')
				.attr('id', 'dtsr-' + name)
				.attr('type', 'text')
				.attr('name', name)
				.attr('autocomplete', 'off')
				.val(value)
				.classAdd(classes.input)
				.appendTo(inputContainer);
		}
		else if (type === 'checkbox') {
			Dom.c('input')
				.attr('id', 'dtsr-' + name)
				.attr('type', 'checkbox')
				.attr('name', name)
				.prop('checked', value)
				.classAdd(classes.input)
				.appendTo(inputContainer);
		}

		if (info) {
			Dom.c('div')
				.classAdd(classes.info)
				.text(info)
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
		info: string,
		state: State,
		cb: (s: State) => void
	) {
		let body = Dom.c('div');
		let form = Dom.c('form').appendTo(body);
		let dt = this.s.dt;

		if (info) {
			form.append(Dom.c('p').text(info));
		}

		form.append(
			this._field(
				dt.i18n('stateRestore.state.name', 'Name:'),
				dt.i18n('stateRestore.state.nameInfo', ''),
				'name',
				state.name
			)
		);

		if (this.c.defaults) {
			form.append(
				this._field(
					dt.i18n('stateRestore.state.defaults', 'Default:'),
					dt.i18n(
						'stateRestore.state.defaultsInfo',
						'The state that is selected as the default will be used automatically when the page is loaded.'
					),
					'default',
					state.isDefault,
					'checkbox'
				)
			);
		}

		if (this.c.sharing) {
			form.append(
				this._field(
					dt.i18n('stateRestore.state.share', 'Share:'),
					dt.i18n(
						'stateRestore.state.shareInfo',
						'Other users of the system will be able to use states that you share. They will not be able to edit the state.'
					),
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

			form.append(
				this._fieldCheckboxes(
					dt.i18n(
						'stateRestore.state.properties',
						'State properties:'
					),
					checkboxes
				)
			);
		}

		form.append(
			this._submitButton(dt.i18n('stateRestore.state.save', 'Save'))
		);

		// Event handler for when the form is submitted
		form.on('submit', e => {
			e.preventDefault();

			// Post process the modal based on the inputs
			this._stateUserInputProcess(state, body, cb);
		});

		// Finally, show the modal
		this.modal(title, body);
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
					'stateRestore.state.nameRequired',
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

	/**
	 * Common create and submit button
	 *
	 * @param text Button text
	 * @returns DOM element with the button
	 */
	private _submitButton(text: string) {
		return Dom.c('div')
			.classAdd('dtsb-modal-buttons')
			.append(
				Dom.c('button')
					.classAdd('dtsb-modal-button')
					.text(text)
					.on('click', function () {
						Dom.s(this)
							.closest<HTMLFormElement>('form')[0]
							.requestSubmit();
					})
			);
	}
}
