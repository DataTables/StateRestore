describe('stateRestore - api - stateRestore.state().save()', function () {
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
			expect(typeof table.stateRestore.state().save).toBe('function');
		});
		it('Returns an API instance', function () {
			table.stateRestore.state.add('unit test');
			expect(table.stateRestore.state('unit test').save() instanceof $.fn.dataTable.Api).toBe(true);
		});
	});

	describe('Functional tests', function () {
		dt.html('basic');
		it('Load state', function () {
			$.fx.off = true; // disables lightbox animation
			table = $('#example').DataTable();
			states = table.stateRestore.state('unit test').load();
			
			expect($('#example tbody tr:eq(0) td:eq(0)').html()).toBe('Airi Satou');
		});
		it('Change page and save state', function () {
			table.page(2).draw(false);
			states = table.stateRestore.state('unit test').save();

			expect($('#example tbody tr:eq(0) td:eq(0)').html()).toBe('Gloria Little');
		});
		it('Change page and load state', function () {
			table.draw();
			states = table.stateRestore.state('unit test').load();

			expect($('#example tbody tr:eq(0) td:eq(0)').html()).toBe('Gloria Little');
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
