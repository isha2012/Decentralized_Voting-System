import React, { Component } from 'react';
import { Card, Button, Container } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';
import factory from '../ethereum/ElectionFactory';
import { Link } from 'react-router-dom';
import Layout from './Layout';

class Factory extends Component {
 
    constructor(props) {
        super(props);
        this.state = { electionFactory: [] };
    }

    async componentDidMount() {
        const electionFactory = await factory.methods.getDeployedElections().call();
        console.log(electionFactory);

        this.setState({ electionFactory });
    }

    renderElections() {    

        const items = this.state.electionFactory.map(address => {
            return {
                header: address,
                description: (
                    <Link to={`/election/${address}`}>
                        <a>View Election</a>
                    </Link>
                ),
                fluid: true
            };
        })
        return <Card.Group items={items}/>
       
    }
    render() {
        return (
            <Layout>  
                <Container>
                    <h3>Elections</h3>
                    <Link to="create_election" >
                            <Button floated="right" content="Create Election"
                                icon="add circle"
                                primary 
                            />
                    </Link>
                    {this.renderElections()} 
                </Container> 
            </Layout> 
        );
    }
}

export default Factory;