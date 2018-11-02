import React, { Component } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import SkyLight from 'react-skylight';
import { BrowserRouter as Router, Route, Link} from "react-router-dom";
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Tooltip from '@material-ui/core/Tooltip';
import SaveIcon from '@material-ui/icons/Save';
import Button from '@material-ui/core/Button';
import AddCustomer from './AddCustomer';
import CustomerTrainings from './CustomerTrainings';


class Customerlist extends Component {

    constructor(props) {
        super(props);
        this.trainingsDialog = React.createRef();
        this.state = { customers: [], showSnackbar: false , trainings: []};
    }

    componentDidMount() {
        this.listCustomers();
    }

    deleteCustomer = (link) => {
        fetch(link, { method: 'DELETE' })
            .then(response => {
                this.listCustomers();
                this.setState({ showSnackbar: true })
            })
    }

    listCustomers = () => {
        fetch('https://customerrest.herokuapp.com/api/customers')
            .then(response => response.json())
            .then(responseData => {
                this.setState({ customers: responseData.content })
            })
    }

    saveCustomer = (Customer) => {
        fetch('https://customerrest.herokuapp.com/api/customers',
            {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(Customer)
            })
            .then(response => {
                this.listCustomers();
            })
    }

    updateCustomer = (customer, link) => {
        fetch(link,
        {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(customer)
        })
        .then(response => {
            this.listCustomers();
        })
    }

    handleClose = (event, reason) => {
        this.setState({ showSnackbar: false });
    };

    renderEditable = (cellInfo) => {
        return (
            <div
                style={{backgroundColor: "#fafafa"}}
                contentEditable
                suppressContentEditableWarning
                onBlur={ e=>{
                    const data = [...this.state.customers];
                    data[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
                    this.setState({customers:data})
                }}
                dangerouslySetInnerHTML={{
                    __html: this.state.customers[cellInfo.index][cellInfo.column.id]
                }}
            />
        )
    }

    showTrainings = (link) => {
        fetch(link)
            .then(response => response.json())
            .then(responseData => {
                this.setState({ trainings: responseData.content })
            })
        this.trainingsDialog.current.show();
    }

    render() {

        const columns = [{
            Header: 'Firstname',
            accessor: 'firstname',
            Cell: this.renderEditable
        },{
            Header: 'Lastname',
            accessor: 'lastname',
            Cell: this.renderEditable
        },{
            Header: 'Street Address',
            accessor: 'streetaddress',
            Cell: this.renderEditable
        },{
            Header: 'Postcode',
            accessor: 'postcode',
            Cell: this.renderEditable
        },{
            Header: 'City',
            accessor: 'city',
            Cell: this.renderEditable
        },{
            Header: 'Email',
            accessor: 'email',
            Cell: this.renderEditable
        },{
            Header: 'Phone',
            accessor: 'phone',
            Cell: this.renderEditable
        }, {
            Header: 'Trainings',
            filterable: false,
            sortable: false,
            accessor: 'links[2].href',
            Cell: ({ value }) => (
                <Button variant="outlined" onClick={() => this.showTrainings(value)} aria-label="Customers" style={{ margin: 4 }}>
                    Trainings
                </Button>
            )
        }, {
            Header: '',
            filterable: false,
            sortable: false,
            accessor: 'links[0].href',
            Cell: ({ row, value }) => (
                <Tooltip title='Update' placement='right'>
                    <IconButton onClick={() => this.updateCustomer(row,value)} aria-label='update'>
                        <SaveIcon />
                    </IconButton>
                </Tooltip>
            )
        }, {
            Header: '',
            filterable: false,
            sortable: false,
            accessor: 'links[0].href',
            Cell: ({ value }) => (
                <Tooltip title='Delete' placement='right'>
                    <IconButton onClick={() => this.deleteCustomer(value)} aria-label='delete'>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            )
        }]

        const trainingsDialog = {
            width :'60%',
            marginTop: '-300px',
        }

        return (
            <div>
                <AddCustomer saveCustomer={this.saveCustomer} />
                <ReactTable style={{width:'100%'}} data={this.state.customers} columns={columns} filterable={true} defaultPageSize={10} />
                <Snackbar message='Customer deleted' open={this.state.showSnackbar} onClose={this.handleClose} autoHideDuration={3000} />
                <SkyLight hideOnOverlayClicked dialogStyles={trainingsDialog} ref={this.trainingsDialog} title="Trainings">
                    <CustomerTrainings trainings={this.state.trainings}/>
                </SkyLight>
            </div>
        );
    }
}

export default Customerlist;