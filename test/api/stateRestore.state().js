describe('stateRestore - api - stateRestore.state()', function () {
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
			expect(typeof table.stateRestore.state).toBe('function');
		});
		it('Returns an API instance', function () {
			table.stateRestore.state.add('unit test');
			expect(table.stateRestore.state('unit test') instanceof $.fn.dataTable.Api).toBe(true);
		});
	});

	describe('Functional tests', function () {
		dt.html('basic');
		it('Create states', function () {
			$.fx.off = true; // disables lightbox animation
			table = $('#example').DataTable();
			
			expect(table.stateRestore.state('unit test')[0].s.identifier).toBe('unit test');
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
