describe('stateRestore - options - language.buttons.savedStates', function () {
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

			expect($('.dt-button span:eq(0)').text()).toBe('Saved States');
		});

		dt.html('basic');
		it('Change text', function () {
			table = $('#example').DataTable({
				dom: 'Blfrtip',
				buttons: ['savedStates'],
				language: {
					buttons: {
						savedStates: 'unit test'
					}
				}
			});

			expect($('.dt-button span:eq(0)').text()).toBe('unit test');
		});
	});
});
