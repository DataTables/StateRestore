describe('stateRestore - options - stateRestore.preDefined', function () {
	let table;

	dt.libs({
		js: ['jquery', 'datatables', 'buttons', 'select', 'staterestore'],
		css: ['datatables', 'buttons', 'select', 'staterestore']
	});

	// TK COLIN could make this more complex and test all the options
	describe('Functional tests', function () {
		dt.html('basic');
		it('Column settings', function () {
			$.fx.off = true; // disables lightbox animation
			table = $('#example').DataTable({
				dom: 'Blfrtip',
				buttons: [
					{
						extend: 'savedStates',
						config: {
							preDefined: {
								first: {
									columns: [
										{
											visible: true,
											search: {
												search: 'co',
												smart: true,
												regex: false,
												caseInsensitive: true
											}
										},
										{visible: true},
										{visible: true},
										{visible: true},
										{visible: false},
										{visible: true}
									]
								}
							}
						}
					}
				]
			});
			$('.dt-button').click();
			$('.dt-btn-split-wrapper button:eq(0)').click();

			expect($('thead tr:eq(0) th').length).toBe(5);
			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Ashton Cox');
		});

		dt.html('basic');
		it('Page length', function (done) {
			$.fx.off = true; // disables lightbox animation
			table = $('#example').DataTable({
				dom: 'Blfrtip',
				buttons: [
					{
						extend: 'savedStates',
						config: {
							preDefined: {
								second: {
									start: 20,
									length: 5
								}
							}
						}
					}
				]
			});
			$('.dt-button:eq(0)').click();
			$('.dt-button:eq(1)').click();
			$('.dt-btn-split-wrapper .dt-btn-split-drop').click();

			setTimeout(() => {
				expect($('thead tr:eq(0) th').length).toBe(6);
				expect($('tbody tr').length).toBe(5);
				expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Gloria Little');
				done();
			}, 100)
		});

		dt.html('basic');
		it('Page length', function () {
			$.fx.off = true; // disables lightbox animation
			table = $('#example').DataTable({
				dom: 'Blfrtip',
				select: true,
				buttons: [
					{
						extend: 'savedStates',
						config: {
							preDefined: {
								third: {
									select: {
										rows: [2]
									}
								}
							}
						}
					}
				]
			});
			$('.dt-button:eq(0)').click();
			$('.dt-button:eq(1)').click();
			$('.dt-btn-split-wrapper .dt-btn-split-drop').click();

			expect($('thead tr:eq(0) th').length).toBe(6);
			expect($('tbody tr').length).toBe(10);
			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Airi Satou');
			expect($('tr.selected td:eq(0)').text()).toBe('Ashton Cox');
		});
	});

	describe('Tidy up', function () {
		dt.html('basic');
		it('Delete all state', function () {
			table = $('#example').DataTable({
				dom: 'Blfrtip',
				buttons: ['createStateRestore', 'savedStates']
			});
			table.stateRestore.states().remove(true);
		});
	});
});
