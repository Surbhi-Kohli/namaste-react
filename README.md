# Namaste React 🚀


# Parcel
- Dev Build
- Local Server
- HMR = Hot Module Replacement
- File Watching Algorithm - written in C++
- Caching - Faster Builds
- Image Optimization
- Minification
- Bundling
- Compress
- Consistent Hashing
- Code Splitting
- Differential Bundling - support older browsers
- Diagnostic
- Error Handling
- HTTPs
- Tree Shaking - remove unused code
- Different dev and prod bundles



# Namaste Food


/**
 * Header
 *  - Logo
 *  - Nav Items
 * Body
 *  - Search
 *  - RestaurantContainer
 *    - RestaurantCard
 *      - Img
 *      - Name of Res, Star Rating, cuisine, delery tie
 * Footer
 *  - Copyright
 *  - Links
 *  - Address
 *  - Contact
 */



 Two types of Export/Import


- Default Export/Import

export default Component;
import Component from "path";


- Named Export/Import

export const Component;
import {Component} from "path";


# React Hooks
 (Normal JS utility functions)
- useState() - Superpowerful State Variables in react
- useEffect()



#  2 types Routing in web apps
 - Client Side Routing
 - Server Side Routing




 # Redux Toolkit
  - Install @reduxjs/toolkit and react-redux
  - Build our store
  - Connect our store to our app
  - Slice (cartSlice)
  - dispatch(action)
  - Selector


# Types of testing (devloper)
 - Unit Testing
 - Integration Testing --testing several components collaborated with each other
 - End to End Testing - e2e testing testing the flow as soon as the user lands on website to the time user leaves the website(simulating user behaviour)


# Setting up Testing in our app
 - Install React Testing Library
 - Installed jest
 - Installed Babel dependencies
 - Configure Babel 
 - Configure Parcel Config file to disable default babel transpilation of parcel and use our custom babel config
 - Jest config via:   npx jest --init
 //The above will create jest config and we will choose the test environment as jsdom(browser-like)--read about jsdom
 Which provider should be used to instrument code for coverage? › babel
 - Install jsdom library
 - Install @babel/preset-react - to make JSX work in test cases(enable jsx) , so that the babel can transpile  transform JSX code into regular JavaScript function calls. For example, it can convert JSX expressions like <div>Hello, World!</div> into React.createElement("div", null, "Hello, World!") that the jsdom can understand.
 - Include @babel/preset-react inside my babel config
 - npm i -D @testing-library/jest-dom
 
 __ = dunder

//Things to check:
act,
Header failing tests
hoc testing
global.fetch--mocking fetch via jest

//queryBy vs findBy vs getBy


## Does render in react-testing library deeply render nested components?

When you use render from RTL, it renders the component and all of its child components recursively, creating a virtual representation of your component tree in memory. This means you can access and interact with the entire rendered component tree and its descendants, making it suitable for testing the behavior and interactions of nested components as well.

Consider a cart.js file with jsx as :

           <div className="text-center m-4 p-4">
           <h1 className="text-2xl font-bold">Cart</h1>
           <div className="w-6/12 m-auto">
             <button
               className=" p-2 m-2 bg-black text-white rounded-lg"
               onClick={handleClearCart}
             >
               Clear Cart
             </button>
             {cartItems?.length === 0 && (
               <h1> Cart is empty. Add Items to the cart!</h1>
             )}
             <ItemList items={cartItems} />
           </div>
         </div>
         
where Item List:
   
        <div>
         <h1> hello Itemlist</h1>
         </div>

 Test would be:   

    
    it("test render of rtl",async()=>{
       const {container}=  await act(async()=> render(<BrowserRouter><Provider store={appStore}>
        <Cart/>
        </Provider></BrowserRouter>));

        screen.debug();//either of these will print the rendered component in the terminal
         console.log(container.innerHTML)//the output is as below
      })
     /*
     <body>
        <div>
          <div
            class="text-center m-4 p-4"
          >
            <h1
              class="text-2xl font-bold"
            >
              Cart
            </h1>
            <div
              class="w-6/12 m-auto"
            >
              <button
                class=" p-2 m-2 bg-black text-white rounded-lg"
              >
                Clear Cart
              </button>
              <h1>
                 Cart is empty. Add Items to the cart!
              </h1>
              <div>
                <h1>
                   hello Itemlist
                </h1>
              </div>
            </div>
          </div>
        </div>
      </body>
         */

## what is the screen object export by react testing library?
Because querying the entire document.body is very common, DOM Testing Library also exports a screen object which has every query that is pre-bound to document.body (using the within functionality). Wrappers such as React Testing Library re-export screen so you can use it the same way.


## what are the various mocking methods in jest?



## Difference between queryBy vs findBy vs getBy
 There are several types of queries ("get", "find", "query"); the difference between them is whether the query will throw an error if no element is found or if it will return a Promise and retry.

 Single Elements:

getBy...: Returns the matching node for a query, and throw a descriptive error if no elements match or if more than one match is found (use getAllBy instead if more than one element is expected).

queryBy...: Returns the matching node for a query, and return null if no elements match. This is useful for asserting an element that is not present. Throws an error if more than one match is found (use queryAllBy instead if this is OK).

findBy...: Returns a Promise which resolves when an element is found which matches the given query. The promise is rejected if no element is found or if more than one element is found after a default timeout of 1000ms. If you need to find more than one element, use findAllBy.

Multiple Elements
getAllBy...: Returns an array of all matching nodes for a query, and throws an error if no elements match.
queryAllBy...: Returns an array of all matching nodes for a query, and return an empty array ([]) if no elements match.
findAllBy...: Returns a promise which resolves to an array of elements when any elements are found which match the given query. The promise is rejected if no elements are found after a default timeout of 1000ms.
findBy methods are a combination of getBy* queries and waitFor. They accept the waitFor options as the last argument (i.e. await screen.findByText('text', queryOptions, waitForOptions))
For better details read : https://www.robinwieruch.de/react-testing-library/
