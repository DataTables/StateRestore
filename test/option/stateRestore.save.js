describe('stateRestore - options - stateRestore.save', function () {
	let table;

	dt.libs({
		js: ['jquery', 'datatables', 'buttons', 'staterestore'],
		css: ['datatables', 'buttons', 'staterestore']
	});

	describe('Functional tests', function () {
		// No need to check default, as states saved in other tests
		dt.html('basic');
		it('Rename - true', function () {
			$.fx.off = true; // disables lightbox animation

			table = $('#example').DataTable({
				dom: 'Blfrtip',
				buttons: [
					'createState',
					{
						extend: 'savedStates',
						config: {
							save: true
						}
					}
				]
			});

			table.page(2).draw(false);

			$('.dt-button:eq(0)').click();
			$('.dt-button:eq(1)').click();
			$('.dt-btn-split-wrapper .dt-btn-split-drop').click();

			expect($('.dt-button-collection .dt-button').length).toBe(3);
		});

		dt.html('basic');
		it('Rename - false', function () {
			$.fx.off = true; // disables lightbox animation

			table = $('#example').DataTable({
				dom: 'Blfrtip',
				buttons: [
					'createState',
					{
						extend: 'savedStates',
						config: {
							save: false
						}
					}
				]
			});

			$('.dt-button:eq(0)').click();
			$('.dt-button:eq(1)').click();
			$('.dt-btn-split-wrapper .dt-btn-split-drop').click();

			expect($('.dt-button-collection .dt-button').length).toBe(1);
			expect($('.dt-button-collection .dt-button:eq(0)').text()).toBe('Delete');
		});
		it('... unable to update via API', function () {
			table.page(5).draw(false);
			table.stateRestore.state('State 1').save();
			table.draw();

			// TK DD-2278 COLIN - unable to reload to confirm update didn't happen
			// table.stateRestore.state('State 1').load();
			// expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Airi Satou');
		});
		it('... and unable to rename new with API', function () {
			// TK COLIN DD-2279
			// table.stateRestore.state('State 1').rename('unit test');
			// then check the rename didn't happen
		});
		it('... and unable to create new states with API', function () {
			table.stateRestore.state.add('unit test');
			$('.dt-button:eq(1)').click();
			expect($('.dt-btn-split-wrapper .dt-btn-split-drop').length).toBe(1);
		});
	});

	describe('Tidy up', function () {
		dt.html('basic');
		it('Delete all state', function () {
			table = $('#example').DataTable({
				dom: 'Blfrtip',
				buttons: ['createState', 'savedStates']
			});
			table.stateRestore.states().delete(true);
		});
	});
});
