describe('stateRestore - options - stateRestore.toggle.scroller', function () {
	let table;

	dt.libs({
		js: ['jquery', 'datatables', 'buttons', 'scroller', 'staterestore'],
		css: ['datatables', 'buttons', 'scroller', 'staterestore']
	});

	describe('Functional tests', function () {
		dt.html('basic');
		it('Add a toggle', function () {
			table = $('#example').DataTable({
				dom: 'Blfrtip',
				scrollY: 200,
				scroller: true,
				buttons: [
					'createState',
					{
						extend: 'savedStates',
						config: {
							creationModal: true,
							toggle: {
								scroller: true
							}
						}
					}
				]
			});

			$('.dt-button:eq(0)').click();

			expect($('.dtsr-check-label').length).toBe(1);
			expect($('.dtsr-check-label').text()).toBe('Scroll Position');
		});
	});
});
