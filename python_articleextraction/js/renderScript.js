var regexurl = "@(https?|ftp)://(-\.)?([^\s/?\.#-]+\.?)+(/[^\s]*)?$@iS";
var loop = true;

$( document ).ready(function() {
	try{
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
	}catch(err){}	
	
	$("img").each(function() {
 		if($(this).attr("src")){
			if($(this).attr("src").endsWith("icon.ico")){
				$(this).remove();
			}
		}
		else{
			$(this).remove();
		}
	});
	$("img:not(:first)").each(function() {
		if($(this).attr("src") == baseurl){
			$(this).remove();
		}
		var dim = getImageDimentions($(this))
		if(dim.width < 300 || dim.height < 250){
			$(this).remove();
		}
	});
	if($("div.Focus div").first().children().last().is("h2")){$("div.Focus div").children().last().remove()};
	$("div.Tagesschau p.more.hidden").nextAll("ul.list").remove();
	while(loop){
		loop = false;
		$('p').each(function() {
    			checkAndDelete($(this))
		});
		$('a').each(function() {
    			checkAndDelete($(this))
		});
		$('li').each(function() {
    			checkAndDelete($(this))
		});
		$('ul').each(function() {
    			checkAndDelete($(this))
		});
		$('span').each(function() {
    			checkAndDelete($(this))
		});
		$('strong').each(function() {
    			checkAndDelete($(this))
		});
		if($("div.Tagesschau").length && $("p.infotext").length) {
			$('p, a').each(function() {
    				if($(this).text() == "Download der Videodatei"){$(this).remove()}
				if($(this).text().endsWith("(h264)")){$(this).remove()}
				if($(this).text().endsWith("der rechten Maustaste klicken und \"Ziel speichern unter ...\" ausw\u00E4hlen.")){$(this).remove()}
				if($(this).text().endsWith("mp3")){$(this).remove()}
				if($(this).text().startsWith("Ogg")){$(this).remove()}
				if($(this).text().endsWith("HTML-Code kopieren und auf ihrer Seite einfügen.\n")){$(this).remove()}
				if($(this).text().endsWith("Video in folgenden Formaten zum Download an:")){$(this).remove()}
				if($(this).text().endsWith("Audio in folgenden Formaten zum Download an:")){$(this).remove()}
			});
		}
	}
});
function getImageDimentions(imageNode) {
  var source = imageNode.src;
  var imgClone = document.createElement("img");
  imgClone.src = source;
  return {width: imgClone.width, height: imgClone.height}
}
function checkAndDelete(node) {
    	if(node.html().replace(/\s|&nbsp;/g, '').replace('<br>').length == 0){
		node.remove();
		loop=true;
	}  
}