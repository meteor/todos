/* global TodosLib:true */

// I'm not sure exactly where this should go
TodosLib = {
  showError(error) {
    if (error) {
      // Use the global __ so that we can get symbols from other packages
      alert(TAPi18n.__(error.error));
    }
  }
};
