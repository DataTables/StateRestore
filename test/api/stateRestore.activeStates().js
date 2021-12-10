describe('stateRestore - api - stateRestore.activeStates()', function () {
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
			expect(typeof table.stateRestore.activeStates).toBe('function');
		});
		it('Returns an API instance', function () {
			// Needed because of DD-2391
			// table.stateRestore.state.add('unit test');
			expect(table.stateRestore.activeStates() instanceof $.fn.dataTable.Api).toBe(true);
		});
	});

	describe('Functional tests', function () {
		dt.html('basic');
		// it('Behaves when no states', function () {
		// 	table = $('#example').DataTable();

		// 	// See above
		// });
		it('Single state specified', function () {
			table.stateRestore.state.add('unit test');
			states = table.stateRestore.activeStates();

			console.log(JSON.stringify(states[0]))

			expect(states.length).toBe(1);
			expect(states[0].name).toBe('unit test');
			//expect(states[1].s.identifier).toBe('unit test4');
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
