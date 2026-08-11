import DataTable, { Api, Context, Dom, State as DTState, util } from 'datatables.net';
import { Classes, Defaults, Settings, State } from './interface';

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
			columns: {
				visible: true,
				search: true
			},
			columnControl: true,
			columnOrder: true,
			length: true,
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
	add(state: DTState) {
		this._modal(
			'Save new state',
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

	update(id: string, state: State) {}

	remove(id: string) {}

	store() {
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

		// TODO List of options to toggle

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

		if (! nameInput.val()) {
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

		// TODO Work through the list of options and see if they should be
		// included / excluded

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
