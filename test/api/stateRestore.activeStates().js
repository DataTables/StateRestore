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
			expect(table.stateRestore.activeStates() instanceof $.fn.dataTable.Api).toBe(true);
		});
	});

	describe('Functional tests', function () {
		dt.html('basic');
		it('Behaves when no states', function () {
			table = $('#example').DataTable();
			states = table.stateRestore.activeStates();

			expect(states.length).toBe(0);
		});
		it('Single state specified', function () {
			table.stateRestore.state.add('unit test');
			states = table.stateRestore.activeStates();

			expect(states.length).toBe(1);
			expect(states[0].name).toBe('unit test');
		});
		it('No state is not on intitial page', function () {
			table.page(1).draw(false);
			states = table.stateRestore.activeStates();

			expect(states.length).toBe(0);
		});
		it('... but is if return to intitial page', function () {
			table.draw();
			states = table.stateRestore.activeStates();

			expect(states.length).toBe(1);
			expect(states[0].name).toBe('unit test');
		});
		it('Can return multiple states', function () {
			table.stateRestore.state.add('unit test1');
			states = table.stateRestore.activeStates();

			expect(states.length).toBe(2);
			expect(states[0].name).toBe('unit test');
			expect(states[1].name).toBe('unit test1');
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
