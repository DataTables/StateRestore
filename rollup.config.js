import resolve from '@rollup/plugin-node-resolve';

export default [
	{
		input: 'src/index.js',
		output: {
			file: process.env.OUT + '/js/dataTables.stateRestore.js',
			format: 'iife'
		},
		plugins: [resolve()]
	},
	{
		input: 'src/stateRestore.bootstrap.js',
		output: {
			file: process.env.OUT + '/js/stateRestore.bootstrap.js',
			format: 'iife'
		},
		plugins: [resolve()]
	},
	{
		input: 'src/stateRestore.bootstrap4.js',
		output: {
			file: process.env.OUT + '/js/stateRestore.bootstrap4.js',
			format: 'iife'
		},
		plugins: [resolve()]
	},
	{
		input: 'src/stateRestore.dataTables.js',
		output: {
			file: process.env.OUT + '/js/stateRestore.dataTables.js',
			format: 'iife'
		},
		plugins: [resolve()]
	},
	{
		input: 'src/stateRestore.foundation.js',
		output: {
			file: process.env.OUT + '/js/stateRestore.foundation.js',
			format: 'iife'
		},
		plugins: [resolve()]
	},
	{
		input: 'src/stateRestore.semanticui.js',
		output: {
			file: process.env.OUT + '/js/stateRestore.semanticui.js',
			format: 'iife'
		},
		plugins: [resolve()]
	}
];
