import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import Popular from './popular/Popular';
import { Route, BrowserRouter, Switch } from 'react-router-dom';
import Home from './home/Home';
import Chart from './charts/Charts';
import Battle2 from './battle2/Battle2';
import MyNav from './navbar/NavBar';
import Tree from "./D3IndentedTree/Tree";
import Results from './battle2/results/PlayerResults';
import Notes from './Notes/notes';
import { Grid } from 'semantic-ui-react';

class App extends React.Component {
    constructor(props) {
        super();
        this.state = {
            activeItem: ''
        };
    }

    render() {
        const { activeItem } = this.state;
        return (
            <BrowserRouter>

                <Grid centered>
                    <Grid.Column width={10}>
                        <Grid.Row stretched>
                            <MyNav />
                            <Switch>
                                <Route exact path='/' component={Home} />
                                <Route exact path='/popular' component={Popular} />
                                <Route exact path='/charts' component={Chart} />
                                <Route exact path='/battle2' component={Battle2} />
                                <Route path='/battle2/results' component={Results} />
                                <Route exact path='/tree' component={Tree} />
                                <Route exact path='/notes' component={Notes} />
                                <Route render={() => {
                                    return <p>Not Found</p>
                                }} />
                            </Switch>
                        </Grid.Row>
                    </Grid.Column>
                </Grid>

            </BrowserRouter>
        );
    }
}

export default App;
