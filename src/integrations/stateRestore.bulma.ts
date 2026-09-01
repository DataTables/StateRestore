/*! StateRestore Bulma styling for DataTables
 * Copyright (c) SpryMedia Ltd - datatables.net/license
 */

import DataTable, { Dom, util } from 'datatables.net';

let bModal;
const StateRestore = DataTable.StateRestore;
const _modal = Dom.c('div')
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

/*
 * Bootstrap modal for StateRestore.
 */
StateRestore.modal = function (title, content, className, closeCb) {
	let header = _modal.find('header p');
	let body = _modal.find('section.modal-card-body');
	let close = _modal.find('button.delete');

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

	_modal.appendTo('body').classAdd('is-active');
};

StateRestore.modalClean = function () {
	let header = _modal.find('header p');
	let body = _modal.find('section.modal-card-body');
	let close = _modal.find('button.delete');

	header.text('');
	body.empty();
	_modal.classRemove(StateRestore.classes.modal.table);

	close.off('.dtsr');
	_modal.off('.dtsr');
};

StateRestore.modalClose = function () {
	_modal.detach().classRemove('is-active');
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
		value: '',
		input: {
			checkbox: '',
			text: 'input'
		}
	},
	modal: {
		button: 'button is-primary is-pulled-right',
		table: 'modal-lg'
	},
	table: {
		table: 'table is-striped is-hoverable',
		button: 'button is-small'
	}
});
