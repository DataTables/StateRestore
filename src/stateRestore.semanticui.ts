/*! Bootstrap integration for DataTables' StateRestore
 * © SpryMedia Ltd - datatables.net/license
 */

declare var DataTable: any;

$.extend(true, DataTable.StateRestoreCollection.classes, {
	checkBox: 'dtsr-check-box form-check-input',
	checkLabel: 'dtsr-check-label form-check-label',
	checkRow: 'dtsr-check-row form',
	creationButton: 'dtsr-creation-button ui button primary',
	creationForm: 'dtsr-creation-form modal-body',
	creationText: 'dtsr-creation-text modal-header',
	creationTitle: 'dtsr-creation-title modal-title',
	nameInput: 'dtsr-name-input form-control',
	nameLabel: 'dtsr-name-label form-label',
	nameRow: 'dtsr-name-row ui input'
});

$.extend(true, DataTable.StateRestore.classes, {
	confirmation: 'dtsr-confirmation modal',
	confirmationButton: 'dtsr-confirmation-button ui button primary',
	confirmationText: 'dtsr-confirmation-text modal-body',
	renameModal: 'dtsr-rename-modal ui input'
});
