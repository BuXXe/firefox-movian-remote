self.port.on("getElements", function(tag) 
{
	try
	{
	  var re = new RegExp('data-channel-external-id=".*?"');
	  var m = re.exec(document.body.innerHTML);
	  
	  var channelid = m[0].split('"')[1];
	  self.port.emit("gotElement", channelid);
	}
	catch (e) 
	{}
});