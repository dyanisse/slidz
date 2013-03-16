filepicker.setKey('AjQvGbQyaOqu1jN3mC9Atz');

function open_upload_modal() {
	filepicker.pick(function(FPFile){
  	console.log(FPFile.url);
	});
	return true;
}