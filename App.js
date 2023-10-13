const parent=React.createElement("div",{id:"parent"},
React.createElement("div",{id:"child"},
[React.createElement("h1",{},"I am h1"),React.createElement("h2",{},"I am h2")]
))
//ReactElement(object)=> HTML(Browser understands)
//3rd arg children: can be either 1 child  or an array
const heading = React.createElement("h2",{id:"heading",xyz:"abc"},"Hello world from react in app");//react.createElement is from React, as element is a generic react 
//the 1st param is the tag,2nd object holds attributes to be given to the tag, 3rd is that is the child
const root = ReactDOM.createRoot(document.getElementById("root"));//ReactDom library is used as root is specific to browser
//root.render(heading)
root.render(parent)
//console.log(heading);//gives an object:react element that has props (with children(here h2),id and xyz)
/*
Costliest operation in browser: dom nodes manipulate
*/
console.log(parent)

//All this is tedious to write so we use jsx