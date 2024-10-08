/*! StateRestore 1.4.1
 * © SpryMedia Ltd - datatables.net/license
 */

/**
 * @summary     StateRestore
 * @description StateRestore extension for DataTables
 * @version     1.4.1
 * @author      SpryMedia Ltd
 * @contact     datatables.net
 * @copyright   Copyright SpryMedia Ltd.
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

import StateRestore, {setJQuery as stateRestoreJQuery} from './StateRestore';
import StateRestoreCollection, {setJQuery as stateRestoreCollectionJQuery} from './StateRestoreCollection';

stateRestoreJQuery($);
stateRestoreCollectionJQuery($);

declare var DataTable: any;

($.fn as any).dataTable.StateRestore = StateRestore;
($.fn as any).DataTable.StateRestore = StateRestore;
($.fn as any).dataTable.StateRestoreCollection = StateRestoreCollection;
($.fn as any).DataTable.StateRestoreCollection = StateRestoreCollection;

let apiRegister = (DataTable.Api as any).register;

apiRegister('stateRestore()', function() {
	return this;
});

apiRegister('stateRestore.state()', function(identifier) {
	let ctx = this.context[0];
	if (!ctx._stateRestore) {
		let api = DataTable.Api(ctx);
		let src = new DataTable.StateRestoreCollection(api, {});
		_stateRegen(api, src);
	}
	this[0] = ctx._stateRestore.getState(identifier);
	return this;
});

apiRegister('stateRestore.state.add()', function(identifier, options) {
	let ctx = this.context[0];
	if (!ctx._stateRestore) {
		let api = DataTable.Api(ctx);
		let src = new DataTable.StateRestoreCollection(api, {});
		_stateRegen(api, src);
	}
	if(!ctx._stateRestore.c.create) {
		return this;
	}
	if (ctx._stateRestore.addState) {
		let states = ctx._stateRestore.s.states;
		let ids = [];

		for (let intState of states) {
			ids.push(intState.s.identifier);
		}

		ctx._stateRestore.addState(identifier, ids, options);
		return this;
	}
});

apiRegister('stateRestore.states()', function(ids) {
	let ctx = this.context[0];
	if (!ctx._stateRestore) {
		let api = DataTable.Api(ctx);
		let src = new DataTable.StateRestoreCollection(api, {});
		_stateRegen(api, src);
	}
	this.length = 0;
	this.push(...ctx._stateRestore.getStates(ids));
	return this;
});

apiRegister('stateRestore.state().save()', function() {
	let ctx = this[0];
	// Check if saving states is allowed
	if(ctx.c.save) {
		ctx.save();
	}
	return this;
});

apiRegister('stateRestore.state().rename()', function(newIdentifier) {
	let ctx = this.context[0];
	let state = this[0];
	// Check if renaming states is allowed
	if(state.c.save) {
		let states = ctx._stateRestore.s.states;
		let ids = [];
		for (let intState of states) {
			ids.push(intState.s.identifier);
		}
		state.rename(newIdentifier, ids);
	}
	return this;
});

apiRegister('stateRestore.state().load()', function() {
	let ctx = this[0];
	ctx.load();
	return this;
});

apiRegister('stateRestore.state().remove()', function(skipModal) {
	let ctx = this[0];
	// Check if removal of states is allowed
	if(ctx.c.remove) {
		ctx.remove(skipModal);
	}
	return this;
});

apiRegister('stateRestore.states().remove()', function(skipModal) {
	let removeAllCallBack = (skipModalIn) => {
		let success = true;
		let that = this.toArray();

		while (that.length > 0) {
			let set = that[0];

			if (set !== undefined && set.c.remove) {
				let tempSuccess = set.remove(skipModalIn);

				if (tempSuccess !== true) {
					success = tempSuccess;
				}
				else {
					that.splice(0, 1);
				}
			}
			else {
				break;
			}
		}

		return success;
	};

	if (this.context[0]._stateRestore && this.context[0]._stateRestore.c.remove) {
		if (skipModal) {
			removeAllCallBack(skipModal);
		}
		else {
			this.context[0]._stateRestore.removeAll(removeAllCallBack);
		}
	}
	return this;
});

apiRegister('stateRestore.activeStates()', function() {
	let ctx = this.context[0];
	this.length = 0;

	if (!ctx._stateRestore) {
		let api = DataTable.Api(ctx);
		let src = new DataTable.StateRestoreCollection(api, {});
		_stateRegen(api, src);
	}

	if (ctx._stateRestore) {
		this.push(...ctx._stateRestore.findActive());
	}

	return this;
});

DataTable.ext.buttons.stateRestore = {
	action(e, dt, node, config) {
		config._stateRestore.load();
		node.blur();
	},
	className: 'dtsr-state',
	config: {
		split: ['updateState', 'renameState', 'removeState']
	},
	text(dt) {
		return dt.i18n('buttons.stateRestore', 'State %d', dt.stateRestore.states()[0].length+1);
	}
};

DataTable.ext.buttons.updateState = {
	action(e, dt, node, config) {
		$('div.dt-button-background').click();
		config.parent._stateRestore.save();
	},
	text(dt) {
		return dt.i18n('buttons.updateState', 'Update');
	}
};

DataTable.ext.buttons.savedStates = {
	buttons: [],
	extend: 'collection',
	init(dt, node, config) {
		dt.on('stateRestore-change', function() {
			dt.button(node).text(dt.i18n('buttons.savedStates', 'Saved States', dt.stateRestore.states().length));
		});
		if(dt.settings()[0]._stateRestore === undefined) {
			_buttonInit(dt, config);
		}
	},
	name: 'SaveStateRestore',
	text(dt) {
		return dt.i18n('buttons.savedStates', 'Saved States', 0);
	}
};

DataTable.ext.buttons.savedStatesCreate = {
	buttons: [],
	extend: 'collection',
	init(dt, node, config) {
		dt.on('stateRestore-change', function() {
			dt.button(node).text(dt.i18n('buttons.savedStates', 'Saved States', dt.stateRestore.states().length));
		});
		if(dt.settings()[0]._stateRestore === undefined) {
			if(config.config === undefined) {
				config.config = {};
			}
			config.config._createInSaved = true;
			_buttonInit(dt, config);
		}
	},
	name: 'SaveStateRestore',
	text(dt) {
		return dt.i18n('buttons.savedStates', 'Saved States', 0);
	}
};

DataTable.ext.buttons.createState = {
	action(e, dt, node, config) {
		e.stopPropagation();
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
			for(let parts of splitString) {
				replaceRegex.push(new RegExp(parts));
			}
		}

		let getId = (identifier) => {
			let id;
			if (Array.isArray(replaceRegex)) {
				id = identifier;
				for (let reg of replaceRegex) {
					id = id.replace(reg, '');
				}
			}
			else {
				id = identifier.replace(replaceRegex, '');
			}

			// If the id after replacement is not a number, or the length is the same as before,
			//  it has been customised so return 0
			if (isNaN(+id) || id.length === identifier) {
				return 0;
			}
			// Otherwise return the number that has been assigned previously
			else {
				return +id;
			}
		};

		// Extract the numbers from the identifiers that use the standard naming convention
		let identifiers = prevStates
			.map((state) => getId(state.s.identifier))
			.sort((a, b) => +a < +b ?
				1 :
				+a > +b ?
					-1 :
					0
			);

		let lastNumber = identifiers[0];

		dt.stateRestore.state.add(
			dt.i18n('buttons.stateRestore', 'State %d', lastNumber !== undefined ? lastNumber + 1 : 1),
			config.config
		);

		let states = dt.stateRestore.states().sort((a, b) => {
			let aId = +getId(a.s.identifier);
			let bId = +getId(b.s.identifier);

			return aId > bId ?
				1 :
				aId < bId ?
					-1 :
					0;
		});

		let button = dt.button('SaveStateRestore:name');
		let buttonIndex = parseInt(button.index());
		let stateButtons = button[0] !== undefined && button[0].inst.c.buttons[buttonIndex].buttons !== undefined ?
			button[0].inst.c.buttons[buttonIndex].buttons :
			[];

		// remove any states from the previous rebuild - if they are still there they will be added later
		for (let i = 0; i < stateButtons.length; i++) {
			if (stateButtons[i].extend === 'stateRestore') {
				stateButtons.splice(i,1);
				i--;
			}
		}

		if (stateRestoreOpts._createInSaved) {
			stateButtons.push('createState');
		}

		for (let state of states) {
			let split = stateRestoreOpts.splitSecondaries.slice();
			if (split.includes('updateState') && !stateRestoreOpts.save) {
				split.splice(
					split.indexOf('updateState'),
					1
				);
			}
			if (
				split.includes('renameState') &&
				(!stateRestoreOpts.save || !stateRestoreOpts.rename)
			) {
				split.splice(
					split.indexOf('renameState'),
					1
				);
			}
			if (split.includes('removeState') && !stateRestoreOpts.remove) {
				split.splice(
					split.indexOf('removeState'),
					1
				);
			}

			stateButtons.push({
				_stateRestore: state,
				attr: {
					title: state.s.identifier
				},
				config: {
					split
				},
				extend: 'stateRestore',
				text: StateRestore.entityEncode(state.s.identifier),
				popoverTitle: StateRestore.entityEncode(state.s.identifier)
			});
		}

		dt.button('SaveStateRestore:name').collectionRebuild(stateButtons);
		node.blur();

		// Need to disable the removeAllStates button if there are no states and it is present
		let buttons = dt.buttons();

		for (let butt of buttons) {
			if ($(butt.node).hasClass('dtsr-removeAllStates')) {
				if (states.length === 0) {
					dt.button(butt.node).disable();
				}
				else {
					dt.button(butt.node).enable();
				}
			}
		}
	},
	init(dt, node, config) {
		if(dt.settings()[0]._stateRestore === undefined && dt.button('SaveStateRestore:name').length > 1) {
			_buttonInit(dt, config);
		}
	},
	text(dt) {
		return dt.i18n('buttons.createState', 'Create State');
	}
};

DataTable.ext.buttons.removeState = {
	action(e, dt, node, config) {
		config.parent._stateRestore.remove();
		node.blur();
	},
	text(dt) {
		return dt.i18n('buttons.removeState', 'Remove');
	}
};

DataTable.ext.buttons.removeAllStates = {
	action(e, dt, node) {
		dt.stateRestore.states().remove(true);
		node.blur();
	},
	className: 'dt-button dtsr-removeAllStates',
	init(dt, node) {
		if (! dt.settings()[0]._stateRestore || dt.stateRestore.states().length === 0) {
			$(node).addClass('disabled');
		}
	},
	text(dt) {
		return dt.i18n('buttons.removeAllStates', 'Remove All States');
	}
};

DataTable.ext.buttons.renameState = {
	action(e, dt, node, config) {
		let states = dt.settings()[0]._stateRestore.s.states;
		let ids = [];
		for (let state of states) {
			ids.push(state.s.identifier);
		}
		config.parent._stateRestore.rename(undefined, ids);
		node.blur();
	},
	text(dt) {
		return dt.i18n('buttons.renameState', 'Rename');
	}
};

function _init(settings, options = null) {
	let api = new DataTable.Api(settings);
	let opts = options
		? options
		: api.init().stateRestore || DataTable.defaults.stateRestore;

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
	let SRC = new DataTable.StateRestoreCollection(dt, config.config);
	_stateRegen(dt, SRC);
}

function _stateRegen(dt, src) {
	let states = dt.stateRestore.states();
	let button = dt.button('SaveStateRestore:name');
	let stateButtons = [];
	let i;

	// Need to get the original configuration object, so we can rebuild it
	// It might be nested, so need to traverse down the tree
	if (button[0]) {
		let idxs = button.index().split('-');

		stateButtons = button[0].inst.c.buttons;

		for (i=0 ; i<idxs.length ; i++) {
			if (stateButtons[idxs[i]].buttons) {
				stateButtons = stateButtons[idxs[i]].buttons;
			}
			else {
				stateButtons = [];
				break;
			}
		}
	}

	let stateRestoreOpts = dt.settings()[0]._stateRestore.c;

	// remove any states from the previous rebuild - if they are still there they will be added later
	for (i = 0; i < stateButtons.length; i++) {
		if (stateButtons[i].extend === 'stateRestore') {
			stateButtons.splice(i,1);
			i--;
		}
	}

	if (stateRestoreOpts._createInSaved) {
		stateButtons.push('createState');
	}

	if (states === undefined || states.length === 0) {
		stateButtons.push(
			'<span class="'+src.classes.emptyStates+'">' +
				dt.i18n('stateRestore.emptyStates', src.c.i18n.emptyStates) +
			'</span>'
		);
	}
	else {
		for(let state of states) {
			let split = stateRestoreOpts.splitSecondaries.slice();
			if (split.includes('updateState') && !stateRestoreOpts.save) {
				split.splice(
					split.indexOf('updateState'),
					1
				);
			}
			if (
				split.includes('renameState') &&
				(!stateRestoreOpts.save || !stateRestoreOpts.rename)
			) {
				split.splice(
					split.indexOf('renameState'),
					1
				);
			}
			if (split.includes('removeState') && !stateRestoreOpts.remove) {
				split.splice(
					split.indexOf('removeState'),
					1
				);
			}

			stateButtons.push({
				_stateRestore: state,
				attr: {
					title: state.s.identifier
				},
				config: {
					split
				},
				extend: 'stateRestore',
				text: StateRestore.entityEncode(state.s.identifier),
				popoverTitle: StateRestore.entityEncode(state.s.identifier)
			});
		}
	}

	dt.button('SaveStateRestore:name').collectionRebuild(stateButtons);

	// Need to disable the removeAllStates button if there are no states and it is present
	let buttons = dt.buttons();

	for (let butt of buttons) {
		if ($(butt.node).hasClass('dtsr-removeAllStates')) {
			if (states.length === 0) {
				dt.button(butt.node).disable();
			}
			else {
				dt.button(butt.node).enable();
			}
		}
	}
}

// Attach a listener to the document which listens for DataTables initialisation
// events so we can automatically initialise
$(document).on('preInit.dt.dtsr', function(e, settings) {
	if (e.namespace !== 'dt') {
		return;
	}

	if (settings.oInit.stateRestore ||
		DataTable.defaults.stateRestore
	) {
		if (!settings._stateRestore) {
			_init(settings, null);
		}
	}
});
