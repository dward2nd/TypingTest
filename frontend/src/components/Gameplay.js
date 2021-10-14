import React, { Component } from "react";
import wordTemplate from "./wordTemplate";
import axios from "axios";

class Gameplay extends Component {
    constructor(props) {
        super(props);
        // constant for words used in this app. 100 words.
        this.wordCountMode = [
            {
                len: 10,
                row: 2,
            },
            {
                len: 25,
                row: 4,
            },
            {
                len: 50,
                row: 7,
            },
            {
                len: 100,
                row: 12,
            }
        ];

        let newWordList = [];
        for (let i = 0; i < 10; ++i)
            newWordList.push(wordTemplate.words[Math.floor(Math.random() * 200)]);

        console.log('New word list:', newWordList);

        this.state = {
            finished: false,
            currentMode: 0,
            wordList: newWordList,
            currentWordInd: 0,
            currentUserInput: '',
            isWrongWord: false,
            statTimeText: '00:00',
            statAccu: '-',
            statSpeed: '-',
        };

        // typing stat
        this.stat = {
            wrong: 0,
            correct: 0,
            latestCorrectLen: 0,
            accuracy: NaN,
            timestart: null,
            timeend: null,
            started: false,
            finished: false,
            speed: NaN,
        };

        this.userTypeInput = this.userTypeInput.bind(this);
        this.timer = null;
    }

    resetGame() {
        window.clearInterval(this.timer);

        this.stat = {
            wrong: 0,
            correct: 0,
            latestCorrectLen: 0,
            accuracy: NaN,
            timestart: null,
            timeend: null,
            started: false,
            finished: false,
            speed: NaN,
        };

        let newWordList = [];
        let keystrokeCount = 0;
        for (let i = 0; i < this.wordCountMode[this.state.currentMode].len; ++i) {
            let newWord = wordTemplate.words[Math.floor(Math.random() * 200)];
            newWordList.push(newWord);
            keystrokeCount += newWord.length;
        }

        this.setState({
            finished: false,
            currentWordInd: 0,
            currentUserInput: '',
            isWrongWord: false,
            statTimeText: '00:00',
            statAccu: '-',
            statSpeed: '-',
            wordList: newWordList,
            wordListKeystroke: keystrokeCount,
        });

        this.typeInputBox.focus();
    }

    componentDidMount() {
        this.typeInputBox.focus();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // check if wordCount changed
        if (this.state.currentMode !== prevState.currentMode)
            this.resetGame();
    }

    getTimeReport(timeDelta) {
        const diffSec = Math.floor(timeDelta / 1000);
        const diffSecWithin60 = diffSec % 60;
        const diffMinute = Math.floor(timeDelta / 60000);

        return [diffSecWithin60, diffSec, diffMinute];
    }

    userTypeInput(e) {
        if (this.state.finished)
            return;

        if (!this.stat.started) {
            this.stat.started = true;
            this.stat.timestart = new Date().getTime();

            // important note: this timer only calculate the rough speed.
            this.timer = window.setInterval(() => {
                const diffMillisec = new Date().getTime() - this.stat.timestart;
                const [diffSecWithin60, diffSec, diffMinute] = this.getTimeReport(diffMillisec);
                const totalKeystroke = this.stat.correct + this.stat.wrong;

                this.stat.accuracy = 100 - this.stat.wrong / totalKeystroke * 100;
                this.stat.speed = this.stat.correct / 5 / diffSec * 60;

                // display running time
                this.setState({
                    statTimeText: `${("0" + diffMinute).slice(-2)}:${("0" + diffSecWithin60).slice(-2)}`,
                    statAccu: Math.round(this.stat.accuracy) + '%',
                    statSpeed: Math.round(this.stat.speed) + ' wpm',
                });
            }, 1000);
        }

        const val = e.target.value;
        const realval = val.trim();
        const currentWord = this.state.wordList[this.state.currentWordInd];
        let cleared = false;
        let wrong = true;
        // check if not exceed the length of the current word
        // -1 was added in case if there's a space after it.

        if (val === ' ') {
            this.setState({currentUserInput: ''});
            cleared = true;
        }

        else if (realval.length <= currentWord.length) {
            if (realval === currentWord.slice(0, realval.length)) {

                wrong = false;
                if (realval.length > this.stat.latestCorrectLen)
                    this.stat.latestCorrectLen = ++this.stat.correct;
                // if it is actually finished

                if (val.slice(-1) === ' ') {
                    if (realval === currentWord) {

                        this.setState(prevState => {
                            return {
                                currentWordInd: prevState.currentWordInd + 1,
                                currentUserInput: '',
                            };
                        });

                        if (this.state.currentWordInd === this.state.wordList.length - 1) {
                            window.clearTimeout(this.timer);

                            this.stat.finished = true;
                            this.stat.timeend = new Date().getTime();

                            // recalculate the accurate speed (deep down to the milliseconds)
                            this.stat.speed = this.stat.correct / 5 / (this.stat.timeend - this.stat.timestart) * 60000;

                            this.setState({
                                finished: true,
                                statSpeed: `${Math.round(this.stat.speed)} wpm`,
                            });

                            // send data to server
                            console.log(`update speed=${this.stat.speed}, accuracy=${this.stat.accuracy}`);
                            axios.post('/api/scoreboard/', {
                                    date: new Date().toISOString(),
                                    speed: this.stat.speed,
                                    accuracy: this.stat.accuracy,
                                }).then(res => {
                                    this.props.setLatestUpdate(new Date());
                                    console.log('update response', res);
                                });
                        }

                        cleared = true;
                    } else
                        ++this.stat.wrong;
                }
            } else
                ++this.stat.wrong;

        }

        // avoid changing state if no needed to change.
        if (wrong !== this.state.isWrongWord) {
            this.setState({isWrongWord: wrong});
        }

        if (!cleared) {
            this.setState({currentUserInput: val,});
            this.stat.latestCorrectLen = 0;
        }
    }

    render() {
        return (
            <div className="container-fluid">
                <nav aria-label="word-count" className='text-center'>
                    <span>I want to type</span>
                    <ul className="pagination" style={{display: 'inline-flex', margin: '0 15px'}}>
                    {
                        this.wordCountMode.map((el, ind) => {
                            return (
                                <li className={`page-item ${this.state.currentMode === ind ? 'active' : ''}`}
                                    key={ind}>
                                    <button className="page-link"
                                            onClick={() => this.setState({ currentMode: ind })}
                                            type="button">{el.len}</button>
                                </li>
                            );
                        })
                    }
                    </ul>
                    <span>words.</span>
                </nav>
                <div className="card">
                    <h5 className="card-header">Typing Practice</h5>
                    <div className="card-body">
                        <p className="card-text">
                        {
                            this.state.wordList.map((el, ind) => {
                                return (
                                    <span key={ind}
                                          className={'word ' +
                                                     (ind === this.state.currentWordInd ? 'current-word ' : '') +
                                                     (this.state.isWrongWord && ind === this.state.currentWordInd ? 'wrong-word ' : '') +
                                                     (ind < this.state.currentWordInd ? 'typed-word ' : '')}>
                                        {el}
                                    </span>
                                );
                            })
                        }
                        </p>
                    </div>
                </div>
                <div className="input-group mb-3">
                    <input type="text" name="word-input" id="word-input"
                           className={`form-control ${this.state.isWrongWord ? 'wrong-word' : ''}`}
                           value={this.state.currentUserInput}
                           onInput={this.userTypeInput}
                           ref={inputEl => this.typeInputBox = inputEl}
                    />
                    <button className="btn btn-primary" type="button" onClick={() => this.resetGame()}>
                        replay
                    </button>
                </div>
                <div className="row">
                    <div className="col-sm-4">
                        <h5>Time</h5>
                        <div className="stat-time">{this.state.statTimeText}</div>
                    </div>
                    <div className="col-sm-4">
                        <h5>Accuracy</h5>
                        <div className="stat-accu">{this.state.statAccu}</div>
                    </div>
                    <div className="col-sm-4">
                        <h5>Speed</h5>
                        <div className="stat-progress">
                            {this.state.statSpeed}
                        </div>
                    </div>
                </div>
                {
                    this.state.finished && (
                        <div className="card w-50 m-auto">
                            <div className="card-body">
                                <h5 className="card-title text-center">Summary</h5>
                                <h1 className="text-center">{Math.round(this.stat.speed)}</h1>
                                <p style={{color: 'red'}} className='text-center'>wpm</p>
                                <p className="card-text">
                                    <strong>Time</strong> {this.state.statTimeText}<br />
                                    <strong>Accuracy</strong> {Math.round(this.stat.accuracy)}%<br />
                                    <strong>Keystroke</strong> <span style={{color: 'green'}}>{this.stat.correct}</span> | <span style={{color: 'red'}}>{this.stat.wrong}</span>
                                </p>
                            </div>
                        </div>
                    )
                }
            </div>
        );
    }
}

export default Gameplay;