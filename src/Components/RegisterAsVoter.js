import React, { Component } from 'react';
import { Button, Form, Input, Message, Radio } from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import { withRouter } from 'react-router-dom';
import Election from '../ethereum/Election';
import 'semantic-ui-css/semantic.min.css';

class RegisterAsVoter extends Component {

    state = {
        address: this.props.match.params.address,
        name: '',
        errorMessage: '',
        loading: '',
        gender: ''
    }

    onSubmit = async (event) => {
        event.preventDefault();
        this.setState({ loading: true, errorMessage: ''});

        try {

            const accounts = await web3.eth.getAccounts();
            
            const election = await Election(this.state.address);
            await election.methods.registerVoter(this.state.name).send({
                from: accounts[0]
            });

        } catch(err) {
            this.setState({ errorMessage: err.Message })
        }
        this.setState({loading: false});
    }

    render() {
        return(
            <div>
                <Form onSubmit = {this.onSubmit} error={!!this.state.errorMessage}>
                    <Form.Field>
                        <label>
                            Enter Your Name
                        </label>
                        <Input 
                            value = {this.state.name}
                            onChange = {
                                event => {
                                    this.setState({ name: event.target.value })
                                } }
                         />
                    </Form.Field>
                    <Message error header="Oops!" content={this.state.errorMessage} />
                    <Button loading={this.state.loading} primary>
                         Register
                    </Button>
                </Form>
            </div>
        );
    } 
}

export default withRouter(RegisterAsVoter);