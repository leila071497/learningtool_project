(function(){
    var newscript = document.createElement('script');
       newscript.type = 'text/javascript';
       newscript.async = true;
       newscript.src = 'https://www.gstatic.com/firebasejs/3.0.2/firebase.js';
    (document.getElementsByTagName('head')[0]||document.getElementsByTagName('body')[0]).appendChild(newscript);
  })();
  
  _setFormData = function setFormData (sel, data) {
    console.info('setting form to data', data);
    var inputList = document.querySelectorAll(sel + ' [name]');
    [].forEach.call(inputList, function(input) {
        console.log(input);
        if (data[input.name] && data[input.name] !== "undefined") {
          input.value = data[input.name];
        }
    });
  };
  var _fb;
  var fbToForm = function fbToForm (key, sel) {
      var config = config || {
        apiKey: "AIzaSyD6ib-N_S2u0mXIcw2l5QpI9gqB3zpHnZ0",
        authDomain: "how-to-cook-rice.firebaseapp.com",
        databaseURL: "https://how-to-cook-rice.firebaseio.com",
        storageBucket: "how-to-cook-rice.appspot.com",
      };
      _fb = _fb && _fb.name === "fbToForm" ? _fb : firebase.initializeApp(config, "fbToForm");
      _fb.database().ref('user-data/' + key).on('value', function(snapshot) {
          _setFormData(sel, snapshot.val());
      });
  };


  const config = {
    apiKey: "AIzaSyD6ib-N_S2u0mXIcw2l5QpI9gqB3zpHnZ0",
    authDomain: "how-to-cook-rice.firebaseapp.com",
    databaseURL: "https://how-to-cook-rice.firebaseio.com",
    projectId: "how-to-cook-rice",
    storageBucket:  "how-to-cook-rice.appspot.com",
    messagingSenderId: "G-ZL32BP2EN6"
  };
  firebase.initializeApp(config);
  
  const App = () => (
    <div className="comments">
      <h2>Comments</h2>
      <CommentForm />
      <CommentList />
      <footer>
        React Hooks edition{" "}
        <a target="blank" href="https://codepen.io/joshbivens/pen/aMjxVx">
          here
        </a>{" "}
        • Vue edition{" "}
        <a target="blank" href="https://codepen.io/joshbivens/pen/pYVBpG">
          here
        </a>{" "}
        | &#169; 2019 by{" "}
        <a target="blank" href="https://github.com/joshbivens">
          Josh Bivens
        </a>
      </footer>
    </div>
  );
  
  class CommentForm extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        username: "",
        comment: ""
      };
      this.handleSubmit = this.handleSubmit.bind(this);
      this.handleChange = this.handleChange.bind(this);
    }
  
    formatTime() {
      const options = {
        month: "2-digit",
        day: "2-digit",
        year: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
      };
      let now = new Date().toLocaleString("en-US", options);
      return now;
    }
  
    escapeHTML(html) {
      // [1]
      const div = document.createElement("div");
      div.textContent = html;
      return div.innerHTML;
    }
  
    handleSubmit(e) {
      e.preventDefault();
      const user = {
        username: this.escapeHTML(this.state.username),
        comment: this.escapeHTML(this.state.comment),
        time: this.formatTime()
      };
  
      const db = firebase.database().ref("comments");
      db.push(user);
  
      this.setState({
        username: "",
        comment: ""
      });
    }
  
    handleChange(e) {
      this.setState({
        [e.target.name]: e.target.value
      });
    }
  
    render() {
      return (
        <div className="comments-form">
          <form onSubmit={this.handleSubmit}>
            <ul>
              <li>
                <input
                  name="username"
                  type="text"
                  placeholder="Name"
                  value={this.state.username}
                  onChange={this.handleChange}
                  required
                />
              </li>
              <li>
                <textarea
                  name="comment"
                  placeholder="Comment"
                  value={this.state.comment}
                  onChange={this.handleChange}
                  required
                />
              </li>
              <li>
                <input type="submit" value="Post" />
              </li>
            </ul>
          </form>
        </div>
      );
    }
  }
  
  class CommentList extends React.Component {
    state = { comments: [] };
    componentWillMount() { // [2]
      const db = firebase.database().ref("comments");
      const MAX_COUNT = 9;
      db.on("value", snapshot => {
        if (snapshot.numChildren() > MAX_COUNT) {
          let childCount = 0;
          let updates = {};
          snapshot.forEach(child => {
            if (++childCount < snapshot.numChildren() - MAX_COUNT) {
              updates[child.key] = null;
            }
          });
          db.update(updates);
        }
      });
    }
    componentDidMount() {
      const db = firebase.database().ref("comments");
  
      db.on("value", snapshot => {
        const comments = snapshot.val();
        const arr = [];
        for (const comment in comments) {
          arr.push({
            username: comments[comment].username,
            comment: comments[comment].comment,
            time: comments[comment].time
          });
        }
  
        this.setState({
          comments: arr.reverse()
        });
      });
    }
    render() {
      return (
        <div className="comments-list">
          {this.state.comments.map(comment => (
            <Comment
              username={comment.username}
              comment={comment.comment}
              time={comment.time}
            />
          ))}
        </div>
      );
    }
  }
  
  const Comment = ({ username, comment, time }) => (
    <div className="comment">
      <h4>{username} says</h4>
      <p className="timestamp">{time}</p>
      <p>{comment}</p>
    </div>
  );
  
  const mountNode = document.getElementById("app");
  ReactDOM.render(<App />, mountNode);
  

  
  