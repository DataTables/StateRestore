describe('stateRestore - options - stateRestore.toggle.select', function () {
	let table;

	dt.libs({
		js: ['jquery', 'datatables', 'buttons', 'select', 'staterestore'],
		css: ['datatables', 'buttons', 'select', 'staterestore']
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
								select: true
							}
						}
					}
				]
			});

			$('.dt-button:eq(0)').click();

			expect($('.dtsr-check-label').length).toBe(1);
			expect($('.dtsr-check-label').text()).toBe('Select');
		});
	});
});
