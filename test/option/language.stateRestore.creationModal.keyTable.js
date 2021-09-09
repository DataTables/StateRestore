describe('stateRestore - options - language.stateRestore.creationModal.keyTable', function () {
	let table;

	dt.libs({
		js: ['jquery', 'datatables', 'buttons', 'select', 'searchpanes', 'keytable', 'staterestore'],
		css: ['datatables', 'buttons', 'select', 'searchpanes', 'keytable', 'staterestore']
	});

	describe('Functional tests', function () {
		dt.html('basic');
		it('Check defaults', function () {
			table = $('#example').DataTable({
				dom: 'Blfrtip',
				keys: true,
				buttons: [
					'createStateRestore',
					{
						extend: 'savedStates',
						config: {
							creationModal: true,
							toggle: {
								keyTable: true
							}
						}
					}
				]
			});

			$('.dt-button:eq(0)').click();

			expect($('.dtsr-check-label').text()).toBe('KeyTable');
		});

		dt.html('basic');
		it('Change text', function () {
			table = $('#example').DataTable({
				dom: 'Blfrtip',
				keys: true,
				buttons: [
					'createStateRestore',
					{
						extend: 'savedStates',
						config: {
							creationModal: true,
							toggle: {
								keyTable: true
							}
						}
					}
				],
				language: {
					stateRestore: {
						creationModal: {
							keyTable: 'unit test'
						}
					}
				}
			});

			$('.dt-button:eq(0)').click();

			expect($('.dtsr-check-label').text()).toBe('unit test');
		});
	});
});
