Mocking is a technique to isolate test subjects by replacing dependencies with objects that you can control and inspect. A dependency can be anything your subject depends on, but it is typically a module that the subject imports.
For JavaScript, there are great mocking libraries available like testdouble and sinon, and Jest provides mocking out of the box.
When we talk about mocking in Jest, we’re typically talking about replacing dependencies with the Mock Function. In this article we’ll review the Mock Function, and then dive into the different ways you can replace dependencies with it.

## The Mock Function
The goal for mocking is to replace something we don’t control with something we do, so it’s important that what we replace it with has all the features we need.

The Mock Function provides features to:

 * Capture calls  
 * Set return values
 * Change the implementation

The simplest way to create a Mock Function instance is with jest.fn().

With this and Jest Expect, it’s easy to test the captured calls:

             
             mock_basic.js:
                 test("returns undefined by default", () => {
                 const mock = jest.fn();
 
                 let result = mock("foo");

                expect(result).toBeUndefined();
                expect(mock).toHaveBeenCalled();
                expect(mock).toHaveBeenCalledTimes(1);
                expect(mock).toHaveBeenCalledWith("foo");
              });
              
and we can change the return value, implementation, or promise resolution:

            
            test("mock implementation", () => {
              const mock = jest.fn(() => "bar");
            
              expect(mock("foo")).toBe("bar");
              expect(mock).toHaveBeenCalledWith("foo");
            });

            test("also mock implementation", () => {
              const mock = jest.fn().mockImplementation(() => "bar");
            
              expect(mock("foo")).toBe("bar");
              expect(mock).toHaveBeenCalledWith("foo");
            });

            test("mock implementation one time", () => {
              const mock = jest.fn().mockImplementationOnce(() => "bar");
            
              expect(mock("foo")).toBe("bar");
              expect(mock).toHaveBeenCalledWith("foo");
            
              expect(mock("baz")).toBe(undefined);
              expect(mock).toHaveBeenCalledWith("baz");
            });

            test("mock return value", () => {
              const mock = jest.fn();
              mock.mockReturnValue("bar");
            
              expect(mock("foo")).toBe("bar");
              expect(mock).toHaveBeenCalledWith("foo");
            });

          test("mock promise resolution", () => {
            const mock = jest.fn();
            mock.mockResolvedValue("bar");
          
            expect(mock("foo")).resolves.toBe("bar");
            expect(mock).toHaveBeenCalledWith("foo");
          });



Now that we covered what the Mock Function is, and what you can do with it, let’s go into ways to use it.

## Dependency Injection

One of the common ways to use the Mock Function is by passing it directly as an argument to the function you are testing. This allows you to run your test subject, then assert how the mock was called and with what arguments:

         
            const doAdd = (a, b, callback) => {
              callback(a + b);
            };
  
          test("calls callback with arguments added", () => {
            const mockCallback = jest.fn();
            doAdd(1, 2, mockCallback);
            expect(mockCallback).toHaveBeenCalledWith(3);
          });

     

This strategy is solid, but it requires that your code supports dependency injection. Often that is not the case, so we will need tools to mock existing modules and functions instead.

Mocking Modules and Functions
There are three main types of module and function mocking in Jest:

 * jest.fn: Mock a function
 * jest.mock: Mock a module
 * jest.spyOn: Spy or mock a function
   
Each of these will, in some way, create the Mock Function. To explain how each of these does that, consider this project structure: 
├ example/
| └── app.js
| └── app.test.js
| └── math.js

In this setup, it is common to test app.js and want to either not call the actual math.js functions, or spy them to make sure they’re called as expected. This example is trite, but imagine that math.js is a complex computation or requires some IO you want to avoid making:

math.js:

             export const add      = (a, b) => a + b;
             export const subtract = (a, b) => b - a;
             export const multiply = (a, b) => a * b;
             export const divide   = (a, b) => b / a;

app.js:
            import * as math from './math.js';

            export const doAdd      = (a, b) => math.add(a, b);
            export const doSubtract = (a, b) => math.subtract(a, b);
            export const doMultiply = (a, b) => math.multiply(a, b);
            export const doDivide   = (a, b) => math.divide(a, b);


 ##  Mock a function with jest.fn
The most basic strategy for mocking is to reassign a function to the Mock Function. Then, anywhere the reassigned functions are used, the mock will be called instead of the original function:

mock_jest_fn.test.js:


          import * as app from "./app";
          import * as math from "./math";
          
          math.add = jest.fn();
          math.subtract = jest.fn();
          
          test("calls math.add", () => {
            app.doAdd(1, 2);
            expect(math.add).toHaveBeenCalledWith(1, 2);
          });
          
          test("calls math.subtract", () => {
            app.doSubtract(1, 2);
            expect(math.subtract).toHaveBeenCalledWith(1, 2);
          });


This type of mocking is less common for a couple reasons:

jest.mock does this automatically for all functions in a module
jest.spyOn does the same thing but allows restoring the original function.

## Mock a module with jest.mock
A more common approach is to use jest.mock to automatically set all exports of a module to the Mock Function. So, calling jest.mock('./math.js'); essentially sets math.js to:

math.eg.js

              export const add      = jest.fn();
              export const subtract = jest.fn();
              export const multiply = jest.fn();
              export const divide   = jest.fn();

From here, we can use any of the above features of the Mock Function for all of the exports of the module:

mock_jest_mock.test.js:

              import * as app from "./app";
              import * as math from "./math";
              
              // Set all module functions to jest.fn
              jest.mock("./math.js");
              
              test("calls math.add", () => {
                app.doAdd(1, 2);
                expect(math.add).toHaveBeenCalledWith(1, 2);
              });
              
              test("calls math.subtract", () => {
                app.doSubtract(1, 2);
                expect(math.subtract).toHaveBeenCalledWith(1, 2);
                
This is the easiest and most common form of mocking (and is the type of mocking Jest does for you with automock: true).

The only disadvantage of this strategy is that it’s difficult to access the original implementation of the module. For those use cases, you can use spyOn.

## Spy or mock a function with jest.spyOn

Sometimes you only want to watch a method be called, but keep the original implementation. Other times you may want to mock the implementation, but restore the original later in the suite.

In these cases, you can use jest.spyOn.

Here we simply “spy” calls to the math function, but leave the original implementation in place:


mock_jest_spyOn.test.js 


            import * as app from "./app";
            import * as math from "./math";
            
            test("calls math.add", () => {
              const addMock = jest.spyOn(math, "add");
            
              // calls the original implementation
              expect(app.doAdd(1, 2)).toEqual(3);

               // and the spy stores the calls to add
                expect(addMock).toHaveBeenCalledWith(1, 2);
              });

              
This is useful in a number of scenarios where you want to assert that certain side-effects happen without actually replacing them.

In other cases, you may want to mock a function, but then restore the original implementation:

mock_jest_spyOn_restore.test.js 


                import * as app from "./app";
                import * as math from "./math";
                
                test("calls math.add", () => {
                  const addMock = jest.spyOn(math, "add");
                
                  // override the implementation
                  addMock.mockImplementation(() => "mock");
                  expect(app.doAdd(1, 2)).toEqual("mock");
                
                  // restore the original implementation
                  addMock.mockRestore();
                  expect(app.doAdd(1, 2)).toEqual(3);
                });


This is useful for tests within the same file, but unnecessary to do in an afterAll hook since each test file in Jest is sandboxed.

The key thing to remember about jest.spyOn is that it is just sugar for the basic jest.fn() usage. We can achieve the same goal by storing the original implementation, setting the mock implementation to to original, and re-assigning the original later:


mock_jest_spyOn_sugar.js :



              import * as app from "./app";
              import * as math from "./math";
              
              test("calls math.add", () => {
                // store the original implementation
                const originalAdd = math.add;
              
                // mock add with the original implementation
                math.add = jest.fn(originalAdd);
              
                // spy the calls to add
                expect(app.doAdd(1, 2)).toEqual(3);
                expect(math.add).toHaveBeenCalledWith(1, 2);
              
                // override the implementation
                math.add.mockImplementation(() => "mock");
                expect(app.doAdd(1, 2)).toEqual("mock");
                expect(math.add).toHaveBeenCalledWith(1, 2);
              
                // restore the original implementation
                math.add = originalAdd;
                expect(app.doAdd(1, 2)).toEqual(3);
              });


              In fact, this is exactly how jest.spyOn is implemented(https://github.com/jestjs/jest/blob/e9aa321e0587d0990bd2b5ca5065e84a1aecb2fa/packages/jest-mock/src/index.js#L674-L708).


                
