describe('stateRestore - options - stateRestore.saveState.searchPanes', function () {
	let table;

	dt.libs({
		js: ['jquery', 'datatables', 'buttons', 'select', 'searchpanes', 'staterestore'],
		css: ['datatables', 'buttons', 'select', 'searchpanes', 'staterestore']
	});

	describe('Functional tests', function () {
		dt.html('basic');
		it('True - Create state', function () {
			$.fx.off = true; // disables lightbox animation

			table = $('#example').DataTable({
				dom: 'BPlfrtip',
				buttons: [
					'createState',
					{
						extend: 'savedStates',
						config: {
							saveState: {
								searchPanes: true
							}
						}
					}
				]
			});

			$('div.dtsp-searchPane table tbody tr:eq(14) td:eq(0)').click();

			$('.dt-button:eq(0)').click();
			$('.dt-button:eq(1)').click();
			expect($('.dt-button-collection .dt-button').length).toBe(2);
		});
		it('... clear buttons and draw', function (done) {
			$('.dt-button:eq(1)').click();
			$('.dtsp-clearAll').click();

			dt.sleep(250).then(() => {
				expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Airi Satou');
				done();
			});
		});
		it('... reload state', function (done) {
			$('.dt-button:eq(1)').click();
			$('.dt-btn-split-wrapper .dt-button:eq(0)').click();

			dt.sleep(250).then(() => {
				expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Ashton Cox');
				done();
			});
		});

		dt.html('basic');
		it('False - Create state', function () {
			$.fx.off = true; // disables lightbox animation

			table = $('#example').DataTable({
				dom: 'BPlfrtip',
				buttons: [
					'createState',
					{
						extend: 'savedStates',
						config: {
							saveState: {
								searchPanes: false
							}
						}
					}
				]
			});

			$('div.dtsp-searchPane table tbody tr:eq(14) td:eq(0)').click();

			$('.dt-button:eq(0)').click();
			$('.dt-button:eq(1)').click();
			expect($('.dt-button-collection .dt-button').length).toBe(4);
		});
		it('... clear buttons and draw', function (done) {
			$('.dt-button:eq(1)').click();
			$('.dtsp-clearAll').click();

			dt.sleep(250).then(() => {
				expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Airi Satou');
				done();
			});
		});
		it('... reload state', function () {
			// TK COLIN DD-2276
			// $('.dt-button:eq(1)').click();
			// $('.dt-btn-split-wrapper .dt-button:eq(0)').click();

			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Airi Satou');
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
