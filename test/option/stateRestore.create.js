describe('stateRestore - options - stateRestore.create', function () {
	let table;

	dt.libs({
		js: ['jquery', 'datatables', 'buttons', 'staterestore'],
		css: ['datatables', 'buttons', 'staterestore']
	});

	describe('Functional tests', function () {
		// No need to check default, as states created in other tests
		dt.html('basic');
		it('Create a state', function () {
			$.fx.off = true; // disables lightbox animation

			table = $('#example').DataTable({
				dom: 'Blfrtip',
				buttons: [
					'createStateRestore',
					{
						extend: 'savedStates',
						config: {
							creation: false
						}
					}
				]
			});

			// $('.dt-button:eq(0)').click();
			// $('.dt-button:eq(1)').click();

			// expect($('.dt-btn-split-wrapper .dt-button').length).toBe(2);
		});
		// it('Check defaults', function () {
		// 	$('.dt-btn-split-wrapper .dt-button:eq(1)').click();

		// 	expect($('.dt-btn-split-drop-button:eq(2)').text()).toBe('Rename');
		// });
	});

	// describe('Tidy up', function () {
	// 	dt.html('basic');
	// 	it('Delete all state', function () {
	// 		table = $('#example').DataTable({
	// 			dom: 'Blfrtip',
	// 			buttons: ['createStateRestore', 'savedStates']
	// 		});
	// 		table.stateRestore.states().delete(true);
	// 	});
	// });
});
