/*! StateRestore Foundation styling for DataTables
 * Copyright (c) SpryMedia Ltd - datatables.net/license
 */

import DataTable, { Dom, util } from 'datatables.net';

let fModal;
const StateRestore = DataTable.StateRestore;
const _modal = Dom.c('div')
	.classAdd('reveal reveal-modal dtsr-modal')
	.append(
		Dom.c('button')
			.classAdd('close-button')
			.attr({
				type: 'button',
				'aria-label': 'Close'
			})
			.append(
				Dom.c('span').attr('aria-hidden', 'true').html('&times;')
			)
	)
	.append(Dom.c('div').classAdd('dtsr-modal-header').append(Dom.c('h4')))
	.append(
		Dom.c('div').classAdd('dtsr-modal-content')
	);

// Get the Bootstrap library either from it being registered on DataTables (i.e
// in an ESM environment), or on the window if present there.
function getFoundation() {
	let F = DataTable.use('foundation') as any;

	if (F) {
		return F;
	}

	if ((window as any).Foundation) {
		return (window as any).Foundation;
	}

	throw new Error(
		'No Foundation library. Set it with `DataTable.use(Foundation);`'
	);
}

/*
 * Bootstrap modal for StateRestore.
 */
StateRestore.modal = function (title, content, className, closeCb) {
	let $ = DataTable.use('jq');

	if (!fModal) {
		_modal.appendTo('body');

		// Foundation depends on jQuery, so it must be set
		let Foundation = getFoundation();

		fModal = new Foundation.Reveal($(_modal.get(0)), {
			closeOnClick: false
		});
	}

	let header = _modal.find('div.dtsr-modal-header h4');
	let body = _modal.find('div.dtsr-modal-content');
	let close = _modal.find('button.close-button');

	// Display the content
	header.text(title);
	body.append(content);
	_modal.classAdd(className);

	// Close event handler
	close.on('click.dtsr', () => {
		closeCb();
	});
	_modal.on('click.dtsr', e => {
		if (Dom.s(e.target).classHas('modal')) {
			closeCb();
		}
	});

	fModal.open();

	$(document).on('click.dtsr', 'div.reveal-overlay', e => {
		if (!$(e.target).closest(_modal.get(0)).length) {
			closeCb();
		}
	});
};

StateRestore.modalClean = function () {
	let $ = DataTable.use('jq');
	let header = _modal.find('div.dtsr-modal-header h4');
	let body = _modal.find('div.dtsr-modal-content');
	let close = _modal.find('button.close-button');

	header.text('');
	body.empty();
	_modal.classRemove(StateRestore.classes.modal.table);

	close.off('.dtsr');
	_modal.off('.dtsr');
	$(document).off('click.dtsr');
};

StateRestore.modalClose = function () {
	if (fModal) {
		fModal.close();
	}
};

/*
 * Setup classes for integration
 */
util.object.assignDeep(StateRestore.classes, {
	field: {
		checkboxOption: 'dtsr-check-container',
		container: 'dtsr-field',
		error: 'error',
		info: 'dtsr-info',
		label: '',
		value: '',
		input: {
			checkbox: '',
			text: ''
		}
	},
	modal: {
		button: 'button',
		table: 'large'
	},
	table: {
		table: 'table table-striped table-hover',
		button: 'button secondary small'
	}
});
