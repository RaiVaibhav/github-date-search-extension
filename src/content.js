/*global chrome*/
/* src/content.js */
import React from 'react';
import {render, createPortal} from 'react-dom';
import moment from 'moment';
import Frame, { FrameContextConsumer }from 'react-frame-component';
import "./content.css";
import 'font-awesome/css/font-awesome.min.css';

class Calendar extends React.Component {
  state = {
      dateContext: moment(),
      today: moment(),
      showMonthPopup: false,
      showYearPopup: false,
      selectedDay: null,
      flag:false
  }

  constructor(props) {
      super(props);
      this.width = props.width || "350px";
      this.style = props.style || {};
      this.style.width = this.width; // add this
  }


  weekdays = moment.weekdays(); //["Sunday", "Monday", "Tuesday", "Wednessday", "Thursday", "Friday", "Saturday"]
  weekdaysShort = moment.weekdaysShort(); // ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  months = moment.months();

  year = () => {
      return this.state.dateContext.format("Y");
  }
  month = () => {
      return this.state.dateContext.format("MMMM");
  }
  daysInMonth = () => {
      return this.state.dateContext.daysInMonth();
  }
  currentDate = () => {
      return this.state.dateContext.get("date");
  }
  currentDay = () => {
      return this.state.dateContext.format("D");
  }

  firstDayOfMonth = () => {
      let dateContext = this.state.dateContext;
      let firstDay = moment(dateContext).startOf('month').format('d'); // Day of week 0...1..5...6
      return firstDay;
  }

  setMonth = (month) => {
      let monthNo = this.months.indexOf(month);
      let dateContext = Object.assign({}, this.state.dateContext);
      dateContext = moment(dateContext).set("month", monthNo);
      this.setState({
          dateContext: dateContext
      },()=>{
        if (this.state.flag){
            let inputVal = (document.forms[0].childNodes[2].childNodes[1].value).split("created:>")[0]
            if (inputVal.length!==0 && inputVal.substr(-1)!==" ") inputVal+=" "
            document.forms[0].childNodes[2].childNodes[1].value = inputVal + "created:>"+this.state.dateContext.format('YYYY-MM-DD')
      }});
  }

  nextMonth = () => {
      let dateContext = Object.assign({}, this.state.dateContext);
      dateContext = moment(dateContext).add(1, "month");
      this.setState({
          dateContext: dateContext
      },()=>{
        if (this.state.flag){
            let inputVal = (document.forms[0].childNodes[2].childNodes[1].value).split("created:>")[0]
            if (inputVal.length!==0 && inputVal.substr(-1)!==" ") inputVal+=" "
            document.forms[0].childNodes[2].childNodes[1].value = inputVal + "created:>"+this.state.dateContext.format('YYYY-MM-DD')
      }});
      this.props.onNextMonth && this.props.onNextMonth();
  }

  prevMonth = () => {
      let dateContext = Object.assign({}, this.state.dateContext);
      dateContext = moment(dateContext).subtract(1, "month");
      this.setState({
          dateContext: dateContext
      },()=>{
        if (this.state.flag){
            let inputVal = (document.forms[0].childNodes[2].childNodes[1].value).split("created:>")[0]
            if (inputVal.length!==0 && inputVal.substr(-1)!==" ") inputVal+=" "
            document.forms[0].childNodes[2].childNodes[1].value = inputVal + "created:>"+this.state.dateContext.format('YYYY-MM-DD')      
        }});
      this.props.onPrevMonth && this.props.onPrevMonth();
  }

  onSelectChange = (e, data) => {
      this.setMonth(data);
      this.props.onMonthChange && this.props.onMonthChange();

  }
  SelectList = (props) => {
      let popup = props.data.map((data) => {
          return (
              <div key={data}>
                  <a href="#" onClick={(e)=> {this.onSelectChange(e, data)}}>
                      {data}
                  </a>
              </div>
          );
      });

      return (
          <div className="month-popup">
              {popup}
          </div>
      );
  }

  onChangeMonth = (e, month) => {
      this.setState({
          showMonthPopup: !this.state.showMonthPopup
      });
  }

  MonthNav = () => {
      return (
          <span className="label-month"
              onClick={(e)=> {this.onChangeMonth(e, this.month())}}>
              {this.month()}
              {this.state.showMonthPopup &&
               <this.SelectList data={this.months} />
              }
          </span>
      );
  }
  setYear = (year) => {
      let dateContext = Object.assign({}, this.state.dateContext);
      dateContext = moment(dateContext).set("year", year);
      dateContext.set("date",this.state.selectedDay)
      this.setState({
          dateContext: dateContext
      },()=>{
        if (this.state.flag){
            let inputVal = (document.forms[0].childNodes[2].childNodes[1].value).split("created:>")[0];
            if (inputVal.length!==0 && inputVal.substr(-1)!==" ") inputVal+=" ";
            document.forms[0].childNodes[2].childNodes[1].value = inputVal + "created:>"+this.state.dateContext.format('YYYY-MM-DD');
      }})
  }
  onYearChange = (e) => {
      this.setYear(e.target.value);
      this.props.onYearChange && this.props.onYearChange(e, e.target.value);
  }

  onKeyUpYear = (e) => {
      if (e.which === 13 || e.which === 27) {
          this.setYear(e.target.value);
      }
  }

  YearNav = () => {
      return (
          <input
              defaultValue = {this.year()}
              className="editor-year"
              ref={(yearInput) => { this.yearInput = yearInput}}
              onKeyUp= {(e) => this.onKeyUpYear(e)}
              onChange = {(e) => this.onYearChange(e)}
              type="number"
              placeholder="year"/>
      );
  }

  onDayClick = (e, day) => {
    let cloneDateContext = this.state.dateContext.clone()
    cloneDateContext.set("date",day)
      this.setState({
          selectedDay: day,
          dateContext: cloneDateContext,
          flag:true
      }, () => {
          let inputVal = (document.forms[0].childNodes[2].childNodes[1].value).split("created:>")[0]
          if (inputVal.length!==0 && inputVal.substr(-1)!==" ") inputVal+=" "
          document.forms[0].childNodes[2].childNodes[1].value = inputVal + "created:>"+cloneDateContext.format('YYYY-MM-DD')
      });

      this.props.onDayClick && this.props.onDayClick(e, day);
  }

  render() {
      // Map the weekdays i.e Sun, Mon, Tue etc as <td>
      let weekdays = this.weekdaysShort.map((day) => {
          return (
              <td key={day} className="week-day">{day}</td>
          )
      });

      let blanks = [];
      for (let i = 0; i < this.firstDayOfMonth(); i++) {
          blanks.push(<td key={i * 80} className="emptySlot">
              {""}
              </td>
          );
      }


      let daysInMonth = [];
      for (let d = 1; d <= this.daysInMonth(); d++) {
          let className = "day";
          let selectedClass = (d === this.state.selectedDay ? " selected-day " : "")
          daysInMonth.push(
              <td key={d} className={className + selectedClass} >
                  <span onClick={(e)=>{this.onDayClick(e, d)}}>{d}</span>
              </td>
          );
      }



      var totalSlots = [...blanks, ...daysInMonth];
      let rows = [];
      let cells = [];

      totalSlots.forEach((row, i) => {
          if ((i % 7) !== 0) {
              cells.push(row);
          } else {
              let insertRow = cells.slice();
              rows.push(insertRow);
              cells = [];
              cells.push(row);
          }
          if (i === totalSlots.length - 1) {
              let insertRow = cells.slice();
              rows.push(insertRow);
          }
      });

      let trElems = rows.map((d, i) => {
          return (
              <tr key={i*100}>
                  {d}
              </tr>
          );
      })

      return (
          <div className="calendar-container" style={this.style}>
              <table className="calendar">
                  <thead>
                      <tr className="calendar-header">
                          <td colSpan="5">
                              <this.MonthNav />
                              {" "}
                              <this.YearNav />
                          </td>
                          <td colSpan="2" className="nav-month">
                              <i className="prev fa fa-fw fa-chevron-left"
                                  onClick={(e)=> {
                                      this.prevMonth()}}>
                              </i>
                              <i className="prev fa fa-fw fa-chevron-right"
                                  onClick={(e)=> {
                                      this.nextMonth()}}>
                              </i>

                          </td>
                      </tr>
                  </thead>
                  <tbody>
                      <tr>
                          {weekdays}
                      </tr>
                      {trElems}
                  </tbody>
              </table>

          </div>

      );
  }
}
const style = {
  position: "relative",
  margin: "50% auto"
}
const Main =() =>{
    let onDayClick = (e, day) => {
      console.log("selected day:", day)
    }
    return createPortal(
        <div id="my-extension-root" style={{background: "linear-gradient(grey 40%,white 50%)"}}><Frame head={[<link type="text/css" rel="stylesheet" href={chrome.runtime.getURL("/static/css/content.css")} ></link>
        ]}> 
            <FrameContextConsumer>
            {
                ({document, window}) => {
                    return (
                        <div className={'my-extension'}>
                            <Calendar style={style} width="302px" 
                                onDayClick={(e, day)=> onDayClick(e, day)}/> 
                        </div>

                    )
                }
            }
            </FrameContextConsumer>
        </Frame></div>,
        document.getElementById("extension_one")
    )
}

class MyButton extends React.Component {
    constructor(props){
        super(props);
        this.state={
            showMain: false
        }
    }
    render(){
        return (
            <div className="search-checkbox">
                <input type="checkbox" style={{margin:"5px"}}onChange={(event)=>{
                    if (event.target.checked){
                        this.setState({
                            showMain: true
                        })
                    }else{
                        let inputVal = (document.forms[0].childNodes[2].childNodes[1].value).split("created:>")[0]
                        document.forms[0].childNodes[2].childNodes[1].value =inputVal
                        this.setState({
                            showMain: false
                        })
                    }
                }}/>Date
                {this.state.showMain?<Main/>:null}
            </div>
        )
    }

}
const app = document.createElement('div');
app.id = "extension_one";

document.body.appendChild(app);
const one = document.createElement('div');
one.id = "something"
document.forms[0].childNodes[2].appendChild(one)
render(<MyButton />, document.getElementById("something"));