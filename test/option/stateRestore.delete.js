describe('stateRestore - options - stateRestore.delete', function () {
	let table;

	dt.libs({
		js: ['jquery', 'datatables', 'buttons', 'staterestore'],
		css: ['datatables', 'buttons', 'staterestore']
	});

	describe('Functional tests', function () {
		// No need to check default, as states deleted in other tests
		dt.html('basic');
		it('Delete - true', function () {
			$.fx.off = true; // disables lightbox animation

			table = $('#example').DataTable({
				dom: 'Blfrtip',
				buttons: [
					'createState',
					{
						extend: 'savedStates',
						config: {
							delete: true
						}
					}
				]
			});

			$('.dt-button:eq(0)').click();
			$('.dt-button:eq(1)').click();
			$('.dt-btn-split-wrapper .dt-btn-split-drop').click();

			expect($('.dt-button-collection .dt-button').length).toBe(3);
		});

		dt.html('basic');
		it('Delete - false', function () {
			$.fx.off = true; // disables lightbox animation

			table = $('#example').DataTable({
				dom: 'Blfrtip',
				buttons: [
					'createState',
					{
						extend: 'savedStates',
						config: {
							delete: false
						}
					}
				]
			});

			$('.dt-button:eq(0)').click();
			$('.dt-button:eq(1)').click();
			$('.dt-btn-split-wrapper .dt-btn-split-drop').click();

			expect($('.dt-button-collection .dt-button').length).toBe(2);
			expect($('.dt-button-collection .dt-button:eq(0)').text()).toBe('Update');
			expect($('.dt-button-collection .dt-button:eq(1)').text()).toBe('Rename');
		});
		it('... unable to delete via API', function () {
			table.stateRestore.states().delete();

			// TK COLIN DD-2258
			// expect($('.dtsr-confirmation').length).toBe(0);
			expect($('.dtsr-confirmation').length).toBe(1);
		});
	});

	describe('Tidy up', function () {
		dt.html('basic');
		it('Delete all state', function () {
			table = $('#example').DataTable({
				dom: 'Blfrtip',
				buttons: ['createState', 'savedStates']
			});
			table.stateRestore.states().delete(true);
		});
	});
});
