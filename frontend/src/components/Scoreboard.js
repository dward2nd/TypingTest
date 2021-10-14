import React, { Component } from "react";
import axios from "axios";

class Scoreboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            records: [{
                speed: '-',
                accuracy: '-',
                date: new Date(),
            }],
        };

        this.fetchTimer = null;
        this.fetchTimerFinished = true;

        this.fetchScoreboard = this.fetchScoreboard.bind(this)
    }

    fetchScoreboard() {
        if (!this.fetchTimerFinished)
            window.clearTimeout(this.fetchTimer);

        axios.get('/api/scoreboard/').then(res => {
            console.log('scoreboard fetched: ', res.data);

            let newRecords = [];
            res.data.forEach(el => {
                newRecords.push({
                    speed: el.speed,
                    accuracy: el.accuracy,
                    date: new Date(el.date),
                });
            })

            this.setState({ records: newRecords });
        });

        this.fetchTimerFinished = false;
        this.fetchTimer = window.setTimeout(() => {
            this.fetchTimerFinished = true;
            this.fetchScoreboard();
        }, 20000);
    }

    componentDidMount() {
        this.fetchScoreboard();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.latestUpdate !== this.props.latestUpdate)
            this.fetchScoreboard();
    }

    formatTime(date) {
        const currentTime = new Date().getTime();
        date = date.getTime();
        const totalSec = Math.floor((currentTime - date) / 1000);
        const sec = totalSec % 60;
        const minute = Math.floor(totalSec / 60);

        if (minute > 0)
            return `${minute}m`
        else
            return `${sec}s`
    }

    render() {
        return (
            <>
                <h2>Recent Best</h2>
                <h6>(1 hour, 20 records)</h6>
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col">Speed</th>
                            <th scope="col">Accu</th>
                            <th scope="col">Time</th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        this.state.records.map(el => {
                            return (
                                <tr key={el.date}>
                                    <td scope="row"><strong>{Math.round(el.speed)} wpm</strong></td>
                                    <td scope="row">{Math.round(el.accuracy)}%</td>
                                    <td scope="row">{this.formatTime(el.date)}</td>
                                </tr>
                            );
                        })
                    }
                    </tbody>
                </table>
                <button className="btn btn-primary" onClick={() => this.props.setLatestUpdate(new Date())}>refresh</button>
                <p style={{color: 'red'}}>* Auto-refresh every 20s.</p>
                <p style={{color: '#AAAAAA'}}>Latest update: {this.props.latestUpdate.toString()}</p>
            </>
        );
    }
}

export default Scoreboard;