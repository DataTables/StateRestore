/*! StateRestore Semantic UI styling for DataTables
 * Copyright (c) SpryMedia Ltd - datatables.net/license
 */

import DataTable, { Dom, util } from 'datatables.net';

let fModal;
let modalEl: Dom;
const StateRestore = DataTable.StateRestore;

function assertModal() {
	if (modalEl) {
		return;
	}

	modalEl = Dom.c('div')
		.classAdd('ui modal dtsr-modal')
		.append(Dom.c('i').classAdd('close icon'))
		.append(Dom.c('div').classAdd('header'))
		.append(Dom.c('div').classAdd('content'));
}

/*
 * Bootstrap modal for StateRestore.
 */
StateRestore.modal = function (title, content, className, closeCb) {
	assertModal();

	let $ = DataTable.use('jq');

	if (!fModal) {
		fModal = $(modalEl.get(0))
			.appendTo('body')
			.modal('setting', {
				closable: false,
				onVisible: function () {
					let t = $(modalEl).find('table');

					if (t.length) {
						new DataTable.Api(t).columns.adjust();
					}
				}
			});
	}

	let header = modalEl.find('div.header');
	let body = modalEl.find('div.content');
	let close = modalEl.find('i.close');

	// Display the content
	header.text(title);
	body.append(content);
	modalEl.classAdd(className);

	// Close event handler
	close.on('click.dtsr', e => {
		e.stopPropagation();
		closeCb();
	});

	$(document).on('click.dtsr', 'div.ui.dimmer.modals', function (e) {
		if ($(e.target).hasClass('dimmer')) {
			closeCb();
		}
	});

	fModal.modal('show');
};

StateRestore.modalClean = function () {
	assertModal();

	let $ = DataTable.use('jq');
	let header = modalEl.find('div.header');
	let body = modalEl.find('div.content');
	let close = modalEl.find('i.close');

	header.text('');
	body.empty();
	modalEl.classRemove(StateRestore.classes.modal.table);

	close.off('.dtsr');
	$(document).off('.dtsr');
};

StateRestore.modalClose = function () {
	assertModal();

	if (fModal) {
		fModal.modal('hide');
	}
};

/*
 * Setup classes for integration
 */
util.object.assignDeep(StateRestore.classes, {
	field: {
		checkboxOption: 'ui checkbox',
		container: 'field',
		error: 'ui error text',
		info: 'ui info text',
		label: '',
		value: '',
		input: {
			checkbox: 'form-check-input',
			text: 'form-control'
		}
	},
	form: 'ui form',
	modal: {
		button: 'ui button',
		table: 'large',
		form: 'small'
	},
	table: {
		table: 'ui selectable striped celled table',
		button: 'small ui button'
	}
});
