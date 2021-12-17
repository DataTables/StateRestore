# StateRestore

The StateRestore extension for DataTables builds on the `stateSave` option within DataTable's core. This allows users to save multiple different states and reload them at any time, not just at initialisation.

# Installation

The StateRestore extension is available on the [DataTables CDN](https://cdn.datatables.net/#StateRestore) and in the [download builder](/download). See the [documentation](http://datatables.net/extensions/staterestore/) for full details.

# NPM

You can also install it from [NPM](/download/npm/#StateRestore)

If you prefer to use a package manager such as NPM or Bower, distribution repositories are available with software built from this repository under the name `datatables.net-staterestore. Styling packages for Bootstrap, Foundation and other styling libraries are also available by adding a suffix to the package name.

Please see the DataTables [NPM](//datatables.net/download/npm) installation page for further information. The [DataTables installation manual](//datatables.net/manual/installation) also has details on how to use package managers with DataTables.

# Basic Usage

StateRestore is initialised by adding the `createState` and `savedStates` buttons into the DataTables [`buttons`](https://datatables.net/reference/option/buttons) option. Further options can be specified using these button's `config` property - see the documentation for details. For example:

```js
$(document).ready(function() {
    $('#example').DataTable({
        dom: 'Blfrtip',
        buttons:['createState', 'savedStates']
    });
});
```

# Documentation / Support

* [Documentation](https://datatables.net/extensions/staterestore/)
* [DataTables support forums](http://datatables.net/forums)

# GitHub

If you fancy getting involved with the development of StateRestore and help make it better, please refer to its [GitHub repo](https://github.com/DataTables/StateRestore)
