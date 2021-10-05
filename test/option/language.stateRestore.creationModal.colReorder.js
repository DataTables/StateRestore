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
					'createState',
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

			$('.dt-button:eq(0)').click();

			expect($('.dtsr-check-label').text()).toBe('Column Order');
		});

		dt.html('basic');
		it('Change text', function () {
			table = $('#example').DataTable({
				dom: 'Blfrtip',
				buttons: [
					'createState',
					{
						extend: 'savedStates',
						config: {
							creationModal: true,
							toggle: {
								colReorder: true
							}
						}
					}
				],
				language: {
					stateRestore: {
						creationModal: {
							colReorder: 'unit test'
						}
					}
				}
			});

			$('.dt-button:eq(0)').click();

			expect($('.dtsr-check-label').text()).toBe('unit test');
		});
	});
});
