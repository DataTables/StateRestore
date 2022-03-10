describe('stateRestore - buttons - removeAllStates', function () {
	let table;

	dt.libs({
		js: ['jquery', 'datatables', 'buttons', 'staterestore'],
		css: ['datatables', 'buttons', 'staterestore']
	});

	describe('Functional tests', function () {
		dt.html('basic');
		it('Create a three states', function () {
			$.fx.off = true; // disables lightbox animation

			table = $('#example').DataTable({
				dom: 'Blfrtip',
				buttons: ['createState', 'savedStates', 'removeAllStates']
			});

			$('.dt-buttons button:nth-child(1)').click();
			$('.dt-buttons button:nth-child(1)').click();
			$('.dt-buttons button:nth-child(1)').click();

			$('.dt-buttons button:nth-child(2)').click();

			expect($('.dt-button-collection .dt-button').length).toBe(6);
		});
		it('No states', function () {
			$('.dt-buttons button:nth-child(2)').click();
			$('.dt-buttons button:nth-child(3)').click();
			$('.dt-buttons button:nth-child(2)').click();

			expect($('.dt-button-collection .dt-button').length).toBe(0);

		});
	});

	describe('Tidy up', function () {
		dt.html('basic');
		it('Remove all state', function () {
			table = $('#example').DataTable({
				dom: 'Blfrtip',
				buttons: ['createState', 'savedStates', 'removeAllStates']
			});
			table.stateRestore.states().remove(true);
		});
	});
});
