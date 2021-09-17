describe('stateRestore - options - stateRestore.saveState.scroller', function () {
	let table;

	dt.libs({
		js: ['jquery', 'datatables', 'buttons', 'scroller', 'staterestore'],
		css: ['datatables', 'buttons', 'scroller', 'staterestore']
	});

	describe('Functional tests', function () {
		dt.html('basic');
		it('True - Create state', function (done) {
			$.fx.off = true; // disables lightbox animation

			table = $('#example').DataTable({
				dom: 'Blfrtip',
				scrollY: 200,
				scroller: true,
				buttons: [
					'createState',
					{
						extend: 'savedStates',
						config: {
							saveState: {
								scroller: true
							}
						}
					}
				]
			});

			table.scroller.toPosition(30);

			setTimeout(() => {
				$('.dt-button:eq(0)').click();
				$('.dt-button:eq(1)').click();
	
				expect($('.dt-button-collection .dt-button').length).toBe(2);
				done();
			}, 50);

		});
		it('... clear buttons and draw', function (done) {
			$('.dt-button:eq(1)').click();

			table.scroller.toPosition(0);

			dt.sleep(200).then(() => {
				expect($('tbody tr td:eq(0)').text()).toBe('Airi Satou');
				done();
			});
		});
		it('... reload state', function (done) {
			$('.dt-button:eq(1)').click();
			$('.dt-btn-split-wrapper .dt-button:eq(0)').click();

			dt.sleep(200).then(() => {
				expect($('.dataTables_info').text()).toBe('Showing 31 to 36 of 57 entries');
				done();
			});
		});

		dt.html('basic');
		it('False - Create state', function () {
			$.fx.off = true; // disables lightbox animation

			table = $('#example').DataTable({
				dom: 'Blfrtip',
				scrollY: 200,
				scroller: true,
				buttons: [
					'createState',
					{
						extend: 'savedStates',
						config: {
							saveState: {
								scroller: false
							}
						}
					}
				]
			});

			table.scroller.toPosition(30);

			$('.dt-button:eq(0)').click();
			$('.dt-button:eq(1)').click();

			expect($('.dt-button-collection .dt-button').length).toBe(4);
		});
		it('... clear buttons and draw', function (done) {
			$('.dt-button:eq(1)').click();
			table.scroller.toPosition(0);

			dt.sleep(200).then(() => {
				expect($('tbody tr td:eq(0)').text()).toBe('Airi Satou');
				done();
			});
		});
		it('... reload state', function (done) {
			$('.dt-button:eq(1)').click();

			// TK COLIN DD-2275
			// $('.dt-btn-split-wrapper:eq(1) .dt-button:eq(0)').click();
			dt.sleep(200).then(() => {
				expect($('.dataTables_info').text()).toBe('Showing 1 to 6 of 57 entries');
				done();
			});
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
