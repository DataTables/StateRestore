/*! StateRestore 0.0.1
 * 2019-2020 SpryMedia Ltd - datatables.net/license
 */

/**
 * @summary     StateRestore
 * @description StateRestore extension for DataTables
 * @version     0.0.1
 * @author      SpryMedia Ltd (www.sprymedia.co.uk)
 * @copyright   Copyright 2019-2020 SpryMedia Ltd.
 *
 * This source file is free software, available under the following license:
 * MIT license - http://datatables.net/license/mit
 *
 * This source file is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.
 *
 * For details please refer to: http://www.datatables.net
 */

/// <reference path = '../node_modules/@types/jquery/index.d.ts'

// Hack to allow TypeScript to compile our UMD
declare let define: {
	amd: string;
	// eslint-disable-next-line @typescript-eslint/member-ordering
	(stringValue, Function): any;
};

import StateRestore, {setJQuery as stateRestoreJQuery} from './StateRestore';

// DataTables extensions common UMD. Note that this allows for AMD, CommonJS
// (with window and jQuery being allowed as parameters to the returned
// function) or just default browser loading.
(function(factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD
		define(['jquery', 'datatables.net'], function($) {
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
				$ = require('datatables.net')(root, $).$;
			}

			return factory($, root, root.document);
		};
	}
	else {
		// Browser - assume jQuery has already been loaded
		factory((window as any).jQuery, window, document);
	}
}(function($, window, document) {

	stateRestoreJQuery($);

	let dataTable = $.fn.dataTable;

	($.fn as any).dataTable.StateRestore = StateRestore;
	($.fn as any).DataTable.StateRestore = StateRestore;

	let apiRegister = ($.fn.dataTable.Api as any).register;

	apiRegister('stateRestore()', function() {
		return this;
	});

	apiRegister('stateRestore.state()', function(stateSelector) {
		return this.iterator('table', function(ctx) {
			if (ctx._stateRestore) {
				ctx._stateRestore.state(stateSelector);
			}
		});
	});

	apiRegister('stateRestore.states()', function(stateSelector) {
		return this.iterator('table', function(ctx) {
			if (ctx._stateRestore) {
				ctx._stateRestore.states(stateSelector);
			}
		});
	});

	apiRegister('stateRestore.state().save()', function() {
		this.save();
		return this;
	});

	apiRegister('stateRestore.state().load()', function() {
		this.load();
		return this;
	});

	apiRegister('stateRestore.state().delete()', function() {
		this.delete();
		return this;
	});

	apiRegister('stateRestore.states().delete()', function() {
		this.each(function(set) {
			set.delete();
		});
		return this;
	});

	$.fn.dataTable.ext.buttons.stateRestore = {
		action(e, dt, node, config) {
			e.stopPropagation();
			config._stateRestore.load(config.config.state);
		},
		config: {
			split: ['saveState', 'deleteState']
		},
		init(dt, node, config) {
			let state = new $.fn.dataTable.StateRestore(dt);
			config._stateRestore = state;
		},
		text: 'StateRestore'
	};
	$.fn.dataTable.ext.buttons.saveState = {
		action(e, dt, node, config, parentConfig) {
			e.stopPropagation();
			config.parent._stateRestore.save(config.parent.config.state);
		},
		text: 'Save'
	};
	$.fn.dataTable.ext.buttons.deleteState = {
		action(e, dt, node, config) {
			e.stopPropagation();
			config.parent._stateRestore.delete(config.parent.config.state);
		},
		text: 'Delete'
	};

	function _init(settings, options = null) {
		let api = new dataTable.Api(settings);
		let opts = options
			? options
			: api.init().stateRestore || dataTable.defaults.stateRestore;

		let stateRestore = new StateRestore(api, opts);

		return stateRestore;
	}

	// Attach a listener to the document which listens for DataTables initialisation
	// events so we can automatically initialise
	$(document).on('preInit.dt.dtsp', function(e, settings, json) {
		if (e.namespace !== 'dt') {
			return;
		}

		if (settings.oInit.stateRestore ||
			dataTable.defaults.stateRestore
		) {
			if (!settings._stateRestore) {
				_init(settings, null);
			}
		}
	});
}));
