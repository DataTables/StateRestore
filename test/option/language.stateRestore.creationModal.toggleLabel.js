describe('stateRestore - options - language.stateRestore.creationModal.toggleLabel', function () {
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
								paging: true
							}
						}
					}
				]
			});

			$('.dt-button:eq(0)').click();

			expect($('.dtsr-name-label').eq(0).text()).toBe('Name:');
			expect($('.dtsr-name-label').eq(1).text()).toBe('Include:');
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
								paging: true
							}
						}
					}
				],
				language: {
					stateRestore: {
						creationModal: {
							toggleLabel: 'unit test'
						}
					}
				}
			});

			$('.dt-button:eq(0)').click();

			expect($('.dtsr-name-label').eq(0).text()).toBe('Name:');
			expect($('.dtsr-name-label').eq(1).text()).toBe('unit test');
		});
	});
});
