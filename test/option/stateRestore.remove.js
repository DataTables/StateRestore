describe('stateRestore - options - stateRestore.remove', function () {
	let table;

	dt.libs({
		js: ['jquery', 'datatables', 'buttons', 'staterestore'],
		css: ['datatables', 'buttons', 'staterestore']
	});

	describe('Functional tests', function () {
		// No need to check default, as states removed in other tests
		dt.html('basic');
		it('Remove - true', function () {
			$.fx.off = true; // disables lightbox animation

			table = $('#example').DataTable({
				dom: 'Blfrtip',
				buttons: [
					'createState',
					{
						extend: 'savedStates',
						config: {
							remove: true
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
		it('Remove - false', function () {
			$.fx.off = true; // disables lightbox animation

			table = $('#example').DataTable({
				dom: 'Blfrtip',
				buttons: [
					'createState',
					{
						extend: 'savedStates',
						config: {
							remove: false
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
		it('... unable to remove via API', function () {
			table.stateRestore.states().remove();

			expect($('.dtsr-confirmation').length).toBe(0);
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
