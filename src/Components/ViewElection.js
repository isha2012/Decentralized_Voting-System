import {React, Component } from "react";
import { withRouter, Link } from 'react-router-dom';
import { Card, Grid, Container, Button, Image, Segment, Message } from 'semantic-ui-react';
import Layout from './Layout';
import Election from '../ethereum/Election';
import AddCandidate from './AddCandidate';
import RegisterAsVoter from './RegisterAsVoter';
import 'semantic-ui-css/semantic.min.css';
import web3 from '../ethereum/web3';

class ViewElection extends Component {

    constructor(props) {
        super(props); 
        this.state = {
            loading: false,
            errorMessage: '',
            accounts: '',
            isAdmin: false,
            election: '',
            address: this.props.match.params.address,
            owner: '',
            VotersCount: '',
            candidateCount: '',
            voterRequest: '',
            req: [],
            votersList: [],
            getWinner: ''
        }
    }

    async componentDidMount() {
        const accounts = await web3.eth.getAccounts();
        const election = await Election(this.state.address);
        const owner = await election.methods.ElectionCreator().call();
        const isAdmin = owner === accounts[0];
        console.log(isAdmin);
        const candidateCount = await election.methods.getTotalCandidates().call();
        const VotersCount = await election.methods.getTotalVoters().call();
        const voterRequest = await election.methods.getVoterRequest().call();
        console.log(voterRequest);

        let req = [];
        if(voterRequest !== 0) {
            for(let index=1; index<=voterRequest; index++) {
                const request = await election.methods.requests(index).call({
                    from: accounts[0]
                });
                req.push(request);
                }
        }
        let votersList = [];
        for(let index=0; index<req.length; index++) {
            if(req[index] !== "0x0000000000000000000000000000000000000000") {
                const voter = await election.methods.voters(req[index]).call({
                    from: accounts[0]
                });
    
                votersList.push(voter);
            }
            
            console.log(votersList[0]);
        }
        this.setState({ accounts, election, owner, candidateCount, voterRequest, req, votersList, isAdmin, VotersCount});
    }

    renderInformation() {
        const {
            owner, candidateCount, voterRequest,  VotersCount
         } = this.state;

        const items = [
            {
                header: owner ,
                description: "The one who will manage the election."
            },
            {
                header: candidateCount ,
                description: "Numbers of Candidates in the election."
            },
            {
                header: voterRequest ,
                description: "Request for authorization"
            },
            {
                header:  VotersCount ,
                description: "Voters in Election"
            }
        ]
        return <Card.Group style={{ wordWrap: "break-word"}} items = {items} />
    } 


    approve = async (index) => {
        this.setState({loading: true, errorMessage: ''});
        try {
            await this.state.election.methods.authorisedVoter(index).send({
                from: this.state.accounts[0]
            });
        } catch (err) {
            this.setState({ errorMessage: err.message});
        }
        this.setState({loading: false});
    }

    renderRequests() {
        if(this.state.isAdmin) {
            return <Card.Group>
                {this.state.votersList.map((voter, index) => { return <Card key ={index}> 
                    <Card.Content>
                        <Image
                        floated='right'
                        size='mini'
                        src='https://react.semantic-ui.com/images/avatar/large/steve.jpg'
                        />
                        <Card.Header>Name of Voter: {voter.name}</Card.Header>
                        <Card.Meta>Registered as a Voter.</Card.Meta>
                        <Card.Description>
                            Request for <strong>authorization</strong>
                        </Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                            <div className='ui two buttons'>
                            <Button basic color='green' onClick={() => this.approve(voter.VoterId) }>
                                Approve
                            </Button>
                            <Button basic color='red'>
                                Decline
                            </Button>
                            </div>
                    </Card.Content>
                </Card>})}
            </Card.Group>
        } 
    }

    pickWinner = async () => {
        this.setState({ loading: true, errorMessage: ''});
        try {
            await this.state.election.methods.pickWinner().send({
                from: this.state.accounts[0]
            });
        } catch (err) {
            this.setState({ errorMessage: err.message });
        }
        this.setState({ loading: false})
    }

    renderPickWinner() {
        if(this.state.isAdmin) {
            return <Segment inverted><Button inverted color='red' onClick={this.pickWinner}>Pick Winner</Button></Segment>
        }
    } 

    getWinner = async() => {
        this.setState({ loading: true, errorMessage: ''});
        let getWinner;
        try {
            getWinner = await this.state.election.methods.getWinnerName().call({
                from: this.state.accounts[0]
            })
        } catch(err) {
            this.setState({ errorMessage: err.message});
        }
        console.log(getWinner);
        this.setState({ loading: false, getWinner:getWinner });
    }

    renderGetWinner() {
        return <Segment inverted><Button inverted color='green' onClick={this.getWinner}>Get Winner</Button>
            <Message>Winner of the Election is: {this.state.getWinner}</Message>
        </Segment>
        
    }

    render() {
        return(
            <Layout>
                <Container>
                    <h2><i>Information About Election</i></h2>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column width={10}>
                                {this.renderInformation()}
                                {this.renderRequests()}
                            </Grid.Column>

                            <Grid.Column width={6}>
                                <AddCandidate owner={this.state.address} />
                                <RegisterAsVoter />
                            </Grid.Column>  

                            <Grid.Column>
                                <Link to={`/election/${this.state.address}/viewCandidates`}>
                                    <Button primary>
                                        View Candidates
                                    </Button>
                                </Link>
                                
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column>
                                {this.renderPickWinner()}
                                {this.renderGetWinner()}
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>

                </Container>    
            </Layout>
        );
    }
}

export default withRouter(ViewElection);
