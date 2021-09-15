describe('stateRestore - options - language.buttons.createState', function () {
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
				buttons: ['createState']
			});

			expect($('.dt-button').text()).toBe('Create State');
		});

		dt.html('basic');
		it('Change text', function () {
			table = $('#example').DataTable({
				dom: 'Blfrtip',
				buttons: ['createState'],
				language: {
					buttons: {
						createState: 'unit test'
					}
				}
			});

			expect($('.dt-button').text()).toBe('unit test');
		});
	});
});
