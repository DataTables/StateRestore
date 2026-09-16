/*! StateRestore Bulma styling for DataTables
 * Copyright (c) SpryMedia Ltd - datatables.net/license
 */

import DataTable, { Dom, util } from 'datatables.net';

let bModal;
let modalEl: Dom;
const StateRestore = DataTable.StateRestore;

function assertModal() {
	if (modalEl) {
		return;
	}

	modalEl = Dom.c('div')
		.classAdd('modal dtsr-modal')
		.append(Dom.c('div').classAdd('modal-background'))
		.append(
			Dom.c('div')
				.classAdd('modal-card')
				.append(
					Dom.c('header')
						.classAdd('modal-card-head')
						.append(Dom.c('p').classAdd('modal-card-title'))
						.append(
							Dom.c('button').classAdd('delete').attr({
								type: 'button',
								'aria-label': 'Close'
							})
						)
				)
				.append(Dom.c('section').classAdd('modal-card-body'))
		);
}

/*
 * Bulma modal for StateRestore.
 */
StateRestore.modal = function (title, content, className, closeCb) {
	assertModal();

	let background = modalEl.find('div.modal-background');
	let header = modalEl.find('header p');
	let body = modalEl.find('section.modal-card-body');
	let close = modalEl.find('button.delete');

	// Display the content
	header.text(title);
	body.append(content);
	modalEl.classAdd(className);

	// Close event handler
	background.on('click.dtsr', () => {
		closeCb();
	});
	close.on('click.dtsr', () => {
		closeCb();
	});
	modalEl.on('click.dtsr', e => {
		if (Dom.s(e.target).classHas('modal')) {
			closeCb();
		}
	});

	modalEl.appendTo('body').classAdd('is-active');
};

StateRestore.modalClean = function () {
	assertModal();

	let background = modalEl.find('div.modal-background');
	let header = modalEl.find('header p');
	let body = modalEl.find('section.modal-card-body');
	let close = modalEl.find('button.delete');

	header.text('');
	body.empty();
	modalEl.classRemove(StateRestore.classes.modal.table);

	background.off('.dtsr');
	close.off('.dtsr');
	modalEl.off('.dtsr');
};

StateRestore.modalClose = function () {
	assertModal();

	modalEl.detach().classRemove('is-active');
};

/*
 * Setup classes for integration
 */
util.object.assignDeep(StateRestore.classes, {
	field: {
		checkboxOption: 'dtsr-check',
		container: 'field',
		error: 'help has-text-danger',
		info: 'help',
		label: 'label',
		value: 'control',
		input: {
			checkbox: '',
			text: 'input'
		}
	},
	modal: {
		button: 'button is-primary is-pulled-right',
		table: 'dtsr-modal-lg'
	},
	table: {
		table: 'table is-striped is-hoverable',
		button: 'button is-small'
	}
});
