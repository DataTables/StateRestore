/*! Bootstrap integration for DataTables' StateRestore
 * © SpryMedia Ltd - datatables.net/license
 */

declare var DataTable: any;

$.extend(true, DataTable.StateRestoreCollection.classes, {
	checkBox: 'dtsr-check-box form-check-input',
	creationButton: 'dtsr-creation-button btn btn-secondary',
	creationForm: 'dtsr-creation-form modal-body',
	creationText: 'dtsr-creation-text modal-header',
	creationTitle: 'dtsr-creation-title modal-title',
	nameInput: 'dtsr-name-input form-control'
});

$.extend(true, DataTable.StateRestore.classes, {
	confirmationButton: 'dtsr-confirmation-button btn btn-secondary',
	input: 'dtsr-input form-control'
});
