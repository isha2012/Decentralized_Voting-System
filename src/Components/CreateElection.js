import React, {Component} from 'react';
import { Form, Button, Input, Message, Container } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import web3 from '../ethereum/web3';
import factory from '../ethereum/ElectionFactory';

class NewElection extends Component {
    state = {
        name: '',
        errorMessage: '',
        loading: false
    }

    onSubmit = async (event) => {
        event.preventDefault();
        this.setState({loading: true, errorMessage: ''});
        try {
            const accounts = await web3.eth.getAccounts();
            await factory.methods.createElections(this.state.name).send({
                from: accounts[0]
            });
        } catch(err) {
            this.setState({ errorMessage: err.message});
        }
        this.setState({loading: false});
    }

    render() {
        return(
        <div>
            <Container>
                <div style={{
                         margin: "20px"
                    }}
                >
                    <Link to="/index">
                        <Button inverted color="green" floated="left">Back!</Button>
                    </Link>
                </div>
                <div>
                    <h3 floated="centered">Create a Election</h3>
                    <Form onSubmit = {this.onSubmit} error={!!this.state.errorMessage}>
                        <Form.Field>
                            <label floated="centered">Your Name</label>
                            <Input
                                value={ this.state.name }
                                onChange = {
                                    event => {
                                        this.setState({ name: event.target.value })
                                    }
                                }
                             />
                        </Form.Field>
                        <Message style={{ wordWrap: "break-word"}} error header="Oops!" content={this.state.errorMessage} />
                        <Button loading={this.state.loading} primary>Create!</Button>
                    </Form>
                </div>
                
            </Container>
        </div>
        )
    }
}

export default NewElection;