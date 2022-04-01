describe('stateRestore - buttons - removeAllStates', function () {
	let table;

	dt.libs({
		js: ['jquery', 'datatables', 'buttons', 'staterestore'],
		css: ['datatables', 'buttons', 'staterestore']
	});

	describe('Functional tests', function () {
		dt.html('basic');
		it('Create three states', function () {
			$.fx.off = true; // disables lightbox animation

			table = $('#example').DataTable({
				dom: 'Blfrtip',
				buttons: ['createState', 'savedStates', 'removeAllStates']
			});

			$('.dt-buttons button:nth-child(1)').click();
			$('.dt-buttons button:nth-child(1)').click();
			$('.dt-buttons button:nth-child(1)').click();

			$('.dt-buttons button:nth-child(2)').click();

			expect($('.dt-button-collection .dt-button').length).toBe(6);
		});
		it('... Remove all button is active', function () {
			// Close the collection
			$('.buttons-collection').click();

			expect($('.dtsr-removeAllStates').hasClass('disabled')).toBe(false);
		});		
		it('... Click remove all button', function () {
			$('.dtsr-removeAllStates').click();

			expect($('.dtsr-removeAllStates').hasClass('disabled')).toBe(true);
		});
		it('... and all states are removed', function () {
			$('.dt-buttons button:nth-child(2)').click();

			expect($('.dt-button-collection .dt-button').length).toBe(0);
		});

		dt.html('basic');
		it('Alternative UI: Create three states', function () {
			$.fx.off = true; // disables lightbox animation

			table = $('#example').DataTable({
				dom: 'Blfrtip',
				buttons: [{
					extend: 'savedStates',
					buttons: [
						'createState',
						'removeAllStates'
					]
				}]
			});

			$('.buttons-collection').click();
			$('.dt-button-collection .dt-button').click();
			$('.dt-button-collection .dt-button').click();
			$('.dt-button-collection .dt-button').click();

			expect($('.dt-button-collection .dt-button').length).toBe(8);
			expect($('.dtsr-emptyStates').text()).toBe('');

		});
		it('... Remove all button is active', function () {
			expect($('.dtsr-removeAllStates').hasClass('disabled')).toBe(false);
		});
		it('... Click remove all button', function () {
			$('.dtsr-removeAllStates').click();
			$('.buttons-collection').click();

			expect($('.dtsr-removeAllStates').hasClass('disabled')).toBe(true);
		});
		it('... and all states are removed', function () {
			$('.dt-buttons button:nth-child(2)').click();

			expect($('.dtsr-emptyStates').text()).toBe('No saved states');
		});
	});

	describe('Tidy up', function () {
		dt.html('basic');
		it('Remove all state', function () {
			table = $('#example').DataTable({
				dom: 'Blfrtip',
				buttons: ['createState', 'savedStates', 'removeAllStates']
			});
			table.stateRestore.states().remove(true);
		});
	});
});
