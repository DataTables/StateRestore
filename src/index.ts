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
		let ctx = this.context[0];
		if (ctx._stateRestore) {
			return ctx._stateRestore.getState(stateSelector);
		}
	});

	apiRegister('stateRestore.addState()', function(stateSelector) {
		let ctx = this.context[0];
		if (ctx._stateRestore.addState) {
			return ctx._stateRestore.addState(stateSelector);
		}
	});

	apiRegister('stateRestore.states()', function(stateSelector) {
		let res = this.iterator(true, 'table', function(ctx) {
			if(ctx._stateRestore) {
				return ctx._stateRestore.getStates(stateSelector);
			}
		});

		return res;
	});

	apiRegister('stateRestore.state().save()', function() {
		let ctx = this.context[0];
		// Check if saving states is allowed
		if(ctx.c.save) {
			ctx.save();
		}
		return this;
	});

	apiRegister('stateRestore.state().rename()', function(newIdentifier) {
		let ctx = this.context[0];
		// Check if renaming states is allowed
		if(ctx.c.save) {
			ctx.rename(newIdentifier);
		}
		return this;
	});

	apiRegister('stateRestore.state().load()', function() {
		let ctx = this.context[0];
		ctx.load();
		return this;
	});

	apiRegister('stateRestore.state().delete()', function(skipModal) {
		let ctx = this.context[0];
		// Check if deletion of states is allowed
		if(ctx.c.delete) {
			ctx.delete(skipModal);
		}
		return this;
	});

	apiRegister('stateRestore.states().delete()', function(skipModal) {
		this.each(function(set) {
			// Check if deletion of states is allowed
			if(set.c.delete) {
				set.delete(skipModal);
			}
		});
		return this;
	});

	$.fn.dataTable.ext.buttons.stateRestore = {
		action(e, dt, node, config) {
			e.stopPropagation();
			config._stateRestore.load(config._stateRestore.s.identifier);
		},
		config: {
			split: ['updateState', 'deleteState', 'renameState']
		},
		text(dt) {
			return dt.i18n('buttons.stateRestore', 'State %d', dt.stateRestore.states()[0].length+1);
		}
	};

	$.fn.dataTable.ext.buttons.updateState = {
		action(e, dt, node, config, parentConfig) {
			e.stopPropagation();
			$('div.dt-button-background').click();
			config.parent._stateRestore.save();
		},
		text(dt) {
			return dt.i18n('buttons.updateState', 'Update');
		}
	};

	$.fn.dataTable.ext.buttons.savedStates = {
		buttons: [],
		extend: 'collection',
		init(dt, node, config) {
			if(dt.settings()[0]._stateRestore === undefined) {
				_buttonInit(dt, config);
			}
		},
		name: 'SaveStateRestore',
		text(dt) {
			return dt.i18n('buttons.savedStates', 'Saved States');
		}
	};

	$.fn.dataTable.ext.buttons.createStateRestore = {
		action(e, dt, node, config, parentConfig) {
			e.stopPropagation();
			let stateRestoreOpts = dt.settings()[0]._stateRestore.c;

			// If creation/saving is not allowed then return
			if (!stateRestoreOpts.create || !stateRestoreOpts.save) {
				return;
			}
			let prevStates = dt.stateRestore.states();
			dt.stateRestore.addState(
				dt.i18n('buttons.stateRestore', 'State %d', prevStates !== undefined ? prevStates.length + 1 : 1)
			);
			let states = dt.stateRestore.states();
			let stateButtons = [];
			for(let state of states) {
				stateButtons.push({
					_stateRestore: state,
					config: {
						split: [
							'<h3>'+state.s.identifier+'</h3>',
							stateRestoreOpts.save ? 'updateState' : '',
							stateRestoreOpts.delete ? 'deleteState' : '',
							stateRestoreOpts.save && stateRestoreOpts.rename ? 'renameState' : ''
						],
					},
					extend: 'stateRestore',
					text: state.s.savedState.stateRestore.state
				});
			}
			dt.button('SaveStateRestore:name').collectionRebuild(stateButtons);
		},
		init(dt, node, config) {
			if(dt.settings()[0]._stateRestore === undefined && dt.button('SaveStateRestore:name').length > 1) {
				_buttonInit(dt, config);
			}
		},
		text(dt) {
			return dt.i18n('buttons.createStateRestore', 'Create State');
		}
	};

	$.fn.dataTable.ext.buttons.deleteState = {
		action(e, dt, node, config) {
			e.stopPropagation();
			config.parent._stateRestore.delete();
		},
		text(dt) {
			return dt.i18n('buttons.deleteState', 'Delete');
		}
	};

	$.fn.dataTable.ext.buttons.renameState = {
		action(e, dt, node, config) {
			e.stopPropagation();
			config.parent._stateRestore.rename();
		},
		text(dt) {
			return dt.i18n('buttons.renameState', 'Rename');
		}
	};

	function _init(settings, options = null) {
		let api = new dataTable.Api(settings);
		let opts = options
			? options
			: api.init().stateRestore || dataTable.defaults.stateRestore;

		let stateRestore = new StateRestoreCollection(api, opts);
		_stateRegen(api, stateRestore);

		return stateRestore;
	}

	/**
	 * Initialisation function if initialising using a button
	 *
	 * @param dt The datatables instance
	 * @param config the config for the button
	 */
	function _buttonInit(dt, config) {
		let SRC = new $.fn.dataTable.StateRestoreCollection(dt, config.config);
		_stateRegen(dt, SRC);
	}

	function _stateRegen(dt, src) {
		let states = dt.stateRestore.states();
		let stateButtons = [];
		let stateRestoreOpts = dt.settings()[0]._stateRestore.c;
		if (states === undefined || states.length === 0) {
			stateButtons.push(
				'<span class="'+src.classes.emptyStates+'">' +
					dt.i18n('stateRestore.emptyStates', src.c.i18n.emptyStates) +
				'</span>'
			);
		}
		else {
			for(let state of states) {
				stateButtons.push({
					_stateRestore: state,
					config: {
						split: [
							'<h3>'+state.s.identifier+'</h3>',
							stateRestoreOpts.save ? 'updateState' : '',
							stateRestoreOpts.delete ? 'deleteState' : '',
							stateRestoreOpts.save && stateRestoreOpts.rename ? 'renameState' : ''
						],
					},
					extend: 'stateRestore',
					text: state.s.savedState.stateRestore.state
				});
			}
		}

		dt.button('SaveStateRestore:name').collectionRebuild(stateButtons);
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
