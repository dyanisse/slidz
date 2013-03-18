filepicker.setKey('AjQvGbQyaOqu1jN3mC9Atz');

function open_upload_modal() {
	filepicker.pickAndStore({
	    container: 'window',
	    services:['COMPUTER', 'DROPBOX', 'GOOGLE_DRIVE', 'BOX', 'SKYDRIVE', 'URL', 'GMAIL'],
	  },
	  {location:"S3"},
	  function(FPFile){
	    console.log(JSON.stringify(FPFile));
			var request = $.ajax({
						        url: "/deck",
						        type: "post",
										contentType: "application/json",
						        data: JSON.stringify(FPFile)
			});
	  },
	  function(FPError){
	    console.log(FPError.toString());
	  }
	);
	return true;
}