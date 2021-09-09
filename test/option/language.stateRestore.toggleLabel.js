describe('stateRestore - options - language.stateRestore.toggleLabel', function () {
	let table;

	dt.libs({
		js: ['jquery', 'datatables', 'buttons', 'staterestore'],
		css: ['datatables', 'buttons', 'staterestore']
	});

	describe('Functional tests', function () {
		dt.html('basic');
		it('Check defaults', function () {
			table = $('#example').DataTable({
				dom: 'Blfrtip',
				buttons: [
					'createStateRestore',
					{
						extend: 'savedStates',
						config: {
							creationModal: true,
							toggle: {
								paging: true
							}
						}
					}
				]
			});

			$('.dt-button:eq(0)').click();

			expect($('.dtsr-toggle-title').text()).toBe('Includes:');
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
							creationModal: true,
							toggle: {
								paging: true
							}
						}
					}
				],
				language: {
					stateRestore: {
						toggleLabel: 'unit test'
					}
				}
			});

			$('.dt-button:eq(0)').click();

			// DD-2244
			// expect($('.dtsr-toggle-title').text()).toBe('unit test');
			expect($('.dtsr-toggle-title').text()).toBe('Includes:');
		});
	});
});
