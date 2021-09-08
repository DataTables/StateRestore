describe('stateRestore - options - language.stateRestore.creationModal.searchPanes', function () {
	let table;

	dt.libs({
		js: ['jquery', 'datatables', 'buttons', 'select', 'searchpanes', 'staterestore'],
		css: ['datatables', 'buttons', 'select', 'searchpanes', 'staterestore']
	});

	describe('Functional tests', function () {
		dt.html('basic');
		it('Check defaults', function () {
			table = $('#example').DataTable({
				dom: 'PBlfrtip',
				buttons: [
					'createStateRestore',
					{
						extend: 'savedStates',
						config: {
							creationModal: true,
							toggle: {
								searchPanes: true
							}
						}
					}
				]
			});

			$('.dt-button:eq(0)').click();

			expect($('.dtsr-check-label').text()).toBe('SearchPanes');
		});

		// DD-2230
		dt.html('basic');
		it('Change text', function () {
			table = $('#example').DataTable({
				dom: 'QBlfrtip',
				buttons: [
					'createStateRestore',
					{
						extend: 'savedStates',
						config: {
							creationModal: true,
							toggle: {
								searchPanes: true
							}
						}
					}
				],
				language: {
					stateRestore: {
						creationModal: {
							searchPanes: 'unit test'
						}
					}
				}
			});

			$('.dt-button:eq(0)').click();

			expect($('.dtsr-check-label').text()).toBe('unit test');
		});
	});
});
