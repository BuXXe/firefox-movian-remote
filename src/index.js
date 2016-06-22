var tag = "p";
var data = require("sdk/self").data;
var pageMod = require("sdk/page-mod");
var channelid = "";

// register worker to get information out of source of page
pageMod.PageMod({
	  include: "*.youtube.com",
	  contentScriptFile: data.url("script.js"),
	  onAttach: function(worker) {
	    worker.port.emit("getElements", tag);
	    worker.port.on("gotElement", function(elementContent) {
	      channelid = elementContent;
	    });
	  }
	});


var val = require('sdk/simple-prefs').prefs['somePreference']
var buttons = require('sdk/ui/button/action');
var tabs = require("sdk/tabs");
var Request = require("sdk/request").Request;

var button = buttons.ActionButton({
  id: "send-to-movian-button",
  label: "Send to Movian",
  icon: {
    "16": "./icon-16.png",
    "32": "./icon-32.png",
    "64": "./icon-64.png"
  },
  onClick: handleClick
});

function handleClick(state) {

	var medialink = tabs.activeTab.url;
	// if there is no special resolution necessary, the link will be sent directly to movian
	if(medialink.contains("www.youtube.com"))
	{
		// do youtube resolution
		medialink = resolveYoutube(medialink);
	}

	var control = Request(
		{
		  url:  "http://"+require('sdk/simple-prefs').prefs['PS3-IP']+":42000/",
		  content: {
			  url: medialink
		  }
		});
	control.get();
}


function resolveYoutube(url)
{
	// differentiate channel / video / search

	
	// is channel /( or user)? 
	if (url.indexOf('channel/') != -1)
		return "youtube:channel:"+url.split("channel/")[1].split("/")[0].split("?")[0];
	
	if (url.indexOf('user/') != -1)
	{
		// have to get data-channel-external-id= from page
		// content script necessary to access channel id in source
		return "youtube:channel:"+channelid;
	}
	
	// is video ? 
	if (url.indexOf('v=') !=-1)
	{
		var video_id = url.split('v=')[1];
		var ampersandPosition = video_id.indexOf('&');
		if (ampersandPosition != -1) {
		  video_id = video_id.substring(0, ampersandPosition);
		}
		return "youtube:video:"+video_id;
	}
	
	// is search ?
	if (url.indexOf('/results') != -1)
	{
		// searchtext is: q or search_query
		var searchkey ="q=";
		if (url.indexOf('search_query=') !=-1)
			searchkey = "search_query=";
			
		
		var searchtext = url.split(searchkey)[1];
		var ampersandPosition = searchtext.indexOf('&');
		if(ampersandPosition != -1) {
			searchtext = searchtext.substring(0, ampersandPosition);
		}
		
		// which category to search for?

		// EgIQAg%253D  -  Channel
		// EgIQAw%253D%253D - Playlist
		// EgIQAQ%253D%253D - Video
		var category = "video";
		
		if (url.indexOf('EgIQAg%253D') != -1)
			category = "channel";
		if (url.indexOf('EgIQAw%253D%253D') != -1)
			category = "playlist";
		if (url.indexOf('EgIQAQ%253D%253D') != -1)
			category = "video";
		
		
		return "youtube:searcher:"+category+":"+decodeURIComponent(searchtext.replace(/\+/g," "));
	}
	
	// default case
	return url;
}