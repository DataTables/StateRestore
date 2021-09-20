describe('stateRestore - api - stateRestore.state().rename()', function () {
	let table;
	let states;

	dt.libs({
		js: ['jquery', 'datatables', 'buttons', 'staterestore'],
		css: ['datatables', 'buttons', 'staterestore']
	});

	describe('Check the defaults', function () {
		dt.html('basic');
		it('Exists and is a function', function () {
			$.fx.off = true; // disables lightbox animation
			table = $('#example').DataTable();
			expect(typeof table.stateRestore.state().rename).toBe('function');
		});
		it('Returns an API instance', function () {
			table.stateRestore.state.add('unit test');
			expect(table.stateRestore.state('unit test').rename('renamed') instanceof $.fn.dataTable.Api).toBe(true);
		});
	});

	describe('Functional tests', function () {
		dt.html('basic');
		it('Verify states', function () {
			$.fx.off = true; // disables lightbox animation
			table = $('#example').DataTable();
			states = table.stateRestore.states();
			
			expect(states.length).toBe(1);
			expect(states[0].s.identifier).toBe('renamed');
		});
		it('Rename state', function () {
			table.stateRestore.state('renamed').rename('test unit');

			states = table.stateRestore.states();

			expect(states.length).toBe(1);
			expect(states[0].s.identifier).toBe('test unit');
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
