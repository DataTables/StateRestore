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

	apiRegister('stateRestore.state()', function(identifier) {
		let ctx = this.context[0];
		if (ctx._stateRestore) {
			return ctx._stateRestore.getState(identifier);
		}
	});

	apiRegister('stateRestore.state.add()', function(identifier) {
		let ctx = this.context[0];
		if (ctx._stateRestore.addState) {
			ctx._stateRestore.addState(identifier);
			return this;
		}
	});

	apiRegister('stateRestore.states()', function() {
		let res = this.iterator(true, 'table', function(ctx) {
			if(ctx._stateRestore) {
				return ctx._stateRestore.getStates();
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
		let deleteAllCallBack = (skipModalIn) => {
			this.each(function(set) {
				// Check if deletion of states is allowed
				if(set.c.delete) {
					set.delete(skipModalIn);
				}
			});
		};

		if (skipModal) {
			deleteAllCallBack(skipModal);
		}
		else {
			this.context[0]._stateRestore.deleteAll(deleteAllCallBack);
		}
		return this;
	});

	$.fn.dataTable.ext.buttons.stateRestore = {
		action(e, dt, node, config) {
			config._stateRestore.load();
		},
		config: {
			split: ['updateState', 'deleteState', 'renameState']
		},
		text(dt) {
			return dt.i18n('buttons.stateRestore', 'State %d', dt.stateRestore.states()[0].length+1);
		}
	};

	$.fn.dataTable.ext.buttons.updateState = {
		action(e, dt, node, config) {
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
		action(e, dt) {
			let stateRestoreOpts = dt.settings()[0]._stateRestore.c;
			let language = dt.settings()[0].oLanguage;

			// If creation/saving is not allowed then return
			if (!stateRestoreOpts.create || !stateRestoreOpts.save) {
				return;
			}
			let prevStates = dt.stateRestore.states().toArray();

			// Create a replacement regex based on the i18n values
			let defaultString = language.buttons !== undefined && language.buttons.stateRestore !== undefined ?
				language.buttons.stateRestore :
				'State ';
			let replaceRegex;

			if (defaultString.indexOf('%d') === defaultString.length - 3) {
				replaceRegex = new RegExp(defaultString.replace(/%d/g, ''));
			}
			else {
				let splitString = defaultString.split('%d');
				replaceRegex = [];
				for(let split of splitString) {
					replaceRegex.push(new RegExp(split));
				}
			}

			// Extract the numbers from the identifiers that use the standard naming convention
			let identifiers = prevStates
				.map((state) => {
					let id;
					if (Array.isArray(replaceRegex)) {
						id = state.s.identifier;
						for (let reg of replaceRegex) {
							id = id.replace(reg, '');
						}
					}
					else {
						id = state.s.identifier.replace(replaceRegex, '');
					}

					// If the id after replacement is not a number, or the length is the same as before,
					//  it has been customised so return 0
					if (isNaN(+id) || id.length === state.s.identifier) {
						return 0;
					}
					// Otherwise return the number that has been assigned previously
					else {
						return +id;
					}
				})
				.sort()
				.reverse();

			let lastNumber = identifiers[0];

			dt.stateRestore.state.add(
				dt.i18n('buttons.stateRestore', 'State %d', lastNumber !== undefined ? lastNumber + 1 : 1)
			);

			let states = dt.stateRestore.states();
			let stateButtons = [];
			for(let state of states) {
				let split = [];

				if (stateRestoreOpts.save) {
					split.push('updateState');
				}
				if (stateRestoreOpts.delete) {
					split.push('deleteState');
				}
				if (stateRestoreOpts.save && stateRestoreOpts.rename) {
					split.push('renameState');
				}
				if (split.length > 0) {
					split.unshift('<h3>'+state.s.identifier+'</h3>');
				}

				stateButtons.push({
					_stateRestore: state,
					config: {
						split
					},
					extend: 'stateRestore',
					text: state.s.identifier
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
			config.parent._stateRestore.delete();
		},
		text(dt) {
			return dt.i18n('buttons.deleteState', 'Delete');
		}
	};

	$.fn.dataTable.ext.buttons.deleteAllStates = {
		action(e, dt) {
			dt.stateRestore.states().delete(true);
		},
		text(dt) {
			return dt.i18n('buttons.deleteAllStates', 'Delete All States');
		}
	};

	$.fn.dataTable.ext.buttons.renameState = {
		action(e, dt, node, config) {
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
				let split = [];

				if (stateRestoreOpts.save) {
					split.push('updateState');
				}
				if (stateRestoreOpts.delete) {
					split.push('deleteState');
				}
				if (stateRestoreOpts.save && stateRestoreOpts.rename) {
					split.push('renameState');
				}
				if (split.length > 0) {
					split.unshift('<h3>'+state.s.identifier+'</h3>');
				}

				stateButtons.push({
					_stateRestore: state,
					config: {
						split
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
	$(document).on('preInit.dt.dtsr', function(e, settings) {
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
