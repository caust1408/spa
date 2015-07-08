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
  
  
  And notice the difference on how in the first curl you only see the div with no content and the next one you see all of the html
  
