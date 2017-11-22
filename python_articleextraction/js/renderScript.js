var regexurl = "@(https?|ftp)://(-\.)?([^\s/?\.#-]+\.?)+(/[^\s]*)?$@iS";
$( document ).ready(function() {
	var baseurl = $('img').first().attr('src');
    	$("img").each(function() {
  		var url = $(this).attr("src");
		if(typeof url == typeof undefined){
			return;
		}

		if(url.match(regexurl)){
		}else{
			var newurl = new URL(url, baseurl).href;
			$(this).attr("src", newurl);
		}
	});
	$('p').each(function() {
    		var $this = $(this);
    		if($this.html().replace(/\s|&nbsp;/g, '').length == 0)
        	$this.remove();
	});
	$('a').each(function() {
    		var $this = $(this);
    		if($this.html().replace(/\s|&nbsp;/g, '').length == 0)
        	$this.remove();
	});
	$("img:not(:first)").each(function() {
		if($(this).attr("src") == baseurl){
			$(this).remove();
		}
	});
	$("img").each(function() {
 		if($(this).attr("src")){
		}
		else{
			$(this).remove();
		}
	});
});