import { Api } from 'datatables.net';

export interface Manipulator {
	/**
	 * Determine if the option should be shown to the end user based on the
	 * state object (i.e. there is no point in showing the end user the option
	 * to store card view information, if CardView isn't in the state object!)
	 *
	 * Any is used for some as the state definition from DataTables core doesn't
	 * include all of the extension properties.
	 *
	 * @param state DataTables state object to check
	 * @returns true if the option is present, false otherwise.
	 */
	available: (state: any) => boolean;

	/**
	 * Remove the value from the state (user has selected not to include it).
	 *
	 * @param state
	 * @returns
	 */
	remove: (state: any) => void;

	/**
	 * Text to show for the option
	 *
	 * @param dt DataTable API instance
	 * @returns Text to show
	 */
	text: (dt: Api) => string;
}

export interface ManipulatorOptions {
	/** CardView extension's status */
	cardView: boolean | null;

	/** Column visibility */
	columnVisibility: boolean | null;

	/** Column specific search */
	columnSearch: boolean | null;

	/** ColumnControl extension's filters */
	columnControl: boolean | null;

	/** ColReorder extension's status */
	columnOrder: boolean | null;

	/** Data order (sorting) */
	order: boolean | null;

	/** Page start */
	pageStart: boolean | null;

	/** Page length */
	pageLength: boolean | null;

	/** Scroller extension's status */
	scroller: boolean | null;

	/** Search information */
	search: boolean | null;

	/** SearchBuilder extension's filters */
	searchBuilder: boolean | null;

	/** SearchPanes extension's filters */
	searchPanes: boolean | null;

	/** Select extension's state */
	select: boolean | null;
};

const stateManipulators: Record<keyof ManipulatorOptions, Manipulator> = {
	cardView: {
		available: state => {
			return state.cardView ? true : false;
		},
		remove: state => {
			delete state.cardView;
		},
		text: dt => dt.i18n('stateRestore.option.cardView', 'Card view mode')
	},
	columnVisibility: {
		available: state => {
			return state.columns &&
				state.columns.length &&
				typeof state.columns[0].visible === 'boolean'
				? true
				: false;
		},
		remove: state => {
			state.columns.forEach((col: any) => {
				delete col.visible;
			});
		},
		text: dt =>
			dt.i18n('stateRestore.option.columnVisibility', 'Column visibility')
	},
	columnSearch: {
		available: state => {
			return state.columns &&
				state.columns.length &&
				typeof state.columns[0].search !== 'undefined'
				? true
				: false;
		},
		remove: state => {
			state.columns.forEach((col: any) => {
				delete col.search;
			});
		},
		text: dt =>
			dt.i18n('stateRestore.option.columnSearch', 'Search (Columns)')
	},
	columnControl: {
		available: state => {
			return state.columnControl ? true : false;
		},
		remove: state => {
			delete state.columnControl;
		},
		text: dt =>
			dt.i18n(
				'stateRestore.option.columnControl',
				'Search (Column Control)'
			)
	},
	columnOrder: {
		available: state => {
			return state.colReorder ? true : false;
		},
		remove: state => {
			delete state.colReorder;
		},
		text: dt =>
			dt.i18n('stateRestore.option.columnOrder', 'Column ordering')
	},
	order: {
		available: state => {
			return typeof state.order !== 'undefined';
		},
		remove: state => {
			delete state.order;
		},
		text: dt => dt.i18n('stateRestore.option.order', 'Ordering')
	},
	pageStart: {
		available: state => {
			return (
				typeof state.start !== 'undefined'
			);
		},
		remove: state => {
			delete state.start;
		},
		text: dt => dt.i18n('stateRestore.option.pageStart', 'Paging position')
	},
	pageLength: {
		available: state => {
			return (
				typeof state.length !== 'undefined'
			);
		},
		remove: state => {
			delete state.length;
		},
		text: dt => dt.i18n('stateRestore.option.pageLength', 'Paging length')
	},
	scroller: {
		available: state => {
			return typeof state.scroller !== 'undefined';
		},
		remove: state => {
			delete state.scroller;
		},
		text: dt => dt.i18n('stateRestore.option.scroller', 'Scroller position')
	},
	search: {
		available: state => {
			return typeof state.search !== 'undefined';
		},
		remove: state => {
			delete state.search;
			delete state.searchGroups;
		},
		text: dt => dt.i18n('stateRestore.option.search', 'Search (global)')
	},
	searchBuilder: {
		available: state => {
			return typeof state.searchBuilder !== 'undefined';
		},
		remove: state => {
			delete state.searchBuilder;
		},
		text: dt => dt.i18n('stateRestore.option.searchBuilder', 'Search (SearchBuilder)')
	},
	searchPanes: {
		available: state => {
			return typeof state.searchPanes !== 'undefined';
		},
		remove: state => {
			delete state.searchPanes;
		},
		text: dt => dt.i18n('stateRestore.option.searchBuilder', 'Search (SearchPanes)')
	},
	select: {
		available: state => {
			return typeof state.select !== 'undefined';
		},
		remove: state => {
			delete state.select;
		},
		text: dt => dt.i18n('stateRestore.option.searchBuilder', 'Row selection')
	},
};

export default stateManipulators;
