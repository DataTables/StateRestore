describe('stateRestore - api - stateRestore.state.add()', function () {
	let table;

	dt.libs({
		js: ['jquery', 'datatables', 'buttons', 'staterestore'],
		css: ['datatables', 'buttons', 'staterestore']
	});

	describe('Check the defaults', function () {
		dt.html('basic');
		it('Exists and is a function', function () {
			$.fx.off = true; // disables lightbox animation

			table = $('#example').DataTable();

			expect(typeof table.stateRestore.state.add).toBe('function');
		});
		it('Returns an API instance', function() {
			expect(table.stateRestore.state.add('unit test') instanceof $.fn.dataTable.Api).toBe(true);
		});
	});

	describe('Functional tests', function () {
		dt.html('basic');
		it('Create a state', function () {
			$.fx.off = true; // disables lightbox animation

			table = $('#example').DataTable();

			table.page(2).draw(false);

			table.stateRestore.state.add('Page 3');

			expect($('tbody tr td:eq(0)').text()).toBe('Gloria Little');
		});
		it('... reset', function () {
			table.page(2).draw();
			expect($('tbody tr td:eq(0)').text()).toBe('Airi Satou');
		});
		it('... load the state', function () {
			table.stateRestore.state('Page 3').load();
			expect($('tbody tr td:eq(0)').text()).toBe('Gloria Little');
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
