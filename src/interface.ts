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

	interface DataTablesStatic {
		/**
		 * Responsive class
		 */
		StateRestore: typeof States;
	}
}

export interface Classes {
	field: {
		container: string;
		error: string;
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
	id: string | null;
	isDefault: boolean;
	isSharedIn: boolean;
	isSharedOut: boolean;
	name: string;
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
	 * @param states States object
	 * @returns True if everything is okay, false if not.
	 */
	create: (dt: Api, state: State, states: States) => Promise<boolean>;

	/**
	 * Update an existing state
	 *
	 * @param dt Host DataTable
	 * @param state Updated state
	 * @param states States object
	 * @returns True if everything is okay, false if not.
	 */
	update: (dt: Api, state: State, states: States) => Promise<boolean>;

	/**
	 * Delete an existing state
	 *
	 * @param dt Host DataTable
	 * @param state State to remove
	 * @param states States object
	 * @returns True if everything is okay, false if not.
	 */
	remove: (dt: Api, state: State, states: States) => Promise<boolean>;
}
