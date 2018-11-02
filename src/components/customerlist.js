import React, { Component } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Tooltip from '@material-ui/core/Tooltip';
import SaveIcon from '@material-ui/icons/Save';
import AddCustomer from './AddCustomer';

class customerlist extends Component {

    constructor(props) {
        super(props);
        this.state = { customers: [], showSnackbar: false };
    }

    componentDidMount() {
        this.listCustomers();
    }

    deleteCustomer = (link) => {
        console.log(link);
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
            accessor: 'links[0].href',
            Cell: ({ value }) => <Tooltip title='Delete' placement='right'><IconButton onClick={() => this.deleteCustomer(value)} aria-label='delete'><DeleteIcon /></IconButton></Tooltip>,
            filterable: false
        }]

        return (
            <div>
                <AddCustomer saveCustomer={this.saveCustomer} />
                <ReactTable data={this.state.customers} columns={columns} filterable={true} defaultPageSize={10} />
                <Snackbar message='Customer deleted' open={this.state.showSnackbar} onClose={this.handleClose} autoHideDuration={3000} />
            </div>
        );
    }
}

export default customerlist;