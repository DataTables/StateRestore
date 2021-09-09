describe('stateRestore - options - language.stateRestore.emptyStates', function () {
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
				buttons: ['savedStates']
			});

			$('.dt-button:eq(0)').click();

			expect($('.dtsr-emptyStates').text()).toBe('No saved states');
		});

		dt.html('basic');
		it('Change text', function () {
			table = $('#example').DataTable({
				dom: 'Blfrtip',
				buttons: ['savedStates'],
				language: {
					stateRestore: {
						emptyStates: 'unit test'
					}
				}
			});

			$('.dt-button:eq(0)').click();

			expect($('.dtsr-emptyStates').text()).toBe('unit test');
		});
	});
});
