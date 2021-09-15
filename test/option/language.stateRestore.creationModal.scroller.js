describe('stateRestore - options - language.stateRestore.creationModal.scroller', function () {
	let table;

	dt.libs({
		js: ['jquery', 'datatables', 'buttons', 'scroller', 'staterestore'],
		css: ['datatables', 'buttons', 'scroller', 'staterestore']
	});

	describe('Functional tests', function () {
		dt.html('basic');
		it('Check defaults', function () {
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

			expect($('.dtsr-check-label').text()).toBe('Scroll Position');
		});

		dt.html('basic');
		it('Change text', function () {
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
				],
				language: {
					stateRestore: {
						creationModal: {
							scroller: 'unit test'
						}
					}
				}
			});

			$('.dt-button:eq(0)').click();

			expect($('.dtsr-check-label').text()).toBe('unit test');
		});
	});
});
