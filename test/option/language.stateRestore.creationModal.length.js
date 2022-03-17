describe('stateRestore - options - language.stateRestore.creationModal.length', function () {
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
					'createState',
					{
						extend: 'savedStates',
						config: {
							creationModal: true,
							toggle: {
								length: true
							}
						}
					}
				]
			});

			$('.dt-button:eq(0)').click();

			expect($('.dtsr-check-label').text()).toBe('Page Length');
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
								length: true
							}
						}
					}
				],
				language: {
					stateRestore: {
						creationModal: {
							length: 'unit test'
						}
					}
				}
			});

			$('.dt-button:eq(0)').click();

			expect($('.dtsr-check-label').text()).toBe('unit test');
		});
	});
});
