describe('stateRestore - options - stateRestore.saveState.paging', function () {
	let table;

	dt.libs({
		js: ['jquery', 'datatables', 'buttons', 'staterestore'],
		css: ['datatables', 'buttons', 'staterestore']
	});

	describe('Functional tests', function () {
		dt.html('basic');
		it('True - Create state', function () {
			$.fx.off = true; // disables lightbox animation

			table = $('#example').DataTable({
				dom: 'Blfrtip',
				buttons: [
					'createStateRestore',
					{
						extend: 'savedStates',
						config: {
							saveState: {
								paging: true
							}
						}
					}
				]
			});

			table.page(2).draw(false);

			$('.dt-button:eq(0)').click();
			$('.dt-button:eq(1)').click();

			expect($('.dt-button-collection .dt-button').length).toBe(2);
		});
		it('... clear buttons and draw', function () {
			$('.dt-button:eq(1)').click();
			table.page(0).draw();

			expect($('tbody tr td:eq(0)').text()).toBe('Airi Satou');
		});
		it('... reload state', function () {
			$('.dt-button:eq(1)').click();
			$('.dt-btn-split-wrapper .dt-button:eq(0)').click();

			expect($('tbody tr td:eq(0)').text()).toBe('Gloria Little');
		});

		dt.html('basic');
		it('False - Create state', function () {
			$.fx.off = true; // disables lightbox animation

			table = $('#example').DataTable({
				dom: 'Blfrtip',
				buttons: [
					'createStateRestore',
					{
						extend: 'savedStates',
						config: {
							saveState: {
								paging: false
							}
						}
					}
				]
			});

			table.page(2).draw(false);

			$('.dt-button:eq(0)').click();
			$('.dt-button:eq(1)').click();

			expect($('.dt-button-collection .dt-button').length).toBe(4);
		});
		it('... clear buttons and draw', function () {
			$('.dt-button:eq(1)').click();
			table.page(0).draw();

			expect($('tbody tr td:eq(0)').text()).toBe('Airi Satou');
		});
		it('... reload state', function () {
			$('.dt-button:eq(1)').click();
			$('.dt-btn-split-wrapper:eq(1) .dt-button:eq(0)').click();

			expect($('tbody tr td:eq(0)').text()).toBe('Airi Satou');
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
