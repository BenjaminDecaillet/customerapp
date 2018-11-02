import React, { Component } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Tooltip from '@material-ui/core/Tooltip';
import SaveIcon from '@material-ui/icons/Save';
import { injectIntl,IntlProvider,FormattedRelative} from 'react-intl';

const Date = injectIntl(({date, intl}) => (
    <span>{intl.formatDate(date)} (<FormattedRelative value={date}/>)</span>
));

class Traininglist extends Component {

    constructor(props) {
        super(props);
        this.state = { trainings: [], showSnackbar: false };
    }



    handleClose = (event, reason) => {
        this.setState({ showSnackbar: false });
    };


    render() {

        const columns = [{
            Header: 'Date',
            accessor: 'date',
            Cell: (props) => (<Date date={props.value}/>)
        },{
            Header: 'Duration',
            accessor: 'duration'
        },{
            Header: 'Activity',
            accessor: 'activity'
        }]

        return (
            <div>
                <IntlProvider locale={navigator.language}>
                <ReactTable data={this.props.trainings} columns={columns} filterable={true} defaultPageSize={5} />
                </IntlProvider>
                <Snackbar message='Training deleted' open={this.state.showSnackbar} onClose={this.handleClose} autoHideDuration={3000} />
            </div>
        );
    }
}

export default Traininglist;