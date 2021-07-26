/*! Bootstrap integration for DataTables' SearchPanes
 * ©2016 SpryMedia Ltd - datatables.net/license
 */
(function(factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD
		define(['jquery', 'datatables.net-bm', 'datatables.net-staterestore'], function($) {
			return factory($, window, document);
		});
	}
	else if (typeof exports === 'object') {
		// CommonJS
		module.exports = function(root, $) {
			if (! root) {
				root = window;
			}

			if (! $ || ! $.fn.dataTable) {
				// eslint-disable-next-line @typescript-eslint/no-var-requires
				$ = require('datatables.net-bm')(root, $).$;
			}

			if (! $.fn.dataTable.SearchPanes) {
				// eslint-disable-next-line @typescript-eslint/no-var-requires
				require('datatables.net-staterestore')(root, $);
			}

			return factory($, root, root.document);
		};
	}
	else {
		// Browser
		factory(jQuery, window, document);
	}
}(function($, window, document) {
	'use strict';
	let dataTable = $.fn.dataTable;

	$.extend(true, dataTable.StateRestoreCollection.classes, {
		checkRow: 'dtsr-check-row checkbox',
		creationButton: 'dtsr-creation-button button',
		creationForm: 'dtsr-creation-form modal-content',
		creationText: 'dtsr-creation-text modal-header',
		creationTitle: 'dtsr-creation-title modal-title',
		nameInput: 'dtsr-name-input input',
	});

	$.extend(true, dataTable.StateRestore.classes, {
		confirmationButton: 'dtsr-confirmation-button button',
		input: 'dtsr-input input'
	});

	return dataTable.searchPanes;
}));
