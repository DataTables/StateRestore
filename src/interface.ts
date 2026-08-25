import { Api, StateLoad as DTState } from 'datatables.net';
import States from './States';
import { ManipulatorOptions } from './manipulators';

declare module 'datatables.net' {
	interface Options {
		/**
		 * StateRestore extension options
		 */
		stateRestore?: Partial<Config>;
	}

	interface Defaults {
		/**
		 * StateRestore extension defaults
		 */
		stateRestore?: Config;
	}

	interface Context {
		/**
		 * State restore collection
		 */
		_states: States;
	}

	interface Api<T> {
		/**
		 * StateRestore API Methods
		 */
		stateRestore: ApiStateRestore<T>;
	}

	interface DataTablesStatic {
		/**
		 * Responsive class
		 */
		StateRestore: typeof States;
	}
}

interface ApiStateRestore<T> {
	/**
	 * Creates a new state, adding it to the collection.
	 *
	 * @param identifier The identifier that is to be used for the new state
	 * @returns DataTables Api for chaining
	 */
	activeStates(): Api<State>;

	state: StateRestoreState<T>;

	/**
	 * Retrieves all of the states from the collection.
	 *
	 * @returns An array of the StateRestore instances, or further api methods
	 *   that are applicable to multiple states.
	 */
	states(
		identifier: string | number | Array<string | number>
	): StateRestoreStatesMethods<T>;
}

interface StateRestoreState<T> {
	/**
	 * Retrieves a state from the collection.
	 *
	 * @param identifier The identifier of the state that is to be retrieved.
	 * @returns StateRestore instance, or further api methods.
	 */
	(identifier: string | number): StateRestoreStateMethods<T>;

	/**
	 * Add a new state
	 *
	 * @param Name for the state
	 * @returns DataTables Api for chaining
	 */
	add(name: string | number): Api<T>;
}

interface StateRestoreStateMethods<T> extends Api<T> {
	/**
	 * Get the state details object
	 */
	details(): State;

	/**
	 * Apply the selected state to the table
	 *
	 * @returns DataTables Api for chaining.
	 */
	load(): Api<T>;

	/**
	 * Delete the selected state
	 *
	 * @returns DataTables Api for chaining.
	 */
	remove(skipConfirm: boolean): Api<T>;

	/**
	 * Rename the selected state
	 *
	 * @returns DataTables Api for chaining.
	 */
	rename(name: string): Api<T>;

	/**
	 * Save the table's current state into the selected state
	 *
	 * @returns DataTables Api for chaining.
	 */
	save(): Api<T>;
}

interface StateRestoreStatesMethods<T> extends Api<T> {
	/**
	 * Delete all selected states
	 *
	 * @returns DataTables Api for chaining.
	 */
	remove(): Api<T>;
}

export interface Classes {
	field: {
		container: string;
		error: string;
		info: string;
		label: string;
		value: string;
		input: string;
	};
	removeMessage: string;
}

export interface Defaults {
	/** Ajax URL to save / load states */
	ajax: string | null;

	/**
	 * The end user is allowed to create new states
	 */
	canCreate: boolean;

	/**
	 * What values should be included in the states being saved. For each:
	 *
	 * * `true` means that it will be included
	 * * `false` means that it will not be includes
	 * * `null` will give the end user the option to have it included or not.
	 */
	include: ManipulatorOptions;

	/**
	 * Prefix name to give the states stored by this instance. This is available
	 * to reduce the chance of name collisions if there are multiple tables with
	 * on the same page or even across multiple pages. If not given, the table's
	 * ID will be used as the name.
	 *
	 * Note that if this is changed, you can loose access to old store states
	 * unless they are updated.
	 */
	name: string | null;

	/**
	 * The base name that will be used for new state names. It _must_ include
	 * `#` where you want a number to appear (to allow multiple states with
	 * consecutive numbering).
	 */
	newName: string;

	preDefined: PreDefined[] | Record<string, DTState>;

	/**
	 * Indicate if states can be shared between users. Note that this requires
	 * `ajax` to be specified for remote state storage.
	 */
	sharing: boolean;

	/**
	 * Allow the end user to set a default state
	 */
	defaults: boolean;
}

export interface PreDefined {
	/**
	 * Name to give the state
	 */
	name: string;

	/**
	 * State to load
	 */
	state: DTState;

	/**
	 * Indicate if the state should be the default one. Can be overridden by an
	 * end user selecting to have one of their own states as the default.
	 */
	isDefault: boolean;
}

export interface Config extends Partial<Defaults> {}

export interface Settings {
	/** DataTables API to the table this States instance manages */
	dt: Api;

	/** Flag to indicate when async loading is happening */
	loading: boolean;

	/** States that have been stored and saved by this instance */
	store: Array<State>;

	/** Remote storage API */
	storage: Storage;

	/** Callbacks to execute when states have been loaded */
	whenLoaded: Array<() => void>;
}

export interface State {
	/**
	 * Unique ID for the state.
	 */
	id: number | string | null;

	/**
	 * Indicator to say if the state is the default one.
	 */
	isDefault: boolean;

	/**
	 * Indicator to say if the state is owned by someone else
	 */
	isSharedIn: boolean;

	/**
	 * Indicator to say if this state is shared to other users
	 */
	isSharedOut: boolean;

	/**
	 * A static state is a predefined one - it cannot be edited or deleted as
	 * it will simply be there on reload. However, it can be duplicated so the
	 * client can have their own copy (if they wanted).
	 */
	isStatic: boolean;

	/**
	 * Name of the state
	 */
	name: string;

	/**
	 * The table static itself
	 */
	state: DTState;
}

export interface Checkbox {
	name: string;
	label: string;
	value: boolean;
}

/**
 * Storage controllers for where the data for the states should be "permanently"
 * stored.
 *
 * Note that the storage controllers must also manipulate the `store` array in
 * this States object. This is to allow them to do it before or after the data
 * has been saved / submitted, to allow for easy management and error flow
 * control.
 */
export interface Storage {
	/**
	 * Get all states
	 *
	 * @param dt Host DataTable
	 * @returns Array of the states
	 */
	read: (dt: Api) => Promise<State[]>;

	/**
	 * State a new state
	 *
	 * @param dt Host DataTable
	 * @param state New state
	 * @param host States object
	 * @returns True if everything is okay, false if not.
	 */
	create: (dt: Api, state: State, host: States) => Promise<boolean>;

	/**
	 * Update an existing state
	 *
	 * @param dt Host DataTable
	 * @param oldState State object that needs to be updated
	 * @param newState The new state object
	 * @param host States object
	 * @returns True if everything is okay, false if not.
	 */
	edit: (
		dt: Api,
		oldState: State,
		newState: State,
		host: States
	) => Promise<boolean>;

	/**
	 * Delete an existing state
	 *
	 * @param dt Host DataTable
	 * @param states States to remove
	 * @param host States object
	 * @returns True if everything is okay, false if not.
	 */
	remove: (dt: Api, states: State[], host: States) => Promise<boolean>;
}
