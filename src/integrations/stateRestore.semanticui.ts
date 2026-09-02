/*! StateRestore Semantic UI styling for DataTables
 * Copyright (c) SpryMedia Ltd - datatables.net/license
 */

import DataTable, { Dom, util } from 'datatables.net';

let fModal;
const StateRestore = DataTable.StateRestore;
const _modal = Dom.c('div')
		.classAdd('ui modal dtsr-modal')
		.append(Dom.c('i').classAdd('close icon'))
		.append(Dom.c('div').classAdd('header'))
		.append(Dom.c('div').classAdd('content'));

/*
 * Bootstrap modal for StateRestore.
 */
StateRestore.modal = function (title, content, className, closeCb) {
	let $ = DataTable.use('jq');

	if (!fModal) {
		fModal = $(_modal.get(0))
			.appendTo('body')
			.modal('setting', {
				closable: false,
				onVisible: function () {
					let t = $(_modal).find('table');

					if (t.length) {
						new DataTable.Api(t).columns.adjust();
					}
				}
			});
	}

	let header = _modal.find('div.header');
	let body = _modal.find('div.content');
	let close = _modal.find('i.close');

	// Display the content
	header.text(title);
	body.append(content);
	_modal.classAdd(className);

	// Close event handler
	close.on('click.dtsr', (e) => {
		e.stopPropagation();
		closeCb();
	});
	
	$(document)
		.on('click.dtsr', 'div.ui.dimmer.modals', function (e) {
			if ($(e.target).hasClass('dimmer')) {
				closeCb();
			}
		});

	fModal.modal('show');
};

StateRestore.modalClean = function () {
	let $ = DataTable.use('jq');
	let header = _modal.find('div.header');
	let body = _modal.find('div.content');
	let close = _modal.find('i.close');

	header.text('');
	body.empty();
	_modal.classRemove(StateRestore.classes.modal.table);

	close.off('.dtsr');
	$(document).off('.dtsr');
};

StateRestore.modalClose = function () {
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
