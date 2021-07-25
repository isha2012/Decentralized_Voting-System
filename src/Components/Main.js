import React, {Component} from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Factory from './index';
import NewElection from './CreateElection';
import Layout from './Layout';
import ViewElection from './ViewElection';
import AddCandidate from './AddCandidate';
import ViewCandidates from './ViewCandidates';
import 'semantic-ui-css/semantic.min.css';

class Main extends Component {
    render() {
    return(
        <div>
            <Layout />
              <Switch>
                  <Route path="/index" component={Factory} />
                  <Route exact path="/index" component={Factory} />
                  <Route exact path="/create_election" component={NewElection} />
                  <Route exact path="/election/:address" component={ViewElection} />
                  <Route exact path="/election/AddCandidate" component={AddCandidate}/>
                  <Route exact path="/election/:address/viewCandidates" component={ViewCandidates} />
                  { <Redirect to="/index" />  }
              </Switch>
        </div> 
    ); 
    }
}
export default Main;
