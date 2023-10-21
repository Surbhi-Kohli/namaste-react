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

Here we simply “spy” calls to the math function, but **leave the original implementation in place**:


mock_jest_spyOn.test.js 


            import * as app from "./app";
            import * as math from "./math";
            
            test("calls math.add", () => {
             
             
            //spy on the add method within the math module, without changing the implementation                 const addMock = jest.spyOn(math, "add"); 
            
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

Source for the above : https://github.com/jestjs/jest/blob/e9aa321e0587d0990bd2b5ca5065e84a1aecb2fa/packages/jest-mock/src/index.js#L674-L708

## jest.spyon vs jest.mock (ChatAI)
jest.spyOn and jest.mock are both part of the Jest testing framework, but they serve different purposes.

1.jest.spyOn:
jest.spyOn is used to create a spy (a function that records information about its calls) on an existing function or object method.
It's typically used to spy on methods of objects, such as class methods or module methods.
You can use jest.spyOn to track the calls to a method, stub its behavior, and check whether it was called with the expected arguments.

2.jest.mock:
jest.mock is used to mock dependencies (modules or functions) in your code during testing.
When you mock a module using jest.mock, Jest replaces the actual implementation of the module with a mock implementation, allowing you to control and inspect its behavior.
This is particularly useful when you want to isolate the code under test by replacing external dependencies with controlled mock implementations.


## examples on how jest.spyon can be used to create a spy on functions , methods ,classes and all other use cases:

1.Spying on Object Methods:

        class Calculator {
          add(a, b) {
            return a + b;
          }
        }
        
        const calculator = new Calculator();
        const spy = jest.spyOn(calculator, 'add');
        
        const result = calculator.add(2, 3);
        
        expect(spy).toHaveBeenCalledWith(2, 3);
        expect(result).toBe(5);
        expect(spy).toHaveBeenCalled();


In this example, we create a spy on the add method of the Calculator class, allowing us to track its calls and arguments.

2.Spying on Functions:

        function multiply(a, b) {
          return a * b;
        }
        
        const spy = jest.spyOn(global, 'multiply');//or jest.spyon('multiply')
        
        const result = multiply(4, 5);
        
        expect(spy).toHaveBeenCalledWith(4, 5);
        expect(result).toBe(20);
        expect(spy).toHaveBeenCalled();

In this case, we create a spy on a global function (multiply), and we can track its calls and arguments.

3.Spying on Module Functions:


          // math.js
          export function divide(a, b) {
            return a / b;
          }
          
          // app.js
          import { divide } from './math';
          
          function divideAndLog(a, b) {
            console.log('Result:', divide(a, b));
          }
          
          const spy = jest.spyOn(require('./math'), 'divide');
          
          divideAndLog(10, 2);
          
          expect(spy).toHaveBeenCalledWith(10, 2);
          expect(console.log).toHaveBeenCalledWith('Result:', 5);


Another example:

          // math.js
          export function square(x) {
            return x * x;
          }
          
          // test.js
          import * as math from './math';
          
          const squareSpy = jest.spyOn(math, 'square');
          math.square(4);
          
          expect(squareSpy).toHaveBeenCalledWith(4);



Here, we create a spy on the divide function from the math.js module and ensure it is called with the correct arguments.

4.Spying on Class Constructors:


            class Car {
              constructor(make, model) {
                this.make = make;
                this.model = model;
              }
            }
            
            const spy = jest.spyOn(Car.prototype, 'constructor');
            
            const myCar = new Car('Toyota', 'Camry');
            
            expect(spy).toHaveBeenCalledWith('Toyota', 'Camry');
            expect(myCar.make).toBe('Toyota');
            expect(myCar.model).toBe('Camry');
            expect(spy).toHaveBeenCalled();

Another example:
            class MyClass {
            constructor() {
              this.value = 42;
            }
          }
          
          const constructorSpy = jest.spyOn(MyClass, 'constructor');
          const instance = new MyClass();
          
          expect(constructorSpy).toHaveBeenCalledTimes(1);
5.Spying on Static Methods:
You can also use jest.spyOn to spy on static methods of a class:

        class MyClass {
          static staticMethod() {
            return 'Static method called';
          }
        }
        
        const staticMethodSpy = jest.spyOn(MyClass, 'staticMethod');
        MyClass.staticMethod();
        
        expect(staticMethodSpy).toHaveBeenCalled();
        
6.Spying on Getter/Setter Properties:

You can spy on getter and setter properties of a class to track when they are accessed 
or modified:

        class Person {
          constructor(name) {
            this._name = name;
          }
        
          get name() {
            return this._name;
          }
        
          set name(newName) {
            this._name = newName;
          }
        }
        
        const person = new Person('Alice');
        const getNameSpy = jest.spyOn(person, 'name', 'get');
        const setNameSpy = jest.spyOn(person, 'name', 'set');

// Access the getter
const name = person.name;
expect(getNameSpy).toHaveBeenCalled();

// Access the setter
person.name = 'Bob';
expect(setNameSpy).toHaveBeenCalled();


7.Spying on Asynchronous Functions:


            async function fetchData() {
              // Simulate an API call
              return 'Some data';
            }
            
            const spy = jest.spyOn(global, 'fetchData');
            
            const result = await fetchData();
            
            expect(spy).toHaveBeenCalled();
            expect(result).toBe('Some data');
            
 You can also use jest.spyOn to spy on asynchronous functions and ensure they are called as expected.

8.Spying on methods of mocked objects:
You can also use jest.spyOn with mocked objects to track calls to their methods:
            const mockObject = {
              someMethod: () => {},
            };
            
            jest.spyOn(mockObject, 'someMethod');
            mockObject.someMethod();
            
            expect(mockObject.someMethod).toHaveBeenCalled();

9.Spies with Mocked Implementations:

            class Greeter {
              greet(name) {
                return `Hello, ${name}!`;
              }
            }
            
            const greeter = new Greeter();
            
            const greetSpy = jest.spyOn(greeter, 'greet');
            greetSpy.mockReturnValue('Custom Greeting');
            
            expect(greeter.greet('Alice')).toBe('Custom Greeting');

10.Spying on Built-in Functions:
You can also use jest.spyOn to spy on built-in functions or methods, like console.log:

            jest.spyOn(console, 'log');
            console.log('Hello, world!');
            
            expect(console.log).toHaveBeenCalledWith('Hello, world!');


These are just a few examples of how you can use jest.spyOn to create spies on various types of functions and methods for different use cases in your tests. Spies help you monitor the behavior of these functions/methods and make assertions about their usage.

## Examples of jest.mock
Suppose you have a module named api.js with a function fetchData, and you want to test a module dataProcessor.js that uses this function:


        // api.js
        export function fetchData() {
          // Actual implementation making an HTTP request
        }
        
        // dataProcessor.js
        import { fetchData } from './api';
        
        export function processData() {
          const data = fetchData();
          // Process the data
        }

In your test for dataProcessor.js, you can use jest.mock to mock the api.js module like this:

        jest.mock('./api'); // Mock the api.js module
        const { processData } = require('./dataProcessor');
        
        test('processData', () => {
          // Mock fetchData to return a specific value
          fetchData.mockReturnValue({ some: 'data' });
        
          // Test processData
          expect(processData()).toEqual({ some: 'data' });
        });
