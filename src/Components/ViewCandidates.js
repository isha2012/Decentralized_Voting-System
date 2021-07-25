import {React, Component } from "react";
import { withRouter } from 'react-router-dom';
import Election from '../ethereum/Election';
import { Card, Container, Grid, Dropdown, Button, Form, Message} from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import web3 from "../ethereum/web3";

class ViewCandidates extends Component {
    constructor(props) {
        super(props);
        this.state = {
            address: this.props.match.params.address,
            candidateCount: '',
            candidateList: [],
            candidates: '',
            errorMessage: '',
            loading: false,
            value: ''
        }
    }

    async componentDidMount() {
        const election = await Election(this.state.address);
        const candidateCount = await election.methods.getTotalCandidates().call();

        let candidateList =[] ;

        if(candidateCount!==0) {
            for(let index=0; index<candidateCount; index++) {
                const cand = await election.methods.candidates(index).call();
                candidateList.push(cand); 
            }
        }

        this.setState({ candidateList, candidateCount})
    }

    renderCandidates() {
        return this.state.candidateList.map(candidate => {
            const items = [{
                header: candidate.name,
                meta: candidate.CandidateVote,
                description: "My only motive is to improve current situation"
            }]
            return <Card.Group items = {items} />
        });
    }

    renderCandidateList() {
        return this.state.candidateList.map((candidate, index) => {
            return {
                key:index,
                text: candidate.name,
                value: index,      
            }
        });
    }

    onSubmit = async (event) => {
        event.preventDefault();
        this.setState({ loading: true, errorMessage: '' });
        try {
            const accounts = await web3.eth.getAccounts();
            const election = await Election(this.state.address);
            console.log(parseInt(this.state.value));
            await election.methods.GiveVote(this.state.value).send({
                from: accounts[0]
            });
        } catch(err) {
            this.setState({ errorMessage: err.message});
        }
        this.setState({ loading: false})
    }

    render() {   
        return(
            <Container>
                <h1><i>Name's of Candidates</i></h1>
                <Grid>
                    <Grid.Row >
                        <Grid.Column width={6}>{this.renderCandidates()}</Grid.Column>
                
                        <Grid.Column width={4}>
                            <Form onSubmit = {this.onSubmit} error={!!this.state.errorMessage}>
                                <Form.Field>
                                    <label>
                                        Select a candidate to give your vote.
                                    </label>
                                    <Dropdown placeholder = 'Select Candidate'
                                        fluid selection
                                        options={this.renderCandidateList()}

                                        onChange={(event,data) => {
                                            //console.log(data.value)
                                            this.setState({ value: data.value })
                                        } }
    
                                    />
                                </Form.Field>

                                <Message error header="Oops!" content={this.state.errorMessage} />
                                <Button loading={this.state.loading}  inverted color='blue'>Give Vote</Button>
                            </Form>
                            
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Container>
        );
    }
}

export default withRouter(ViewCandidates);