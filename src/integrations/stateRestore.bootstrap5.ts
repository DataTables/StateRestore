/*! StateRestore Bootstrap 5 styling for DataTables
 * Copyright (c) SpryMedia Ltd - datatables.net/license
 */

import DataTable, { Dom, util } from 'datatables.net';

let bsModal;
const StateRestore = DataTable.StateRestore;
const domEls = {
	modal: Dom.c('div')
		.classAdd('modal fade dtsr-modal')
		.append(
			Dom.c('div')
				.classAdd('modal-dialog  modal-dialog-centered')
				.append(
					Dom.c('div')
						.classAdd('modal-content')
						.append(
							Dom.c('div')
								.classAdd('modal-header')
								.append(Dom.c('h5').classAdd('modal-title'))
								.append(
									Dom.c('button').classAdd('btn-close').attr({
										type: 'button',
										'aria-label': 'Close'
									})
								)
						)
						.append(Dom.c('div').classAdd('modal-body'))
				)
		)
};

// Get the Bootstrap library either from it being registered on DataTables (i.e
// in an ESM environment), or on the window if present there.
function getBs() {
	let dtBs = DataTable.use('bootstrap') as any;

	if (dtBs) {
		return dtBs;
	}

	if ((window as any).bootstrap) {
		return (window as any).bootstrap;
	}

	throw new Error(
		'No Bootstrap library. Set it with `DataTable.use(bootstrap);`'
	);
}

/*
 * Bootstrap modal for StateRestore.
 */
StateRestore.modal = function (title, content, className, closeCb) {
	if (!bsModal) {
		let localBs = getBs();

		bsModal = new localBs.Modal(domEls.modal.get(0), {
			backdrop: 'static',
			keyboard: false
		});
	}

	let header = domEls.modal.find('div.modal-header h5');
	let body = domEls.modal.find('div.modal-body');
	let close = domEls.modal.find('button.btn-close');

	// Display the content
	header.text(title);
	body.append(content);
	domEls.modal.classAdd(className);

	// Close event handler
	close.on('click.dtsr', () => {
		closeCb();
	});
	domEls.modal.on('click.dtsr', e => {
		if (Dom.s(e.target).classHas('modal')) {
			closeCb();
		}
	});

	domEls.modal.appendTo('body');

	bsModal.show();
};

StateRestore.modalClean = function () {
	let header = domEls.modal.find('div.modal-header h5');
	let body = domEls.modal.find('div.modal-body');
	let close = domEls.modal.find('button.btn-close');

	header.text('');
	body.empty();
	domEls.modal.classRemove(StateRestore.classes.modal.table);

	close.off('.dtsr');
	domEls.modal.off('.dtsr');
};

StateRestore.modalClose = function () {
	if (bsModal) {
		bsModal.hide();
	}
};

/*
 * Setup classes for integration
 */
util.object.assignDeep(StateRestore.classes, {
	field: {
		checkboxOption: 'form-check',
		container: 'mb-3',
		error: 'invalid-feedback',
		info: 'form-text',
		label: 'form-label',
		value: '',
		input: {
			checkbox: 'form-check-input',
			text: 'form-control'
		}
	},
	modal: {
		button: 'float-end btn btn-primary',
		table: 'modal-lg'
	},
	table: {
		table: 'table table-striped table-hover',
		button: 'btn btn-secondary btn-sm'
	}
});