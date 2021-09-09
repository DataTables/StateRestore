describe('stateRestore - options - language.stateRestore.creationModal.colReorder', function () {
	let table;

	dt.libs({
		js: ['jquery', 'datatables', 'buttons', 'colreorder', 'staterestore'],
		css: ['datatables', 'buttons', 'colreorder', 'staterestore']
	});

	describe('Functional tests', function () {
		dt.html('basic');
		it('Check defaults', function () {
			table = $('#example').DataTable({
				dom: 'Blfrtip',
				colReorder: true,
				buttons: [
					'createStateRestore',
					{
						extend: 'savedStates',
						config: {
							creationModal: true,
							toggle: {
								colReorder: true
							}
						}
					}
				]
			});

			// $('.dt-button:eq(0)').click();

			// DD-2231
			// expect($('.dtsr-creation-button').text()).toBe('Create');
		});

		dt.html('basic');
		it('Change text', function () {
			table = $('#example').DataTable({
				dom: 'Blfrtip',
				buttons: [
					'createStateRestore',
					{
						extend: 'savedStates',
						config: {
							creationModal: true
						}
					}
				],
				language: {
					stateRestore: {
						creationModal: {
							button: 'unit test'
						}
					}
				}
			});

			$('.dt-button:eq(0)').click();

			expect($('.dtsr-creation-button').text()).toBe('unit test');
		});
	});
});
