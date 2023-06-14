describe('stateRestore - options - language.stateRestore.duplicateError', function () {
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
				buttons: ['createState', 'savedStates']
			});

			$('.dt-button:eq(0)').click();
			$('.dt-button:eq(1)').click();

			expect($('.dt-button-split .dt-button').length).toBe(2);
		});
		it('Check defaults', function () {
			$('.dt-button-split .dt-button:eq(1)').click();
			$('.dt-button-collection .dt-button:eq(1)').click();
			$('.dtsr-confirmation-button').click();

			expect($('.dtsr-modal-error').text()).toBe('A state with this name already exists.');
		});

		dt.html('basic');
		it('Change text', function () {
			table = $('#example').DataTable({
				dom: 'Blfrtip',
				buttons: ['createState', 'savedStates'],
				language: {
					stateRestore: {
						duplicateError: 'unit test'
					}
				}
			});

			$('.dt-button:eq(1)').click();
			$('.dt-button-split .dt-button:eq(1)').click();
			$('.dt-button-collection .dt-button:eq(1)').click();
			$('.dtsr-confirmation-button').click();

			expect($('.dtsr-modal-error').text()).toBe('unit test');
		});
	});

	describe('Tidy up', function () {
		dt.html('basic');
		it('Remove all state', function () {
			table = $('#example').DataTable({
				dom: 'Blfrtip',
				buttons: ['createState', 'savedStates']
			});
			table.stateRestore.states().remove(true);
		});
	});
});
