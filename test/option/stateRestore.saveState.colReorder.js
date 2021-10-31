describe('stateRestore - options - stateRestore.saveState.colReorder', function () {
	let table;

	dt.libs({
		js: ['jquery', 'datatables', 'buttons', 'colreorder', 'staterestore'],
		css: ['datatables', 'buttons', 'colreorder', 'staterestore']
	});

	describe('Functional tests', function () {
		dt.html('basic');
		it('True - Create state - move', function () {
			$.fx.off = true; // disables lightbox animation

			table = $('#example').DataTable({
				dom: 'Blfrtip',
				colReorder: true,
				buttons: [
					'createState',
					{
						extend: 'savedStates',
						config: {
							saveState: {
								colReorder: true
							}
						}
					}
				]
			});

			table.colReorder.move(0, 1);

			$('.dt-button:eq(0)').click();
			$('.dt-button:eq(1)').click();

			expect($('.dt-button-collection .dt-button').length).toBe(2);
		});
		it('... clear buttons and draw', function () {
			$('.dt-button:eq(1)').click();
			table.colReorder.move(0, 1);

			expect($('tbody tr td:eq(0)').text()).toBe('Airi Satou');
		});
		it('... reload state', function () {
			$('.dt-button:eq(1)').click();
			$('.dt-btn-split-wrapper .dt-button:eq(0)').click();

			expect($('tbody tr td:eq(0)').text()).toBe('Accountant');
		});

		dt.html('basic');
		it('True - Create state - order', function () {
			$.fx.off = true; // disables lightbox animation

			table = $('#example').DataTable({
				dom: 'Blfrtip',
				colReorder: true,
				buttons: [
					'createState',
					{
						extend: 'savedStates',
						config: {
							saveState: {
								colReorder: true
							}
						}
					}
				]
			});

			table.colReorder.order([5, 4, 3, 2, 1, 0]);

			$('.dt-button:eq(0)').click();
			$('.dt-button:eq(1)').click();

			expect($('.dt-button-collection .dt-button').length).toBe(4);
		});
		it('... clear buttons and draw', function () {
			$('.dt-button:eq(1)').click();
			table.colReorder.order([5, 4, 3, 2, 1, 0]);

			expect($('tbody tr td:eq(0)').text()).toBe('Airi Satou');
		});
		it('... reload state', function () {
			$('.dt-button:eq(1)').click();
			$('.dt-btn-split-wrapper:eq(1) .dt-button:eq(0)').click();

			expect($('tbody tr td:eq(0)').text()).toBe('$75,650');
		});

		dt.html('basic');
		it('False - Create state - move', function () {
			$.fx.off = true; // disables lightbox animation

			table = $('#example').DataTable({
				dom: 'Blfrtip',
				colReorder: true,
				buttons: [
					'createState',
					{
						extend: 'savedStates',
						config: {
							saveState: {
								colReorder: true
							}
						}
					}
				]
			});

			table.colReorder.move(0, 1);

			$('.dt-button:eq(0)').click();
			$('.dt-button:eq(1)').click();

			expect($('.dt-button-collection .dt-button').length).toBe(6);
		});
		it('... clear buttons and draw', function () {
			$('.dt-button:eq(1)').click();
			table.colReorder.move(0, 1);

			expect($('tbody tr td:eq(0)').text()).toBe('Airi Satou');
		});
		it('... reload state', function () {
			$('.dt-button:eq(1)').click();
			$('.dt-btn-split-wrapper:eq(2) .dt-button:eq(0)').click();

			expect($('tbody tr td:eq(0)').text()).toBe('Accountant');
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
