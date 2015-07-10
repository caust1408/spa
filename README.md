# spa
Sandbox for OSCON SPA app

For prerender:
  npm install 
  go into prerender file
  type: 'node server.js'
  then start app.js in new window
  then in another window type: curl http://localhost:8000/dates
  then type: 
  curl http://localhost:8000/dates/?\_escaped\_fragment\_=
  
  ////////////////////////////////////
  NOTE: due to the markdown I added in the '\' so that the underscore would be shown on github, If you plan on copying it from a text editor it you will have to remove the '\' before the underscores.
  ///////////////////////////////////
  
  If you are on a local machine and want to see what the page will look like in the browser, then type in:
  
  this is prerender io// This is my localhost/////////////////
  http://localhost:3000/http://localhost:8000/dates/?_escaped_fragment_=
  
  
  And notice the difference on how in the first curl you only see the div with no content and the next one you see all of the html
  
