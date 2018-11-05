import React, { Component } from 'react';
import BigCalendar from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = BigCalendar.momentLocalizer(moment);

const tempDates = [];

class Calendar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            trainings: [],
            dates: []
        };
    }

    componentDidMount() {
        this.listTrainings();
    }

    listTrainings = () => {
        fetch('https://customerrest.herokuapp.com/api/trainings')
            .then(response => response.json())
            .then(responseData => {
                this.setState({ trainings: responseData.content },
                    function () {
                        this.state.trainings.forEach(
                            function (training,index) {
                                const beginTime = new Date(training.date);
                                const endTime = new Date(training.date);
                                const event = {
                                    id: index,
                                    title: training.activity,
                                    start: beginTime,
                                    end: new Date(endTime.setMinutes(beginTime.getUTCMinutes() + training.duration)),
                                }
                                tempDates.push(event);
                            });
                    }
                )
            }
            )
            this.setState({dates : tempDates})
    }

render() {
    return (
        <div className="Calendar">
            <BigCalendar
                events={this.state.dates}
                showMultiDayTimes
                defaultDate={new Date()}
                localizer={localizer}
            />
        </div>
    );
}
}

export default Calendar;