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
						        url: "/decks",
						        type: "post",
										contentType: "application/json",
						        data: JSON.stringify(FPFile),
										dataType: 'json',
										success: function(data, status, xhr){
											//maybe a normal request non-ajax is better here
											var redirect_url = "/";    
											$(location).attr('href', redirect_url);
										}
			});
	  },
	  function(FPError){
	    console.log(FPError.toString());
	  }
	);
	return true;
}

// on ajax success:

// var url = "/decks/id";    
// $(location).attr('href',url);