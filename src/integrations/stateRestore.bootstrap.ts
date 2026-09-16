/*! StateRestore Bootstrap 3 styling for DataTables
 * Copyright (c) SpryMedia Ltd - datatables.net/license
 */

import DataTable, { Dom, util } from 'datatables.net';

let bsModal;
let modalEl: Dom;
const StateRestore = DataTable.StateRestore;

function assertModal() {
	if (modalEl) {
		return;
	}

	modalEl = Dom.c('div')
		.classAdd('modal fade dtsr-modal')
		.append(
			Dom.c('div')
				.classAdd('modal-dialog')
				.append(
					Dom.c('div')
						.classAdd('modal-content')
						.append(
							Dom.c('div')
								.classAdd('modal-header')
								.append(
									Dom.c('button')
										.classAdd('close')
										.attr({
											type: 'button',
											'aria-label': 'Close'
										})
										.append(
											Dom.c('span')
												.attr('aria-hidden', 'true')
												.html('&times;')
										)
								)
								.append(Dom.c('h4').classAdd('modal-title'))
						)
						.append(Dom.c('div').classAdd('modal-body'))
				)
		);
}

/*
 * Bootstrap modal for StateRestore.
 */
StateRestore.modal = function (title, content, className, closeCb) {
	assertModal();

	let $ = DataTable.use('jq');

	if (!bsModal) {
		bsModal = $(modalEl.get(0)).modal({
			backdrop: 'static',
			keyboard: false,
			show: false
		});
	}

	let header = modalEl.find('div.modal-header h4');
	let body = modalEl.find('div.modal-body');
	let close = modalEl.find('button.close');

	// Display the content
	header.text(title);
	body.append(content);
	modalEl.find('div.modal-dialog').classAdd(className);

	// Close event handler
	close.on('click.dtsr', () => {
		closeCb();
	});
	modalEl.on('click.dtsr', e => {
		if (Dom.s(e.target).classHas('modal')) {
			closeCb();
		}
	});

	modalEl.appendTo('body');

	bsModal.modal('show');
};

StateRestore.modalClean = function () {
	assertModal();

	let header = modalEl.find('div.modal-header h4');
	let body = modalEl.find('div.modal-body');
	let close = modalEl.find('button.close');

	header.text('');
	body.empty();
	modalEl
		.find('div.modal-dialog')
		.classRemove(StateRestore.classes.modal.table);

	close.off('.dtsr');
	modalEl.off('.dtsr');
};

StateRestore.modalClose = function () {
	assertModal();

	if (bsModal) {
		bsModal.modal('hide');
	}
};

/*
 * Setup classes for integration
 */
util.object.assignDeep(StateRestore.classes, {
	field: {
		checkboxOption: 'form-check',
		container: 'form-group',
		error: 'invalid-feedback',
		info: 'form-text text-muted',
		label: '',
		value: '',
		input: {
			checkbox: 'form-check-input',
			text: 'form-control'
		}
	},
	modal: {
		button: 'btn btn-primary',
		table: 'modal-lg'
	},
	table: {
		table: 'table table-striped table-hover',
		button: 'btn btn-secondary btn-sm'
	}
});
