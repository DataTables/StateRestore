/*! Bootstrap integration for DataTables' SearchPanes
 * ©2016 SpryMedia Ltd - datatables.net/license
 */
(function(factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD
		define(['jquery', 'datatables.net-bs4', 'datatables.net-staterestore'], function($) {
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
				$ = require('datatables.net-bs4')(root, $).$;
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
		checkBox: 'dtsr-check-box form-check-input',
		creationButton: 'dtsr-creation-button btn btn-secondary',
		creationForm: 'dtsr-creation-form modal-body',
		creationText: 'dtsr-creation-text modal-header',
		creationTitle: 'dtsr-creation-title modal-title',
		nameInput: 'dtsr-name-input form-control'
	});

	$.extend(true, dataTable.StateRestore.classes, {
		confirmationButton: 'dtsr-confirmation-button btn btn-secondary',
		input: 'dtsr-input form-control'
	});

	return dataTable.searchPanes;
}));
