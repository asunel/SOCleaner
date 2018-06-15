$.when( $.ready ).then(soCleaner.loadSavedSettings());

$( "#chkSelectAll" ).click(soCleaner.selectAll);
$( "#restore" ).click(soCleaner.restoreOptions);
$( "#save" ).click(soCleaner.saveOptions);

soCleaner.checkIfSelectAllToBeUnset();
