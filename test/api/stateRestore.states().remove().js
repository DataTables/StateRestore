describe('stateRestore - api - stateRestore.states().remove()', function () {
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
			table.stateRestore.state.add('unit test');

			expect(typeof table.stateRestore.states().remove).toBe('function');
		});
		it('Returns an API instance', function () {
			expect(table.stateRestore.states().remove() instanceof $.fn.dataTable.Api).toBe(true);
		});
		it('Modal shown by deafult', function () {
			expect($('.dtsr-confirmation').length).toBe(1);
		});
		it('Close modal', function () {
			$('.dtsr-background').click();
			expect($('.dtsr-confirmation').length).toBe(0);
		});
		it('True skips modal', function () {
			table.stateRestore.states().remove(true);
			expect($('.dtsr-confirmation').length).toBe(0);
		});
	});

	describe('Functional tests', function () {
		dt.html('basic');
		it('One states specified', function () {
			$.fx.off = true; // disables lightbox animation
			table = $('#example').DataTable();
			table.stateRestore.state.add('unit test1');
			table.stateRestore.state.add('unit test2');
			table.stateRestore.state.add('unit test3');
			table.stateRestore.state.add('unit test4');
			table.stateRestore.state.add('unit test5');

			table.stateRestore.states(['unit test3']).remove(true);
			states = table.stateRestore.states();

			// TK DD-2298 COLIN
			// expect(states.length).toBe(4);
			// expect(states[0].s.identifier).toBe('unit test1');
			// expect(states[1].s.identifier).toBe('unit test2');
			// expect(states[2].s.identifier).toBe('unit test4');
			// expect(states[2].s.identifier).toBe('unit test5');
		});
		// TK DD-2298 COLIN
		// it('Two states specified', function () {
		// 	table.stateRestore.states(['unit test1', 'unit test5']).remove(true);
		// 	states = table.stateRestore.states();

		// 	expect(states.length).toBe(2);
		// 	expect(states[1].s.identifier).toBe('unit test2');
		// 	expect(states[2].s.identifier).toBe('unit test4');
		// });
		// it('No states specified', function () {
		// 	table.stateRestore.states().remove(true);
		// 	states = table.stateRestore.states();

		// 	expect(states.length).toBe(0);
		// });
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
