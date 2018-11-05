import React, { Component } from 'react';
import SkyLight from 'react-skylight';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import Tooltip from '@material-ui/core/Tooltip';
import { injectIntl, IntlProvider, FormattedRelative } from 'react-intl';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'

const Date = injectIntl(({ date, intl }) => (
    <span>{intl.formatDate(date)} (<FormattedRelative value={date} />)</span>
));

class Customertraininglist extends Component {

    constructor(props) {
        super(props);
        this.listDialog = React.createRef();
        this.state = { trainings: [], showSnackbar: false, customerLink: '' };
    }

    componentDidMount() {
        this.setState({ trainings: this.props.trainings });
    }

    deleteTraining = (link) => {
        fetch(link, { method: 'DELETE' })
            .then(response => {
                this.listTrainings();
                this.setState({ showSnackbar: true })
            })
        fetch(this.props.trainingsLink)
            .then(response => response.json())
            .then(responseData => {
                this.setState({ trainings: responseData.content })
            })
    }

    confirmDeleteTraining = (link) => {
        this.listDialog.current.hide();
        confirmAlert({
          title: 'Delete Training',
          message: 'Are you sure you want to delete the training?',
          buttons: [
            {
              label: 'Yes',
              onClick: () => this.deleteTraining(link)
            },
            {
              label: 'No',
              onClick: () => alert('Operation cancelled')
            }
          ]
        })
    }

            
    showDialog = () => {
        fetch(this.props.trainingsLink)
            .then(response => response.json())
            .then(responseData => {
                this.setState({ trainings: responseData.content })
            })
        this.listDialog.current.show();
    }

    handleClose = (event, reason) => {
        this.setState({ showSnackbar: false });
    };

    render() {
        const listDialog = {
            marginTop: '-300px'
        }

        const columns = [{
            Header: 'Date',
            accessor: 'date',
            Cell: (props) => (<Date date={props.value} />)
        }, {
            Header: 'Duration',
            accessor: 'duration'
        }, {
            Header: 'Activity',
            accessor: 'activity'
        }, {
            Header: '',
            filterable: false,
            sortable: false,
            accessor: 'links[0].href',
            Cell: ({ value }) => (
                <Tooltip title='Delete' placement='right'>
                    <IconButton onClick={() => this.confirmDeleteTraining(value)} aria-label='delete'>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            )
        }]

        return (
            <div>
                <Button style={{ margin: 2 }} size="medium" variant="contained" color="primary" onClick={this.showDialog}> Trainings </Button>
                <SkyLight hideOnOverlayClicked dialogStyles={listDialog} ref={this.listDialog} title="Trainings of Customer">
                    <IntlProvider locale={navigator.language}>
                        <ReactTable data={this.state.trainings} columns={columns} filterable={true} defaultPageSize={5} />
                    </IntlProvider>
                    <Snackbar message='Training deleted' open={this.state.showSnackbar} onClose={this.handleClose} autoHideDuration={3000} />
                </SkyLight>

            </div>
        );
    }
}

export default Customertraininglist;