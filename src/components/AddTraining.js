import React, { Component } from 'react';
import SkyLight from 'react-skylight';
import DatePicker from "react-datepicker";
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import SaveIcon from '@material-ui/icons/Save';
import TextField from '@material-ui/core/TextField';

import "react-datepicker/dist/react-datepicker.css";

class AddTraining extends Component {
    constructor(props) {
        super(props);
        this.addModal = React.createRef();
        this.state = { date: '', duration: '', activity: '', customer: '' };
    }

    componentDidMount() {
        this.setState({customer : this.props.links})
    }

    handleChange = (event) => {
        this.getCustomer();
        this.setState({ [event.target.name]: event.target.value });
    }

    setDate = (date) => {
        this.getCustomer();
        this.setState({
          date: date
        });
      }

    saveTraining = () => {
        const customer = {
            date: this.state.date,
            duration: this.state.duration,
            activity: this.state.activity,
            customer: this.state.customer
        }
        this.props.saveTraining(customer);
        this.addModal.current.hide();
    };

    getCustomer = () => {
        this.setState({ customer: this.props.customerLink })
    }

    render() {

        const addDialog = {
            width: '40%',
            marginTop: '-300px',
        }

        return (
            <div>
                <Button style={{ margin: 2 }} size="small" variant="contained" color="primary" onClick={() => this.addModal.current.show()}><AddIcon /> New Training </Button>
                <SkyLight hideOnOverlayClicked dialogStyles={addDialog} ref={this.addModal} title="Add a Training">
                    <DatePicker name="date"
                        selected={this.state.date}
                        onChange={this.setDate}
                    /><br></br>
                    <TextField id="duration" label="Duration" placeholder="Duration" margin="normal" name="duration"
                        onChange={this.handleChange} value={this.state.duration} /><br></br>
                    <TextField id="activity" label="Activity" placeholder="Activity" margin="normal" name="activity"
                        onChange={this.handleChange} value={this.state.activity} /><br></br>
                    <Button style={{ margin: 10 }} variant="contained" color="secondary" onClick={this.saveTraining}><SaveIcon /> Save Training </Button>
                </SkyLight>
            </div>
        );
    }
}

export default AddTraining;