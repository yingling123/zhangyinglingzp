$.ajax({
			type: 'post',
			url: '1-header.php',
			success: function(data){
				$('#Top').html(data);
			}
	});
$.ajax({
			type: 'GET',
			url: '1-footer.php',
			success: function(data){
				$('#Footer').html(data);
			}
	});