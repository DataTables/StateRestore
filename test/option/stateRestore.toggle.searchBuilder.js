describe('stateRestore - options - stateRestore.toggle.searchBuilder', function () {
	let table;

	dt.libs({
		js: ['jquery', 'datatables', 'buttons', 'datetime', 'searchbuilder', 'staterestore'],
		css: ['datatables', 'buttons', 'datetime', 'searchbuilder', 'staterestore']
	});

	describe('Functional tests', function () {
		dt.html('basic');
		it('Add a toggle', function () {
			table = $('#example').DataTable({
				dom: 'BQlfrtip',
				buttons: [
					'createStateRestore',
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

			expect($('.dtsr-check-label').length).toBe(1);
			expect($('.dtsr-check-label').text()).toBe('SearchBuilder');
		});
	});
});
