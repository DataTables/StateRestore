describe('stateRestore - options - stateRestore.splitSecondaries', function () {
	let table;
	let i = 0;

	dt.libs({
		js: ['jquery', 'datatables', 'buttons', 'select', 'staterestore'],
		css: ['datatables', 'buttons', 'select', 'staterestore']
	});

	describe('Functional tests', function () {
		dt.html('basic');
		it('Create a state', function () {
			$.fx.off = true; // disables lightbox animation
			table = $('#example').DataTable({
				dom: 'Blfrtip',
				buttons: [
					'createState',

					{
						extend: 'savedStates',
						config: {
							splitSecondaries: [
								'updateState',
								'removeState',
								'<h4>unit test</h4>',
								{
									text: 'increment',
									autoclose: true,
									action: function () {
										i++;
									}
								},
								{
									extend: 'renameState',
									className: 'red-border'
								}
							]
						}
					}
				]
			});

			$('.dt-button').click();
			$('.dt-button-split button:eq(0)').click();
			$('.dt-button-collection .dt-button-down-arrow').click();

			expect(i).toBe(0);
			expect($('.dt-button-split-left button').length).toBe(4);
			expect($('.dt-button-split-left h4').text()).toBe('unit test');
			expect($('.dt-button-split-left button:eq(2)').text()).toBe('increment');
		});
		it('... click on custom button', function () {
			$('.dt-button-split-left button:eq(2)').click();
			expect(i).toBe(1);
		});
		it('Add another state', function () {
			$('.dataTables_info').click();
			$('.dt-button').click();

			$('.dt-button-split button:eq(0)').click();

			expect($('.dt-button-collection button').length).toBe(4);
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
