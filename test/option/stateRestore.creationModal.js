describe('stateRestore - options - stateRestore.creationModal', function () {
	let table;

	dt.libs({
		js: ['jquery', 'datatables', 'buttons', 'staterestore'],
		css: ['datatables', 'buttons', 'staterestore']
	});

	describe('Functional tests', function () {
		// No need to check default, as states created in other tests
		dt.html('basic');
		it('createState - true', function () {
			$.fx.off = true; // disables lightbox animation

			table = $('#example').DataTable({
				dom: 'Blfrtip',
				buttons: [
					'createState',
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
		it('createState - false', function () {
			$.fx.off = true; // disables lightbox animation

			table = $('#example').DataTable({
				dom: 'Blfrtip',
				buttons: [
					'createState',
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
		it('Remove all state', function () {
			table = $('#example').DataTable({
				dom: 'Blfrtip',
				buttons: ['createState', 'savedStates']
			});
			table.stateRestore.states().remove(true);
		});
	});
});
