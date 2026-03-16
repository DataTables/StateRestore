/**
 * Common Ajax handling
 *
 * @param dt Host DataTable
 * @param ajax The Ajax configuration object / string
 * @param data Data to send
 * @param success Success callback
 */
export function ajax(
	dt: any,
	ajax: undefined | null | false | Function | JQueryAjaxSettings | string,
	data: Record<string, any>,
	success: Function
) {
	if (! ajax) {
		return;
	}

	if (typeof ajax === 'function') {
		ajax.call(dt, data, success);
		return;
	}
	
	let base: any = {
		data: data,
		success: success,
		type: 'POST'
	};

	if (typeof ajax === 'string') {
		base.url = ajax;
	}
	else {
		$.extend(true, base, ajax);
	}

	if (base.submitAs === 'json') {
		base.data = JSON.stringify(base.data);
	}
	
	$.ajax(base);
}