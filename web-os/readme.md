# simple-os

npm i -g simple (simple-cli)
simple (from a directory? or anywhere?)
* runs simple-os
* if a site is found in this directory, it can launch that site's server, and open that site in a new tab
	* should open simple-os in one tab
	* and then the site in another tab
	* so if you didn't mean to start that server, you just close the tab, then shut down that server...
* if no site is found (a random dir, or w/e), then it'll just launch the simple-os page

npm start
	--> serves simple-os, opens browser

* must route requests to other servers
* manages hosts files?


Auto run on startup?
nodemon / pm2? + pm2-windows-service?
Doesn't look so simple...

Manage
* hosts
* path
* scripts
* file system
* servers

Heavily integrated with the #idx
* design/develop anything
* dashboard, command center, etc