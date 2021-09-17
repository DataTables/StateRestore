/// <reference types="jquery" />
/// <reference types="datatables.net"/>


import * as stateRestoreCollectionType from './StateRestoreCollection';
import * as stateRestoreType from './StateRestore';

declare namespace DataTables {

	interface Settings {
		/**
		 * StateRestore extension options
		 */
		stateRestore?: boolean | string[] | stateRestoreCollectionType.IDefaults | stateRestoreCollectionType.IDefaults[];
	}

	interface LanguageSettings {
		stateRestore?: {};
	}

	interface Api<T> {
		/**
		 * StateRestore API Methods
		 */
		stateRestore: StateRestoreGlobalApi;
	}

	interface StateRestoreGlobalApi {
		/**
		 * Creates a new state, adding it to the collection.
		 *
		 * @param identifier The identifier that is to be used for the new state
		 *
		 * @returns DatatTables Api for chaining
		 */
		addState(identifier: string): void | Api<any>;

		/**
		 * Retrieves a state from the collection.
		 *
		 * @param identifier The identifier of the state that is to be retrieved.
		 *
		 * @returns StateRestore instance, or further api methods.
		 */
		state(identifier: string): stateRestoreType.default | null | StateRestoreSubApi;

		/**
		 * Retrieves all of the states from the collection.
		 *
		 * @returns An array of the StateRestore instances,
		 * or further api methods that are applicable to multiple states.
		 */
		states(): stateRestoreType.default[] | StateRestoreMultiSubApi;
	}

	interface StateRestoreSubApi {
		/**
		 * Removes the state previously identified in the call to `state()`.
		 *
		 * @returns Datatables Api for chaining.
		 */
		remove(): Api<any>;

		/**
		 * Loads the state previously identified in the call to `state()` into the table.
		 *
		 * @returns Datatables Api for chaining.
		 */
		load(): Api<any>;

		/**
		 * Renames the state previously identified in the call to `state()`.
		 *
		 * @returns Datatables Api for chaining.
		 */
		rename(): Api<any>;

		/**
		 * Saves the state previously identified in the call to `state()`.
		 *
		 * @returns Datatables Api for chaining.
		 */
		save(): Api<any>;
	}

	interface StateRestoreMultiSubApi {
		/**
		 * Removes all of the states that were previously identified in the call to `states()`.
		 *
		 * @returns Datatables Api for chaining.
		 */
		remove(): Api<any>;
	}
}