describe('stateRestore - event - stateRestore-change', function () {
	let table;
	let states;
	let params;
	let count = 0;

	dt.libs({
		js: ['jquery', 'datatables', 'buttons', 'staterestore'],
		css: ['datatables', 'buttons', 'staterestore']
	});

	describe('Check the defaults', function () {
		dt.html('basic_id');
		it('Set stuff up', function () {
			table = $('#example')
				.DataTable()
				.on('stateRestore-change', function () {
					params = arguments;
				});

			expect(params).toBe(undefined);
		});
		it('Is called with the right parameters', function () {
			table.stateRestore.state.add('unit test');

			expect(params.length).toBe(1);
			expect(params[0] instanceof $.Event).toBe(true);
		});
	});

	describe('Functional tests', function () {
		dt.html('basic');
		it('Behaves when no states', function () {
			table = $('#example').DataTable({
				dom: 'Blfrtip',
				buttons: ['createState', 'savedStates']
			})
			.on('stateRestore-change', function() {
				count++;
			});

			expect(count).toBe(0);
		});
		it('Create', function () {
			table.stateRestore.state.add('unit test1');

			expect(count).toBe(1);
		});
		it('Rename', function () {
			table.stateRestore.state('unit test1').rename('unittest1');
			expect(count).toBe(2);
		});
		it('Update', function () {
			table.stateRestore.state('unittest1').save();
			expect(count).toBe(3);
		});
		it('Remove', function () {
			table.stateRestore.state('unittest1').remove(true);
			expect(count).toBe(4);
		});
		it('Remove all', function () {
			table.stateRestore.states().remove(true);
			expect(count).toBe(5);
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
