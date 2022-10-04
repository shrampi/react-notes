
# REACT NOTES

Resources:
- https://reactjs.org/tutorial/tutorial.html
- https://reactjs.org/docs/hello-world.html

## BASICS

React combines markup and javascript, unlike normal web design where they're separated. React is about separation of concerns using *components*. 

## JSX

JSX is a syntax extension to javascript that lets us embed markup. 

    const element = (<h1>Hello, world!</h1>);

We can use normal javascript within curly braces inside our expression:
    
    const name = 'Josh Perez';
    const element = (<h1>Hello, {name}</h1>);

- It's generally a good idea to wrap the JSX expression in parentheses to prevent automatic semi-colons being inserted. 

This JSX syntax:

    const element = (
      <h1 className="greeting">
        Hello, world!
      </h1>
    );

Is identical to this vanilla javascript:

    const element = React.createElement(
      'h1',
      {className: 'greeting'},
      'Hello, world!'
    );

Both of the above essentially create the object below, which is simplified:

    const element = {
      type: 'h1',
      props: {
        className: 'greeting',
        children: 'Hello, world!'
      }
    };

## RENDERING ELEMENTS

The **root** element in our DOM will be handled managed by the React DOM. 
- we can assign anything to be the root, or create multiple roots:
        
        html:
        <div id="root"></div>


        js:
        const root = ReactDOM.createRoot(
          document.getElementById('root')
        );
        const element = <h1>Hello, world</h1>;
        root.render(element);


React elements are immutable, and cannot be changed. They're like a single frame in a move, representing our UI at one point in time when we call render() on them. 

## COMPONENTS AND PROPS

- Components are like javascript functions that accept arbitrary inputs (props) and return React elements

This is a valid *function* component:

    function Welcome(props) {
      return <h1>Hello, {props.name}</h1>;
    }

We can also use an ES6 class:

    class Welcome extends React.Component {
      render() {
        return <h1>Hello, {this.props.name}</h1>;
      }
    }

The above two examples are equivalent to React. 

Elements can be user defined components:

    function Welcome(props) {  
        return <h1>Hello, {props.name}</h1>;
    }

    const element = <Welcome name="Sara" />;

In this example, we have a component `Welcome` that spits out a react element. We also have the variable `element`, which calls `Welcome` and passes in `{name: 'Sara'}` as `props`. 

**Always start component names with capital letters.** React treats lowercase components starting with lowercase letters as DOM tags. 

Components can be composed together to create other components. Using the above example of `Welcome`:

    function App() {
      return (
        <div>
          <Welcome name="Sara" />      
          <Welcome name="Cahal" />      
          <Welcome name="Edite" />    
        </div>
      );
    }

React as one strict rule: **All React components must act like pure functions with respect to their props.**
- a pure function is one that never changes it's own inputs

## STATE AND LIFECYCLE

Suppose we have the following clock component:


    function Clock(props) {
      return (
        <div>      
        <h1>Hello, world!</h1>      
        <h2>It is {props.date.toLocaleTimeString()}.</h2>    
        </div>  
      );
    }

Every time we want to update this clock, we'd need to call `root.render(<Clock date={new Date()} />);`. 

Instead, we can store the `date` in the component's `state` rather than `props`. 

First we convert this function component to a class component:

    class Clock extends React.Component {
      render() {
        return (
          <div>
            <h1>Hello, world!</h1>
            <h2>It is {this.props.date.toLocaleTimeString()}.</h2>
          </div>
        );
      }
    }

Then we replace `this.props.date` with `this.state.date`, add a constructor that assigns the initial `state`, and pass `props` to the base constructor:

    class Clock extends React.Component {
      constructor(props) {    
        super(props);    
        this.state = {date: new  Date()};  
      }
      render() {
        return (
          <div>
            <h1>Hello, world!</h1>
            <h2>It is {this.state.date.toLocaleTimeString()}.</h2>      
          </div>
        );
      }
    }

Now we want to add a **lifecycle** to this component.
- we want to set up a timer whenever the clock is rendered to the DOM for the first time. This is called **mounting**.
- we want to clear that timer whenever the DOM produced by the `Clock` is removed. This is called **unmounting**. 

We declare special methods in the component class to run whenever the component is mounted/unmounted:
        

        // set up a timer field that we'll use to update the clock
        componentDidMount() {
            this.timerID = setInterval(      
                () => this.tick(),      
                1000    
            );  
        }

        // clear the timer
        componentWillUnmount() {
            clearInterval(this.timerID);  
        }

Then we add our tick method that changes the state using `this.setState()`: 

    tick() {    
        this.setState({      
            date: new Date()    
        });  
    }

**Don't modify the state directly.** Only `setState()` will update the DOM. 
- `setState()` is asynchronous, so don't rely on previous state values to update the next state. If we need to use the previous state to update the next one, we can pass in a function that takes in `state` and `props` as args. 

        this.setState((state, props) => ({
          counter: state.counter + props.increment
        }));

Parent and child components cannot access eachother's state. However, we can choose to pass a parent's state into a child component as a property. This is top-down: we can't pass state from child to parent.

    <FormattedDate date={this.state.date} />


## HANDLING EVENTS

Events in JSX/React are similar to html
- use camelCase instead of lowercase
- you pass a function as the event handler, rather than a string

    <button onClick={activateLasers}>  
        Activate Lasers
    </button>

A common pattern is to have an event handler be a method in a component class: 

    handleClick() {    
        this.setState(prevState => ({      
            isToggleOn: !prevState.isToggleOn    
        }));  
    }

**When using callbacks like `onClick={doSomething}`, make sure you bind `doSomething` in the constructor. Otherwise calling `this.setState` in the callback has no idea what `this` is. Ether do that, or use arrow function syntax:

    handleClick = () => {...};

## CONDITIONAL RENDERING

We can choose what we want to render with normal if statements. 

    function Greeting(props) {
      const isLoggedIn = props.isLoggedIn;
      if (isLoggedIn) {    
        return <UserGreeting />;  
      }  
      return <GuestGreeting />;
    }

Also, you can store elements in variables:
    
    button = <LogoutButton onClick={this.handleLogoutClick} />;

## LISTS AND KEYS  

You can generate a list of React elements, and then add that list to a JSX expression. Here's a basic list component:

    function NumberList(props) {
      const numbers = props.numbers;
      const listItems = numbers.map((number) => <li>{number}</li>);  
      return (<ul>{listItems}</ul>  );
    }

However, we also need to provide a `key` when we are creating a list of elements. The `key` allows for more React DOM efficiency when checking what DOM nodes have changed. **The key must be unique among its siblings.** So we change the line to this:

    const listItems = numbers.map((number) =>
      <li key={number.toString()}>
        {number}
      </li>
    );

## FORMS

Some html form elements like `<input>`, `<textarea>`, and `<select>`  maintain their own state based on user input. We don't want it to have a state separate from our React component. In this case we'd use a **controlled component**, which makes sure the React component is the single source of truth. 

Our **controlled component** would dictate the value of the form based off its input. 

Here's an example:

    class NameForm extends React.Component {
      constructor(props) {
        super(props);
        this.state = {value: ''}; 
        this.handleChange = this.handleChange.bind(this); // we have to do these bindings to make sure these functions know what 'this' is if they're used as a callback 
        this.handleSubmit = this.handleSubmit.bind(this);
      }

      handleChange(event) {    
        this.setState({value: event.target.value});  
      }
      
      handleSubmit(event) {
        alert('A name was submitted: ' + this.state.value);
        event.preventDefault(); // prevents the default form behavior of going to a new page
      }

      render() {
        return (
          <form onSubmit={this.handleSubmit}>        
          <label>
              Name:
              <input type="text" value={this.state.value} onChange={this.handleChange} />        
          </label>
          <input type="submit" value="Submit" />
          </form>
        );
      }
    }

So in the above example, our NameForm component will always have a state value equal to whatever is in the form input, rather than only when it's submitted. 

## LIFTING STATE UP

https://codepen.io/gaearon/pen/WZpxpz?editors=0010

## THINKING IN REACT

This whole page here is good: https://reactjs.org/docs/thinking-in-react.html
