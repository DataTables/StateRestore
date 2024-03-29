describe('stateRestore - options - stateRestore.saveState.searchBuilder', function () {
	let table;

	dt.libs({
		js: ['jquery', 'datatables', 'buttons', 'datetime', 'searchbuilder', 'staterestore'],
		css: ['datatables', 'buttons', 'datetime', 'searchbuilder', 'staterestore']
	});

	function createCondition() {
		$('.dtsb-add').click();

		$('.dtsb-data').val(3);
		$('.dtsb-data').trigger('change');

		$('.dtsb-condition').val('>');
		$('.dtsb-condition').trigger('change');

		$('.dtsb-value').val('61');
		$('.dtsb-value').trigger('input');
	}

	describe('Functional tests', function () {
		dt.html('basic');
		it('True - Create state', function (done) {
			$.fx.off = true; // disables lightbox animation

			table = $('#example').DataTable({
				dom: 'BQlfrtip',
				buttons: [
					'createState',
					{
						extend: 'savedStates',
						config: {
							saveState: {
								searchBuilder: true
							}
						}
					}
				]
			});

			createCondition();

			dt.sleep(250).then(() => {
				$('.dt-button:eq(0)').click();
				$('.dt-button:eq(1)').click();
				expect($('.dt-button-collection .dt-button').length).toBe(2);
				done();
			});
		});
		it('... clear buttons and draw', function () {
			$('.dt-button:eq(1)').click();

			$('.dtsb-clearAll').click();

			expect($('tbody tr td:eq(0)').text()).toBe('Airi Satou');
		});
		it('... reload state', function () {
			$('.dt-button:eq(1)').click();
			$('.dt-button-split .dt-button:eq(0)').click();

			expect($('tbody tr td:eq(0)').text()).toBe('Ashton Cox');
		});

		dt.html('basic');
		it('False - Create state', function (done) {
			$.fx.off = true; // disables lightbox animation

			table = $('#example').DataTable({
				dom: 'BQlfrtip',
				buttons: [
					'createState',
					{
						extend: 'savedStates',
						config: {
							saveState: {
								searchBuilder: false
							}
						}
					}
				]
			});

			createCondition();

			dt.sleep(250).then(() => {
				$('.dt-button:eq(0)').click();
				$('.dt-button:eq(1)').click();
				expect($('.dt-button-collection .dt-button').length).toBe(4);
				done();
			});
		});
		it('... clear buttons and draw', function () {
			$('.dt-button:eq(1)').click();

			$('.dtsb-clearAll').click();

			expect($('tbody tr td:eq(0)').text()).toBe('Airi Satou');
		});
		it('... reload state', function () {
			$('.dt-button:eq(1)').click();
			$('.dt-button-split .dt-button:eq(2)').click();

			expect($('tbody tr td:eq(0)').text()).toBe('Airi Satou');
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
