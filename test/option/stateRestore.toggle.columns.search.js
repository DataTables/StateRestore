describe('stateRestore - options - stateRestore.toggle.columns.searching', function () {
	let table;

	dt.libs({
		js: ['jquery', 'datatables', 'buttons', 'staterestore'],
		css: ['datatables', 'buttons', 'staterestore']
	});

	describe('Functional tests', function () {
		dt.html('basic');
		it('Add a toggle', function () {
			table = $('#example').DataTable({
				dom: 'Blfrtip',
				buttons: [
					'createStateRestore',
					{
						extend: 'savedStates',
						config: {
							creationModal: true,
							toggle: {
								columns: {
									search: true
								}
							}
						}
					}
				]
			});

			$('.dt-button:eq(0)').click();

			expect($('.dtsr-check-label').length).toBe(1);
			expect($('.dtsr-check-label').text()).toBe('Column Search');
		});
	});
});
