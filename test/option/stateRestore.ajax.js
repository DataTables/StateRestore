describe('stateRestore - options - stateRestore.ajax', function () {
	let table;
	let args;
	let count = 0;

	dt.libs({
		js: ['jquery', 'datatables', 'buttons', 'staterestore'],
		css: ['datatables', 'buttons', 'staterestore']
	});

	describe('Functional tests', function () {
		dt.html('basic');
		it('Table load', function () {
			$.fx.off = true; // disables lightbox animation

			table = $('#example').DataTable({
				dom: 'Blfrtip',
				buttons: [
					'createState',
					{
						extend: 'savedStates',
						config: {
							ajax: function () {
								args = arguments;
								count++;
								if(args[0].action !== "load") {
									args[1].call();
								}
							}
						}
					}
				]
			});

			expect(args.length).toBe(2);
			expect(count).toBe(1);
			expect(args[0].action).toBe('load');
			expect(typeof args[1]).toBe('function');
		});
		it('Create', function () {
			$('.dt-button:eq(0)').click();

			expect(args.length).toBe(2);
			expect(count).toBe(2);
			expect(args[0].action).toBe('save');
		});
		it('Update', function () {
			args = undefined;

			$('.dt-button:eq(1)').click();
			$('.dt-button-split button:eq(1)').click();
			$('.dt-button-collection button:eq(0)').click();

			expect(args.length).toBe(2);
			expect(count).toBe(3);
			expect(args[0].action).toBe('save');
		});  
		it('Rename', function () {
			args = undefined;

			$('.dt-button:eq(1)').click();
			$('.dt-button-split button:eq(1)').click();
			$('.dt-button-collection button:eq(1)').click();

			$('input.dtsr-input').val('unit test');

			$('.dtsr-confirmation-button').click();

			expect(args.length).toBe(2);
			expect(count).toBe(4);
			expect(args[0].action).toBe('rename');
		});
		it('Remove', function () {
			args = undefined;

			$('.dt-button:eq(1)').click();
			$('.dt-button-split button:eq(1)').click();
			$('.dt-button-collection button:eq(2)').click();

			$('.dtsr-confirmation-button').click();

			expect(args.length).toBe(2);
			expect(count).toBe(5);
			expect(args[0].action).toBe('remove');
		});
	});
});
