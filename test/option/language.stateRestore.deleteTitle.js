describe('stateRestore - options - language.stateRestore.deleteTitle', function () {
	let table;

	dt.libs({
		js: ['jquery', 'datatables', 'buttons', 'staterestore'],
		css: ['datatables', 'buttons', 'staterestore']
	});

	describe('Functional tests', function () {
		dt.html('basic');
		it('Create a state', function () {
			$.fx.off = true; // disables lightbox animation

			table = $('#example').DataTable({
				dom: 'Blfrtip',
				buttons: ['createStateRestore', 'savedStates']
			});

			$('.dt-button:eq(0)').click();
			$('.dt-button:eq(1)').click();

			expect($('.dt-btn-split-wrapper .dt-button').length).toBe(2);
		});
		it('Check defaults', function () {
			$('.dt-btn-split-wrapper .dt-button:eq(1)').click();
			$('.dt-btn-split-drop-button:eq(1)').click();

			expect($('.dtsr-confirmation-title').text()).toBe('Delete State');
		});

		dt.html('basic');
		it('Change text', function () {
			table = $('#example').DataTable({
				dom: 'Blfrtip',
				buttons: ['createStateRestore', 'savedStates'],
				language: {
					stateRestore: {
						deleteTitle: 'unit test'
					}
				}
			});

			$('.dt-button:eq(1)').click();
			$('.dt-btn-split-wrapper .dt-button:eq(1)').click();
			$('.dt-btn-split-drop-button:eq(1)').click();

			expect($('.dtsr-confirmation-title').text()).toBe('unit test');
		});
	});

	describe('Tidy up', function () {
		dt.html('basic');
		it('Delete all state', function () {
			table = $('#example').DataTable({
				dom: 'Blfrtip',
				buttons: ['createStateRestore', 'savedStates']
			});
			table.stateRestore.states().delete(true);
		});
	});
});
