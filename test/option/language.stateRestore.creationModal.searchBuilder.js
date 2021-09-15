describe('stateRestore - options - language.stateRestore.creationModal.searchBuilder', function () {
	let table;

	dt.libs({
		js: ['jquery', 'datatables', 'buttons', 'datetime', 'searchbuilder', 'staterestore'],
		css: ['datatables', 'buttons', 'datetime', 'searchbuilder', 'staterestore']
	});

	describe('Functional tests', function () {
		dt.html('basic');
		it('Check defaults', function () {
			table = $('#example').DataTable({
				dom: 'QBlfrtip',
				buttons: [
					'createState',
					{
						extend: 'savedStates',
						config: {
							creationModal: true,
							toggle: {
								searchBuilder: true
							}
						}
					}
				]
			});

			$('.dt-button:eq(0)').click();

			expect($('.dtsr-check-label').text()).toBe('SearchBuilder');
		});

		dt.html('basic');
		it('Change text', function () {
			table = $('#example').DataTable({
				dom: 'QBlfrtip',
				buttons: [
					'createState',
					{
						extend: 'savedStates',
						config: {
							creationModal: true,
							toggle: {
								searchBuilder: true
							}
						}
					}
				],
				language: {
					stateRestore: {
						creationModal: {
							searchBuilder: 'unit test'
						}
					}
				}
			});

			$('.dt-button:eq(0)').click();

			expect($('.dtsr-check-label').text()).toBe('unit test');
		});
	});
});
