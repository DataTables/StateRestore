describe('stateRestore - options - stateRestore.creationModal', function () {
	let table;

	dt.libs({
		js: ['jquery', 'datatables', 'buttons', 'staterestore'],
		css: ['datatables', 'buttons', 'staterestore']
	});

	describe('Functional tests', function () {
		// No need to check default, as states created in other tests
		dt.html('basic');
		it('createStateRestore - true', function () {
			$.fx.off = true; // disables lightbox animation

			table = $('#example').DataTable({
				dom: 'Blfrtip',
				buttons: [
					'createStateRestore',
					{
						extend: 'savedStates',
						config: {
							creationModal: true
						}
					}
				]
			});

			$('.dt-button:eq(0)').click();

			expect($('.dtsr-creation').length).toBe(1);
		});
		it('... and not created', function () {
			$('.dtsr-background').click();
			$('.dt-button:eq(1)').click();

			expect($('.dt-btn-split-wrapper .dt-button').length).toBe(0);
		});

		dt.html('basic');
		it('createStateRestore - false', function () {
			$.fx.off = true; // disables lightbox animation

			table = $('#example').DataTable({
				dom: 'Blfrtip',
				buttons: [
					'createStateRestore',
					{
						extend: 'savedStates',
						config: {
							creationModal: false
						}
					}
				]
			});

			$('.dt-button:eq(0)').click();

			expect($('.dtsr-creation').length).toBe(0);
		});
		it('... and is created', function () {
			$('.dtsr-background').click();
			$('.dt-button:eq(1)').click();

			expect($('.dt-btn-split-wrapper .dt-button').length).toBe(2);
		});
	});

	describe('Tidy up', function () {
		dt.html('basic');
		it('Delete all state', function () {
			table = $('#example').DataTable({
				dom: 'Blfrtip',
				buttons: ['createStateRestore', 'savedStates']
			});
			table.stateRestore.states().delete(true);
		});
	});
});