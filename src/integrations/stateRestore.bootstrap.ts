/*! StateRestore Bootstrap 3 styling for DataTables
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
		)
};

/*
 * Bootstrap modal for StateRestore.
 */
StateRestore.modal = function (title, content, className, closeCb) {
	let $ = DataTable.use('jq');

	if (!bsModal) {
		bsModal = $(domEls.modal.get(0)).modal({
			backdrop: 'static',
			keyboard: false,
			show: false
		});
	}

	let header = domEls.modal.find('div.modal-header h4');
	let body = domEls.modal.find('div.modal-body');
	let close = domEls.modal.find('button.close');

	// Display the content
	header.text(title);
	body.append(content);
	domEls.modal.find('div.modal-dialog').classAdd(className);

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

	bsModal.modal('show');
};

StateRestore.modalClean = function () {
	let header = domEls.modal.find('div.modal-header h4');
	let body = domEls.modal.find('div.modal-body');
	let close = domEls.modal.find('button.close');

	header.text('');
	body.empty();
	domEls.modal
		.find('div.modal-dialog')
		.classRemove(StateRestore.classes.modal.table);

	close.off('.dtsr');
	domEls.modal.off('.dtsr');
};

StateRestore.modalClose = function () {
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
