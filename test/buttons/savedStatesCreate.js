describe('stateRestore - buttons - savedStatesCreate', function () {
	let table;

	dt.libs({
		js: ['jquery', 'datatables', 'buttons', 'staterestore'],
		css: ['datatables', 'buttons', 'staterestore']
	});

	describe('Functional tests', function () {
		dt.html('basic');
		it('Change page', function () {
			$.fx.off = true; // disables lightbox animation

			table = $('#example').DataTable({
				dom: 'Blfrtip',
				buttons: ['savedStatesCreate']
			});

			table.page(2).draw(false);

			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Gloria Little');
		});
		it('No states', function () {
			$('.dt-button:eq(0)').click();

			expect($('.dt-button-collection .dt-button').length).toBe(1);
			expect($('.dt-button-collection .dt-button').text()).toBe('Create State');
		});
		it('Create a state', function () {
			$('.dt-button-collection .dt-button').click();

			expect($('.dtsr-creation').length).toBe(0);
			expect($('.dt-button-collection .dt-button').length).toBe(3);
			expect($('.dt-button-collection .dt-button:eq(1)').text()).toBe('State 1');
		});
		it('Reset table', function () {
			table.draw();

			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Airi Satou');
		});
		it('Load the state', function () {
			$('.dt-button-split button:eq(0)').click();

			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Gloria Little');
		});

		dt.html('basic');
		it('Change text', function () {
			$.fx.off = true; // disables lightbox animation

			table = $('#example').DataTable({
				dom: 'Blfrtip',
				language: {
					buttons: {
						savedStates: 'unit test',
						createState: 'other test'
					}
				},
				buttons: ['savedStatesCreate']
			});

			expect($('.dt-button:eq(0) span:eq(0)').text()).toBe('unit test');
		});
		it('No states', function () {
			$('.dt-button:eq(0)').click();

			expect($('.dt-button-collection .dt-button:eq(0)').text()).toBe('other test');
		});

		dt.html('basic');
		it('Check options can be set', function () {
			$.fx.off = true; // disables lightbox animation

			table = $('#example').DataTable({
				dom: 'Blfrtip',
				buttons: [{
					extend: 'savedStatesCreate',
					config: {
						creationModal: true
					}
				}]
			});

			$('.dt-button:eq(0)').click();
			$('.dt-button-collection .dt-button').click();

			expect($('.dtsr-creation').length).toBe(1);
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
