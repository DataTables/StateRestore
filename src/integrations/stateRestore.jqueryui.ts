/*! StateRestore jQuery UI styling for DataTables
 * Copyright (c) SpryMedia Ltd - datatables.net/license
 */

import DataTable, { Dom, util } from 'datatables.net';

let jquiModal;
let modalEl: Dom;
const StateRestore = DataTable.StateRestore;

function assertModal() {
	if (modalEl) {
		return;
	}

	modalEl = Dom.c('div')
		.classAdd('dtsr-jqui-modal')
		.append(Dom.c('div').classAdd('dtsr-jqui-modal-content'));
}

/*
 * Bootstrap modal for StateRestore.
 */
StateRestore.modal = function (title, content, className, closeCb) {
	assertModal();

	let $ = DataTable.use('jq');

	if (!jquiModal) {
		jquiModal = $(modalEl.get(0)).appendTo('body').dialog({
			autoOpen: false,
			closeOnEscape: false,
			maxWidth: '100%'
		});
	}

	let header = modalEl.parent().find('span.ui-dialog-title');
	let body = modalEl.parent().find('div.dtsr-jqui-modal-content');
	let close = modalEl.parent().find('div.ui-dialog-titlebar button');

	// Display the content
	header.text(title);
	body.append(content);

	// Close event handler
	close.on('click.dtsr', () => {
		closeCb();
	});
	modalEl.on('click.dtsr', e => {
		if (Dom.s(e.target).classHas('modal')) {
			closeCb();
		}
	});

	// No easy way to use classes to change the width - need to use JS
	if (className === 'modal-lg') {
		jquiModal.dialog('option', 'width', 800);
	}
	else {
		jquiModal.dialog('option', 'width', 500);
	}

	jquiModal.dialog('open');
};

StateRestore.modalClean = function () {
	assertModal();

	let header = modalEl.parent().find('span.ui-dialog-title');
	let body = modalEl.parent().find('div.dtsr-jqui-modal-content');
	let close = modalEl.parent().find('div.ui-dialog-titlebar button');

	header.text('');
	body.empty();

	close.off('.dtsr');
	modalEl.off('.dtsr');
};

StateRestore.modalClose = function () {
	assertModal();

	if (jquiModal) {
		jquiModal.dialog('close');
	}
};

/*
 * Setup classes for integration. Uses the form classes from DataTables default
 * since jQuery UI doesn't provide such classes.
 */
util.object.assignDeep(StateRestore.classes, {
	modal: {
		button: 'ui-button ui-widget ui-corner-all',
		table: 'modal-lg'
	},
	table: {
		table: 'display',
		button: 'ui-button ui-widget ui-corner-all'
	}
});
