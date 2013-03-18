filepicker.setKey('AjQvGbQyaOqu1jN3mC9Atz');

function open_upload_modal() {
	filepicker.pick({
	    container: 'window',
	    services:['COMPUTER', 'DROPBOX', 'GOOGLE_DRIVE', 'BOX', 'SKYDRIVE', 'URL', 'GMAIL'],
	  },
	  function(FPFile){
	    console.log(JSON.stringify(FPFile));
	  },
	  function(FPError){
	    console.log(FPError.toString());
	  }
	);
	return true;
}