describe('stateRestore - options - language.stateRestore.creationModal.name', function () {
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

			expect($('.dtsr-name-label').text()).toBe('Name:');
		});

		// DD-2230
		// dt.html('basic');
		// it('Change text', function () {
		// 	table = $('#example').DataTable({
		// 		dom: 'Blfrtip',
		// 		buttons: [
		// 			'createStateRestore',
		// 			{
		// 				extend: 'savedStates',
		// 				config: {
		// 					creationModal: true
		// 				}
		// 			}
		// 		],
		// 		language: {
		// 			stateRestore: {
		// 				creationModal: {
		// 					name: 'unit test'
		// 				}
		// 			}
		// 		}
		// 	});

		// 	$('.dt-button:eq(0)').click();

		// 	expect($('.dtsr-name-label').text()).toBe('unit test');
		// });
	});
});
