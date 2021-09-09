describe('stateRestore - options - language.stateRestore.creationModal.columns.visible', function () {
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
							creationModal: true,
							toggle: {
								columns: {
									visible: true
								}
							}
						}
					}
				]
			});

			$('.dt-button:eq(0)').click();

			expect($('.dtsr-check-label').text()).toBe('Column Visibility');
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
		// 					creationModal: true,
		// 					toggle: {
		// 						columns: {
		// 							visible: true
		// 						}
		// 					}
		// 				}
		// 			}
		// 		],
		// 		language: {
		// 			stateRestore: {
		// 				creationModal: {
		// 					columns: {
		// 						visible: 'unit test'
		// 					}
		// 				}
		// 			}
		// 		}
		// 	});

		// 	$('.dt-button:eq(0)').click();

		// 	expect($('.dtsr-check-label').text()).toBe('unit test');
		// });
	});
});