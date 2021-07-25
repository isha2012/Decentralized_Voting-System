import React from 'react';
import { Container } from 'semantic-ui-react';
import Header from './Header';
import 'semantic-ui-css/semantic.min.css';

export default props => {
    return(
        <Container
            style={{
                margin: "100px"
            }}
        >
            <Header/>
            <div>
                 {props.children}  
            </div>
            
        </Container>
    )
};