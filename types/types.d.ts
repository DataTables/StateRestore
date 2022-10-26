// Type definitions for DataTables StateRestore
//
// Project: https://datatables.net/extensions/StateRestore/, https://datatables.net

/// <reference types="jquery" />

import DataTables, {Api} from 'datatables.net';
import * as stateRestoreCollectionType from './StateRestoreCollection';
import * as stateRestoreType from './StateRestore';

export default DataTables;

type DeepPartial<T> = T extends object ? {
    [P in keyof T]?: DeepPartial<T[P]>;
} : T;


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * DataTables' types integration
 */
declare module 'datatables.net' {
	interface Config {
		/**
		 * StateRestore extension options
		 */
		stateRestore?: boolean | string[] | ConfigStateRestore | ConfigStateRestore[];
	}

	interface ConfigLanguage {
		/**
		 * StateRestore language options
		 */
		stateRestore?: ConfigStateRestoreLanguage;
	}

	interface Api<T> {
		/**
		 * StateRestore API Methods
		 */
		stateRestore: ApiStateRestore<T>;
	}

	interface ApiStatic {
		/**
		 * StateRestore class
		 */
		StateRestore: {
			/**
			 * Create a new StateRestore instance for the target DataTable
			 */
			new (dt: Api<any>, settings: string[] | ConfigStateRestore | ConfigStateRestore[]);

			/**
			 * StateRestore version
			 */
			version: string;

			/**
			 * Default configuration values
			 */
			defaults: ConfigStateRestore;
		}
	}
}


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Options
 */
interface ConfigStateRestore extends Partial<stateRestoreCollectionType.IDefaults> {}

interface ConfigStateRestoreLanguage extends DeepPartial<stateRestoreCollectionType.II18n> {}


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * API
 */

interface ApiStateRestore<T> {
	/**
	 * Creates a new state, adding it to the collection.
	 *
	 * @param identifier The identifier that is to be used for the new state
	 *
	 * @returns DatatTables Api for chaining
	 */
	addState(identifier: string): void | Api<T>;

	/**
	 * Retrieves a state from the collection.
	 *
	 * @param identifier The identifier of the state that is to be retrieved.
	 *
	 * @returns StateRestore instance, or further api methods.
	 */
	state(identifier: string): stateRestoreType.default | null | StateRestoreSubApi<T>;

	/**
	 * Retrieves all of the states from the collection.
	 *
	 * @returns An array of the StateRestore instances,
	 * or further api methods that are applicable to multiple states.
	 */
	states(): stateRestoreType.default[] | StateRestoreMultiSubApi<T>;
}

interface StateRestoreSubApi<T> extends Api<T> {
	/**
	 * Removes the state previously identified in the call to `state()`.
	 *
	 * @returns Datatables Api for chaining.
	 */
	remove(): Api<T>;

	/**
	 * Loads the state previously identified in the call to `state()` into the table.
	 *
	 * @returns Datatables Api for chaining.
	 */
	load(): Api<T>;

	/**
	 * Renames the state previously identified in the call to `state()`.
	 *
	 * @returns Datatables Api for chaining.
	 */
	rename(): Api<T>;

	/**
	 * Saves the state previously identified in the call to `state()`.
	 *
	 * @returns Datatables Api for chaining.
	 */
	save(): Api<T>;
}

interface StateRestoreMultiSubApi<T> extends Api<T> {
	/**
	 * Removes all of the states that were previously identified in the call to `states()`.
	 *
	 * @returns Datatables Api for chaining.
	 */
	remove(): Api<T>;
}
