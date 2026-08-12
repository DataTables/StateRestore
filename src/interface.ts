import { Api, State as DTState } from "datatables.net";
import States from "./States";
import { ManipulatorOptions } from "./manipulators";

declare module 'datatables.net' {
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
		label: string;
		value: string;
		input: string;
	}
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

	/** States that have been stored and saved by this instance */
	store: Array<State>;
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