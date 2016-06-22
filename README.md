#Firefox Movian Remote
This add-on is supposed to help starting media files on PS3 movian from your browser.
You need to enter the PS3s IP address in the add-ons preferences. 
The add-on is capable of resolving youtube videos/searches/channels/users (watches for youtube.com in url) and sent it to the corresponding youtube plugin of movian.
All other content will be sent as is. 
If you want to play an mp4 file, open it in a browser tab and then press the add-on button to send it to movian.

# Build
To build it from source you just need to run "jpm xpi" from your terminal.

# Install
Open the resulting xpi file in Firefox. If you have plugin signing activated you need to disable it in the about:config page. (xpinstall.signatures.required)