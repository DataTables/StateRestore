describe('stateRestore - options - stateRestore.saveState.select', function () {
	let table;

	dt.libs({
		js: ['jquery', 'datatables', 'buttons', 'select', 'staterestore'],
		css: ['datatables', 'buttons', 'select', 'staterestore']
	});

	describe('Functional tests', function () {
		dt.html('basic');
		it('Select - rows', function () {
			table = $('#example').DataTable({
				dom: 'BPlfrtip',
				rowId: 0,
				select: {
					style: 'multi'
				}
			});

			$('tbody tr:eq(2) td:eq(0)').click();
			$('tbody tr:eq(4) td:eq(0)').click();

			table.stateRestore.state.add('unit test');

			expect($('tr.selected').length).toBe(2);
			expect($('tr.selected:eq(0) td:eq(0)').text()).toBe('Ashton Cox');
			expect($('tr.selected:eq(1) td:eq(0)').text()).toBe('Brenden Wagner');
		});
		it('Unselect', function () {
			$('tbody tr:eq(2) td:eq(0)').click();
			$('tbody tr:eq(4) td:eq(0)').click();

			expect($('tr.selected').length).toBe(0);
		});
		it('Load state', function () {
			table.stateRestore.state('unit test').load();

			expect($('tr.selected').length).toBe(2);
			expect($('tr.selected:eq(0) td:eq(0)').text()).toBe('Ashton Cox');
			expect($('tr.selected:eq(1) td:eq(0)').text()).toBe('Brenden Wagner');
		});

		dt.html('basic');
		it('Select - cells', function () {
			table = $('#example').DataTable({
				dom: 'BPlfrtip',
				rowId: 0,
				select: {
					style: 'multi',
					items: 'cell'
				}
			});

			$('tbody tr:eq(2) td:eq(0)').click();
			$('tbody tr:eq(2) td:eq(3)').click();

			table.stateRestore.state('unit test').save();

			expect($('td.selected').length).toBe(2);
			expect($('td.selected:eq(0)').text()).toBe('Ashton Cox');
			expect($('td.selected:eq(1)').text()).toBe('66');
		});
		it('Unselect', function () {
			$('tbody tr:eq(2) td:eq(0)').click();
			$('tbody tr:eq(2) td:eq(3)').click();

			expect($('td.selected').length).toBe(0);
		});
		it('Load state', function () {
			table.stateRestore.state('unit test').load();

			expect($('td.selected').length).toBe(2);
			expect($('td.selected:eq(0)').text()).toBe('Ashton Cox');
			expect($('td.selected:eq(1)').text()).toBe('66');
		});

		dt.html('basic');
		it('Select - columns', function () {
			table = $('#example').DataTable({
				dom: 'BPlfrtip',
				rowId: 0,
				select: {
					style: 'multi',
					items: 'column'
				},
				buttons: ['createState', 'savedStates']
			});

			$('tbody tr:eq(2) td:eq(0)').click();
			$('tbody tr:eq(2) td:eq(3)').click();

			table.stateRestore.state('unit test').save();

			expect($('td.selected').length).toBe(20);
			expect($('td.selected:eq(0)').text()).toBe('Airi Satou');
			expect($('td.selected:eq(1)').text()).toBe('33');
		});
		it('Unselect', function () {
			$('tbody tr:eq(2) td:eq(0)').click();
			$('tbody tr:eq(2) td:eq(3)').click();

			expect($('td.selected').length).toBe(0);
		});
		it('Load state', function () {
			table.stateRestore.state('unit test').load();

			expect($('td.selected').length).toBe(20);
			expect($('td.selected:eq(0)').text()).toBe('Airi Satou');
			expect($('td.selected:eq(1)').text()).toBe('33');
		});

		dt.html('basic');
		it('Select - disabled', function () {
			table = $('#example').DataTable({
				dom: 'BPlfrtip',
				rowId: 0,
				select: {
					style: 'multi'
				},
				buttons: [
					'createState',
					{
						extend: 'savedStates',
						config: {
							saveState: {
								select: false
							}
						}
					}
				]
			});

			$('tbody tr:eq(2) td:eq(0)').click();
			$('tbody tr:eq(4) td:eq(0)').click();

			table.stateRestore.state.add('unit test1');

			expect($('tr.selected').length).toBe(2);
			expect($('tr.selected:eq(0) td:eq(0)').text()).toBe('Ashton Cox');
			expect($('tr.selected:eq(1) td:eq(0)').text()).toBe('Brenden Wagner');
		});
		it('Unselect', function () {
			$('tbody tr:eq(2) td:eq(0)').click();
			$('tbody tr:eq(4) td:eq(0)').click();

			expect($('tr.selected').length).toBe(0);
		});
		it('Load state', function () {
			table.stateRestore.state('unit test1').load();

			expect($('tr.selected').length).toBe(0);
		});
	});

	describe('Tidy up', function () {
		dt.html('basic');
		it('Remove all state', function () {
			table = $('#example').DataTable({
				dom: 'lfrtip'
			});
			table.stateRestore.states().remove(true);
		});
	});
});
