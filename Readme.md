# StateRestore

StateRestore is a state management UI for DataTables. It allows users to create multiple table states which can be saved and then reloaded at any time. This is particularly useful for complex tables where specific views are common and the user might wish to toggle between states.

States can be saved locally, or for a more permanent part of your table's features, to a remote database via Ajax, which also provides the ability for users to share states.


## Features

StateRestore provides the following features to enhance a DataTable:

* Two state management interfaces to suit your needs:
  * Table based
  * Dropdown list based
* Default state for when a table is loaded
* First class Ajax storage
* Optional sharing of states
* Customisation of which table settings are saved
* Comprehensive API
* Full support in our [server-side libraries](/manual/server)

And more! As with all DataTables extensions it can of course have all language strings localised, has complete documentation, and has styling integration with all of the DataTables supported styling libraries (e.g. Bootstrap, Bulma, Fomantic UI and others).


## Installation

The easiest way to install any extension for for DataTables, including StateRestore, is with the [download builder](/download). With the download builder, you select the styling and aspects of DataTables suite that you want, and it will generate the packages / install commands for you to use.

The download builder includes options for direct loading with `script` and `link` tags, details for using a package manager such as [npm](https://www.npmjs.com/) and [NuGet](https://www.nuget.org/), or a download option if you wish to have the files locally.


## Basic Usage

In its most simple case, you can enable StateRestore by simply setting `stateRestore: true` as an option in the DataTables initialisation.

```js
new DataTable('#example', {
	layout: {
		topStart: {
			buttons: ['stateCreate', 'statesList', 'pageLength']
		}
	},
	stateRestore: true
});
```

Note that you will typically use one of `statesList` or `statesTable` in the `buttons` array with the [Buttons extension](https://datatables.net/extensions/buttons/), as these define the UI that the end user will interact with. `stateCreate` is another common StateRestore button to use at the top level. This and the list view are used in the example above.


## Documentation / Support

* Full installation, usage and documentation is [in the manual](https://datatables.net/extensions/staterestore/)
* [DataTables support forums](http://datatables.net/forums)


## License

StateRestore is part of the DataTables Plus set of extensions - a premium set of extensions that enhance the capabilities of DataTables. Please see the [information page](https://datatables.net/plus) for more details and licensing options.
