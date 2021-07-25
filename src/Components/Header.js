import React from 'react';
import {  AppBar, Button, Toolbar } from '@material-ui/core';

const Header = () => {
    return(
       <React.Fragment>
            <AppBar color="white" >
                    <Toolbar>
                        <Button variant="contained" color="primary">
                        E-Voting System
                        </Button>
                    </Toolbar>
           </AppBar>
       </React.Fragment>
    )
}

export default Header;