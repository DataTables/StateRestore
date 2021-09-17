describe('stateRestore - options - stateRestore.create', function () {
	let table;

	dt.libs({
		js: ['jquery', 'datatables', 'buttons', 'staterestore'],
		css: ['datatables', 'buttons', 'staterestore']
	});

	describe('Functional tests', function () {
		// No need to check default, as states created in other tests
		dt.html('basic');
		it('Create - true', function () {
			$.fx.off = true; // disables lightbox animation

			table = $('#example').DataTable({
				dom: 'Blfrtip',
				buttons: [
					'createState',
					{
						extend: 'savedStates',
						config: {
							create: true
						}
					}
				]
			});

			$('.dt-button:eq(0)').click();
			$('.dt-button:eq(1)').click();

			expect($('.dt-btn-split-wrapper .dt-button').length).toBe(2);
		});

		dt.html('basic');
		it('Create - false', function () {
			$.fx.off = true; // disables lightbox animation

			table = $('#example').DataTable({
				dom: 'Blfrtip',
				buttons: [
					'createState',
					{
						extend: 'savedStates',
						config: {
							create: false
						}
					}
				]
			});

			$('.dt-button:eq(0)').click();
			$('.dt-button:eq(1)').click();

			expect($('.dt-btn-split-wrapper .dt-button').length).toBe(2);
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
