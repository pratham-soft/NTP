app.service('checkApi', function() {
    this.checkErr = function(errdesc) {
        resSplit = errdesc.split('|');
        if (resSplit[0] == -1) {			
			errMsg = resSplit[1];
		}
        return errMsg;
    };
});