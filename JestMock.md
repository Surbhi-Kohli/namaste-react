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

             ```  
             mock_basic.js:
                 test("returns undefined by default", () => {
                 const mock = jest.fn();
 
                 let result = mock("foo");

                expect(result).toBeUndefined();
                expect(mock).toHaveBeenCalled();
                expect(mock).toHaveBeenCalledTimes(1);
                expect(mock).toHaveBeenCalledWith("foo");
              });
              ```
and we can change the return value, implementation, or promise resolution:

            ```
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
```
Now that we covered what the Mock Function is, and what you can do with it, let’s go into ways to use it.

## Dependency Injection

One of the common ways to use the Mock Function is by passing it directly as an argument to the function you are testing. This allows you to run your test subject, then assert how the mock was called and with what arguments:

        ```
          const doAdd = (a, b, callback) => {
            callback(a + b);
          };

        test("calls callback with arguments added", () => {
          const mockCallback = jest.fn();
          doAdd(1, 2, mockCallback);
          expect(mockCallback).toHaveBeenCalledWith(3);
        });

     ```

This strategy is solid, but it requires that your code supports dependency injection. Often that is not the case, so we will need tools to mock existing modules and functions instead.

