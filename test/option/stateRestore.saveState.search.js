describe('stateRestore - options - stateRestore.saveState.search', function () {
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
					'createState',
					{
						extend: 'savedStates',
						config: {
							saveState: {
								search: true
							}
						}
					}
				]
			});

			table.search('cox').draw();

			$('.dt-button:eq(0)').click();
			$('.dt-button:eq(1)').click();

			expect($('.dt-button-collection .dt-button').length).toBe(2);
		});
		it('... clear buttons and draw', function () {
			$('.dt-button:eq(1)').click();
			table.search('').draw();

			expect($('tbody tr td:eq(0)').text()).toBe('Airi Satou');
		});
		it('... reload state', function () {
			$('.dt-button:eq(1)').click();
			$('.dt-btn-split-wrapper .dt-button:eq(0)').click();

			expect($('tbody tr td:eq(0)').text()).toBe('Ashton Cox');
		});

		dt.html('basic');
		it('False - Create state', function () {
			$.fx.off = true; // disables lightbox animation

			table = $('#example').DataTable({
				dom: 'Blfrtip',
				buttons: [
					'createState',
					{
						extend: 'savedStates',
						config: {
							saveState: {
								search: false
							}
						}
					}
				]
			});

			table.search('cox').draw();

			$('.dt-button:eq(0)').click();
			$('.dt-button:eq(1)').click();

			expect($('.dt-button-collection .dt-button').length).toBe(4);
		});
		it('... clear buttons and draw', function () {
			$('.dt-button:eq(1)').click();
			table.search('').draw();

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
				buttons: ['createState', 'savedStates']
			});
			table.stateRestore.states().delete(true);
		});
	});
});
