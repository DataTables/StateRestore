describe('stateRestore - options - language.stateRestore.creationModal.title', function () {
	let table;

	dt.libs({
		js: ['jquery', 'datatables', 'buttons', 'staterestore'],
		css: ['datatables', 'buttons', 'staterestore']
	});

	describe('Functional tests', function () {
		dt.html('basic');
		it('Check defaults', function () {
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

			expect($('.dtsr-creation-title').text()).toBe('Create New State');
		});

		dt.html('basic');
		it('Change text', function () {
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
				],
				language: {
					stateRestore: {
						creationModal: {
							title: 'unit test'
						}
					}
				}
			});

			$('.dt-button:eq(0)').click();

			expect($('.dtsr-creation-title').text()).toBe('unit test');
		});
	});
});
