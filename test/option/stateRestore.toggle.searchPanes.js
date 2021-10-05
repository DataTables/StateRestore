describe('stateRestore - options - stateRestore.toggle.searchPanes', function () {
	let table;

	dt.libs({
		js: ['jquery', 'datatables', 'buttons', 'select', 'searchpanes', 'staterestore'],
		css: ['datatables', 'buttons', 'select', 'searchpanes', 'staterestore']
	});

	describe('Functional tests', function () {
		dt.html('basic');
		it('Add a toggle', function () {
			table = $('#example').DataTable({
				dom: 'BPlfrtip',
				buttons: [
					'createState',
					{
						extend: 'savedStates',
						config: {
							creationModal: true,
							toggle: {
								searchPanes: true
							}
						}
					}
				]
			});

			$('.dt-button:eq(0)').click();

			expect($('.dtsr-check-label').length).toBe(1);
			expect($('.dtsr-check-label').text()).toBe('SearchPanes');
		});
	});
});
