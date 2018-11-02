import React, { Component } from 'react';
import SkyLight from 'react-skylight';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import SaveIcon from '@material-ui/icons/Save';
import TextField from '@material-ui/core/TextField';

const styles = theme => ({
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 200,
    }
});

class AddCustomer extends Component {
    constructor(props) {
        super(props);
        this.addModal = React.createRef();
        this.state = { firstname: '', lastname: '', streetaddress: '', postcode: '', city: '', email: '', phone: '' };
    }

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    }
    
    saveCustomer = () => {
        const customer = {
            firstname:      this.state.firstname,
            lastname:       this.state.lastname,
            streetaddress:  this.state.streetaddress,
            postcode:       this.state.postcode,
            city:           this.state.city,
            email:          this.state.email,
            phone:          this.state.phone
        }
        this.props.saveCustomer(customer);
        this.addModal.current.hide();
    };

    render() {

        const addDialog = {
            width :'40%',
            marginTop: '-300px',
        }

        return (
            <div>
                <Button style={{ margin: 10 }} variant="contained" color="primary" onClick={() => this.addModal.current.show()}><AddIcon /> New Customer </Button>
                <SkyLight hideOnOverlayClicked dialogStyles={addDialog} ref={this.addModal} title="Add a Customer">
                    <TextField id="firstname" label="Firstname" placeholder="Firstname" margin="normal" name="firstname"
                        onChange={this.handleChange} value={this.state.firstname} /><br></br>
                    <TextField id="lastname" label="Lastname" placeholder="Lastname" margin="normal" name="lastname"
                        onChange={this.handleChange} value={this.state.lastname} /><br></br>
                    <TextField id="streetaddress" label="Streetaddress" placeholder="Streetaddress" margin="normal" name="streetaddress"
                        onChange={this.handleChange} value={this.state.streetaddress} /><br></br>
                    <TextField id="postcode" label="Postcode" placeholder="Postcode" margin="normal" name="postcode"
                        onChange={this.handleChange} value={this.state.postcode} /><br></br>
                    <TextField id="city" label="City" placeholder="City" margin="normal" name="city"
                        onChange={this.handleChange} value={this.state.city} /><br></br>
                    <TextField id="email" label="Email" placeholder="Email" margin="normal" name="email"
                        onChange={this.handleChange} value={this.state.email} /><br></br>
                    <TextField id="phone" label="Phone" placeholder="Phone" margin="normal" name="phone"
                        onChange={this.handleChange} value={this.state.phone} /><br></br>
                        <Button style={{ margin: 10 }} variant="contained" color="secondary" onClick={this.saveCustomer}><SaveIcon /> Save Customer </Button>
                </SkyLight>
            </div>
        );
    }
}

export default AddCustomer;