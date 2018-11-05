import React, { Component } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Tooltip from '@material-ui/core/Tooltip';
import SaveIcon from '@material-ui/icons/Save';
import AddTraining from './AddTraining';
import { injectIntl,IntlProvider,FormattedRelative} from 'react-intl';

const Date = injectIntl(({date, intl}) => (
    <span>{intl.formatDate(date)} (<FormattedRelative value={date}/>)</span>
));

class Traininglist extends Component {

    constructor(props) {
        super(props);
        this.state = { trainings: [], showSnackbar: false };
    }

    componentDidMount() {
        this.listTrainings();
    }

    deleteTraining = (link) => {
        console.log(link);
        fetch(link, { method: 'DELETE' })
            .then(response => {
                this.listTrainings();
                this.setState({ showSnackbar: true })
            })
    }

    listTrainings = () => {
        fetch('https://customerrest.herokuapp.com/api/trainings')
            .then(response => response.json())
            .then(responseData => {
                this.setState({ trainings: responseData.content })
            })
    }

    saveTraining = (training) => {
        fetch('https://customerrest.herokuapp.com/api/trainings',
            {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(training)
            })
            .then(response => {
                this.listTrainings();
            })
    }

    updateTraining = (training, link) => {
        fetch(link,
        {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(training)
        })
        .then(response => {
            this.listTrainings();
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
                    const data = [...this.state.trainings];
                    data[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
                    this.setState({trainings:data})
                }}
                dangerouslySetInnerHTML={{
                    __html: this.state.trainings[cellInfo.index][cellInfo.column.id]
                }}
            />
        )
    }

    render() {

        const columns = [{
            Header: 'Date',
            accessor: 'date',
            Cell: (props) => (<Date date={props.value}/>)
            
        },{
            Header: 'Duration',
            accessor: 'duration',
            Cell: this.renderEditable
        },{
            Header: 'Activity',
            accessor: 'activity',
            Cell: this.renderEditable
        }, {
            Header: '',
            filterable: false,
            sortable: false,
            accessor: 'links[0].href',
            Cell: ({ row, value }) => (
                <Tooltip title='Update' placement='right'>
                    <IconButton onClick={() => this.updateTraining(row,value)} aria-label='update'>
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
                    <IconButton onClick={() => this.deleteTraining(value)} aria-label='delete'>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            )
        }]

        return (
            <div>
                <AddTraining saveTraining={this.saveTraining} />
                <IntlProvider locale={navigator.language}>
                <ReactTable data={this.state.trainings} columns={columns} filterable={true} defaultPageSize={10} />
                </IntlProvider>
                <Snackbar message='Training deleted' open={this.state.showSnackbar} onClose={this.handleClose} autoHideDuration={3000} />
            </div>
        );
    }
}

export default Traininglist;