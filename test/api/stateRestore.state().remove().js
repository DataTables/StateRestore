describe('stateRestore - api - stateRestore.state().remove()', function () {
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
			expect(typeof table.stateRestore.state().remove).toBe('function');
		});
		it('Returns an API instance', function () {
			table.stateRestore.state.add('unit test');
			expect(table.stateRestore.state('unit test').remove() instanceof $.fn.dataTable.Api).toBe(true);
		});
		it('Modal shown by deafult', function () {
			expect($('.dtsr-confirmation').length).toBe(1);
		});
		it('Close modal', function () {
			$('.dtsr-background').click();
			expect($('.dtsr-confirmation').length).toBe(0);
		});
		it('True skips modal', function () {
			table.stateRestore.state('unit test').remove(true);
			expect($('.dtsr-confirmation').length).toBe(0);
		});
	});

	describe('Functional tests', function () {
		dt.html('basic');
		it('Create states', function () {
			$.fx.off = true; // disables lightbox animation
			table = $('#example').DataTable();
			table.stateRestore.state.add('unit test1');
			table.stateRestore.state.add('unit test2');

			states = table.stateRestore.states();

			expect(states.length).toBe(2);
			expect(states[0].s.identifier).toBe('unit test1');
			expect(states[1].s.identifier).toBe('unit test2');
		});
		it('Remove a state', function () {
			table.stateRestore.state('unit test2').remove(true);

			states = table.stateRestore.states();

			expect(states.length).toBe(1);
			expect(states[0].s.identifier).toBe('unit test1');
		});
		it('Remove other state', function () {
			table.stateRestore.state('unit test1').remove(true);

			states = table.stateRestore.states();

			expect(states.length).toBe(0);
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
