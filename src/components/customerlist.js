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
import AddCustomer from './AddCustomer';
import CustomerTrainingList from './Customertraininglist';
import AddTraining from './AddTraining';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'

class Customerlist extends Component {

    constructor(props) {
        super(props);
        this.trainingsDialog = React.createRef();
        this.state = { customers: [], showSnackbar: false , trainings: [], customerLink: '', trainingsLink: ''};
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

    confirmDeleteCustomer = (link) => {
        confirmAlert({
          title: 'Delete Customer',
          message: 'Are you sure you want to delete the customer?',
          buttons: [
            {
              label: 'Yes',
              onClick: () => this.deleteCustomer(link)
            },
            {
              label: 'No',
              onClick: () => alert('Operation cancelled')
            }
          ]
        })
      };

    listCustomers = () => {
        fetch('https://customerrest.herokuapp.com/api/customers')
            .then(response => response.json())
            .then(responseData => {
                this.setState({ customers: responseData.content },function() {
                        this.setState({ trainingsLink: this.state.customers[0].links[2].href, customerLink: this.state.customers[0].links[0].href})
                    })
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

    saveTraining = (training) => {
        fetch('https://customerrest.herokuapp.com/api/trainings',
            {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(training)
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
        this.setState({ trainingsLink: link[2].href, customerLink: link[0].href})
        fetch(link[2].href)
            .then(response => response.json())
            .then(responseData => {
                this.setState({ trainings: responseData.content })
            })
        this.trainingsDialog.current.show();
    }

    render() {

        const columns = [
            {
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
            accessor: 'links',
            Cell: ({ row, value }) => (
                <CustomerTrainingList trainings={this.state.trainings} trainingsLink={this.state.trainingsLink}/>
            )
        }, {
            Header: 'Trainings',
            filterable: false,
            sortable: false,
            accessor: 'links[0].href',
            Cell: ({ row, value }) => (
                <AddTraining saveTraining={this.saveTraining} customerLink={value}/>
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
                    <IconButton onClick={() => this.confirmDeleteCustomer(value)} aria-label='delete'>
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
                        <CustomerTrainingList trainings={this.state.trainings} trainingsLink={this.state.trainingsLink}/>
                    </SkyLight>
            </div>
        );
    }
}

export default Customerlist;