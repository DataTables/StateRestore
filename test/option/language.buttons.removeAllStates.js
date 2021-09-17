describe('stateRestore - options - language.buttons.removeAllStates', function () {
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
				buttons: ['removeAllStates']
			});

			expect($('.dt-button').text()).toBe('Remove All States');
		});

		dt.html('basic');
		it('Change text', function () {
			table = $('#example').DataTable({
				dom: 'Blfrtip',
				buttons: ['removeAllStates'],
				language: {
					buttons: {
						removeAllStates: 'unit test'
					}
				}
			});

			expect($('.dt-button').text()).toBe('unit test');
		});
	});
});
