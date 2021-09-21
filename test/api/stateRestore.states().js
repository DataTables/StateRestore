describe('stateRestore - api - stateRestore.states()', function () {
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
			expect(typeof table.stateRestore.states).toBe('function');
		});
		it('Returns an API instance', function () {
			table.stateRestore.state.add('unit test');
			expect(table.stateRestore.states(['unit test']) instanceof $.fn.dataTable.Api).toBe(true);
		});
	});

	describe('Functional tests', function () {
		dt.html('basic');
		it('No states specified', function () {
			$.fx.off = true; // disables lightbox animation
			table = $('#example').DataTable();
			table.stateRestore.state.add('unit test1');
			table.stateRestore.state.add('unit test2');

			states = table.stateRestore.states();

			expect(states.length).toBe(3);
			expect(states[0].s.identifier).toBe('unit test');
			expect(states[1].s.identifier).toBe('unit test1');
			expect(states[2].s.identifier).toBe('unit test2');
		});
		it('One specified', function () {
			states = table.stateRestore.states(['unit test1']);

			// TK DD-2298 COLIN
			// expect(states.length).toBe(1);
			// expect(states[0].s.identifier).toBe('unit test1');
		});
		it('Two specified', function () {
			states = table.stateRestore.states(['unit test1', 'unit test']);

			// TK DD-2298 COLIN
			// 	expect(states.length).toBe(2);
			// expect(states[0].s.identifier).toBe('unit test1');
			// expect(states[1].s.identifier).toBe('unit test');
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
