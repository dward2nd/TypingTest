import React, { Component } from 'react';
import Gameplay from "./Gameplay";
import Scoreboard from "./Scoreboard";

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            latestUpdate: new Date(),
        };

        this.setLatestUpdate = this.setLatestUpdate.bind(this);
    }

    setLatestUpdate(date) {
        this.setState({ latestUpdate: date });
    }

    render() {
        return (
            <>
                <main className='flex-shrink-0'>
                    <div className="container">
                        <div className='row'>
                            <div className='col-lg-9'>
                                <Gameplay
                                    setLatestUpdate={this.setLatestUpdate}
                                />
                            </div>
                            <div className='col-lg-3'>
                                <Scoreboard
                                    latestUpdate={this.state.latestUpdate}
                                    setLatestUpdate={this.setLatestUpdate}
                                />
                            </div>
                        </div>
                    </div>
                </main>
                <footer className="footer mt-auto py-3">
                    <div className="container">
                        <p className="text-center">
                            This web application was inspired by&nbsp;
                            <a href="https://monkeytype.com" rel="nofollow noreferrer">monkeytype.com</a>.
                            All words used in this website comes from&nbsp;
                            <a href="https://github.com/Miodec/monkeytype/blob/master/static/languages/english.json"
                               rel="nofollow noreferrer">this file</a>,
                            as a part of the repository of monkeytype.com project.
                        </p>
                    </div>
                </footer>
            </>
        );
    }
}

export default App;