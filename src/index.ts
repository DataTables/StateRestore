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
import StateRestoreCollection, {setJQuery as stateRestoreCollectionJQuery} from './StateRestoreCollection';

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
	stateRestoreCollectionJQuery($);

	let dataTable = $.fn.dataTable;

	($.fn as any).dataTable.StateRestore = StateRestore;
	($.fn as any).DataTable.StateRestore = StateRestore;
	($.fn as any).dataTable.StateRestoreCollection = StateRestoreCollection;
	($.fn as any).DataTable.StateRestoreCollection = StateRestoreCollection;

	let apiRegister = ($.fn.dataTable.Api as any).register;

	apiRegister('stateRestore()', function() {
		return this;
	});

	apiRegister('stateRestore.state()', function(stateSelector) {
		return this.iterator('table', function(ctx) {
			if (ctx._stateRestore) {
				return ctx._stateRestore.getState(stateSelector);
			}
		});
	});

	apiRegister('stateRestore.addState()', function(stateSelector) {
		return this.iterator('table', function(ctx) {
			if (ctx._stateRestore) {
				return ctx._stateRestore.addState(stateSelector);
			}
		});
	});

	apiRegister('stateRestore.states()', function(stateSelector) {
		return this.iterator('table', function(ctx) {
			if (ctx._stateRestore) {
				return ctx._stateRestore.getStates(stateSelector);
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
			config._stateRestore.load(config._stateRestore.s.savedState.stateRestore.state);
		},
		config: {
			split: ['saveState', 'deleteState']
		},
		text: 'StateRestore'
	};

	$.fn.dataTable.ext.buttons.saveState = {
		action(e, dt, node, config, parentConfig) {
			e.stopPropagation();
			config.parent._stateRestore.save(config.parent.config.state);
		},
		text: 'Save',
	};

	$.fn.dataTable.ext.buttons.savedStates = {
		buttons: [],
		extend: 'collection',
		name: 'SaveStateRestore',
		text: 'Saved States'
	};

	$.fn.dataTable.ext.buttons.createStateRestore = {
		action(e, dt, node, config, parentConfig) {
			e.stopPropagation();
			let stateLength = dt.stateRestore.states()[0].length;
			dt.stateRestore.addState('State '+(stateLength+1));
			let states = dt.stateRestore.states()[0];
			let stateButtons = [];
			for(let state of states) {
				stateButtons.push({
					_stateRestore: state,
					config: {
						split: ['saveState', 'deleteState'],
					},
					extend: 'stateRestore',
					text: state.s.savedState.stateRestore.state
				});
			}
			dt.button('SaveStateRestore:name').collectionRebuild(stateButtons);
		},
		init(dt, node, config) {
			if(dt.settings()[0]._stateRestore === undefined) {
				new $.fn.dataTable.StateRestoreCollection(dt, config.stateRestore);
				let states = dt.stateRestore.states()[0];
				let stateButtons = [];
				for(let state of states) {
					stateButtons.push({
						_stateRestore: state,
						config: {
							split: ['saveState', 'deleteState'],
						},
						extend: 'stateRestore',
						text: state.s.savedState.stateRestore.state
					});
				}
				dt.button('SaveStateRestore:name').collectionRebuild(stateButtons);
			}
		},
		text: 'Create State'
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

		let stateRestore = new StateRestoreCollection(api, opts);

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
