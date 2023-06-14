describe('stateRestore - options - stateRestore.rename', function () {
	let table;

	dt.libs({
		js: ['jquery', 'datatables', 'buttons', 'staterestore'],
		css: ['datatables', 'buttons', 'staterestore']
	});

	describe('Functional tests', function () {
		// No need to check default, as states renamed in other tests
		dt.html('basic');
		it('Rename - true', function () {
			$.fx.off = true; // disables lightbox animation

			table = $('#example').DataTable({
				dom: 'Blfrtip',
				buttons: [
					'createState',
					{
						extend: 'savedStates',
						config: {
							rename: true
						}
					}
				]
			});

			$('.dt-button:eq(0)').click();
			$('.dt-button:eq(1)').click();
			$('.dt-button-split .dt-button-split-drop').click();

			expect($('.dt-button-collection .dt-button').length).toBe(3);
		});

		dt.html('basic');
		it('Rename - false', function () {
			$.fx.off = true; // disables lightbox animation

			table = $('#example').DataTable({
				dom: 'Blfrtip',
				buttons: [
					'createState',
					{
						extend: 'savedStates',
						config: {
							rename: false
						}
					}
				]
			});

			$('.dt-button:eq(0)').click();
			$('.dt-button:eq(1)').click();
			$('.dt-button-split .dt-button-split-drop').click();

			expect($('.dt-button-collection .dt-button').length).toBe(2);
			expect($('.dt-button-collection .dt-button:eq(0)').text()).toBe('Update');
			expect($('.dt-button-collection .dt-button:eq(1)').text()).toBe('Remove');
		});
		it('... clear collection', function (done) {
			dt.sleep(200).then(() => {
				$('.dt-button-background').click();
				done();
			});
		});
		it('... unable to rename via API', function () {
			table.stateRestore.state('State 1').rename('unit test');

			$('.dt-button:eq(1)').click();

			expect($('.dt-button:eq(2)').text()).toBe('State 1');
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
