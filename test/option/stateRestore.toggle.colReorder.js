describe('stateRestore - options - stateRestore.toggle.colReorder', function () {
	let table;

	dt.libs({
		js: ['jquery', 'datatables', 'buttons', 'colreorder', 'staterestore'],
		css: ['datatables', 'buttons', 'colreorder', 'staterestore']
	});

	describe('Functional tests', function () {
		dt.html('basic');
		it('Add a toggle', function () {
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

			// TK DD-2231 COLIN
			// expect($('.dtsr-check-label').length).toBe(1);
			// expect($('.dtsr-check-label').text()).toBe('Paging');
		});
	});
});
