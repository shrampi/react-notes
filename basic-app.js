

class Counter extends React.Component{ // class component
    constructor(props){
      super(props);
      this.state = {count: 0}; // init private state object
    }
    
    componentDidMount() { // called when component is first rendered to the DOM
      this.timer = setInterval(
        () => {this.tick()}, 
        1000
      );
    }
    
    tick() { // the function that increments our counter
      this.setState( //bit tricky - since we're changing the state.count using the previous state.count, we have to pass in a function here. 
        (state, props) => (
          {count: state.count + props.amount}
        )
      );
    }
    
    render() { // returns a react element that we want to display 
      return (
        <h1>{this.state.count}</h1>
      );
    }
  }
  
  function App(props) { // a container component for how we want to display the whole page
    return ( // below we use our custom Counter element
      <div>
        <h2> The count is: </h2>  
        <Counter amount={props.amount}/>
      </div>
    );
  }
  
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(<App amount={1}/>); // the amount property is set to 1