import React from "react";
// import Styled from "styled-components";
import { Autocomplete, TextInput, IconButton } from 'evergreen-ui';
import Bulk from "./Bulk";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Fetch.css";
var unirest = require('unirest');


// main class
class Fetch extends React.Component {
    constructor(){
        super();
        this.state = {
          Airports: [],
          DefaultSpace : "Search",
          originPlace : "",
          destinationPlace : "",
          outboundDate:"" ,
          TripDate: new Date() ,
          showPopup: false,
          PricingData:[],
          Agents:[],
          TripTime:[],
          inputStyle : {
            fontSize:".8em", padding:"12px 22px",borderRadius:"40px",border:"2px solid #2c509a",
            fontFamily: "'Lora', serif", fontWeight:"bold", backgroundColor:"#fff", color:"#000",
            border: "3px solid rgba(116, 79, 1, 0.685)",
            height: "50px",
            borderRadius: "10px",
            marginLeft: "1px"
        },

        }
        //call methode that get the Airports, cities and countries names
        this.getAirportsNameFromFile();       
    }

    //after the Component mount change the date shape from words to numbers to fit the post request 
    componentDidMount(){
      this.ChangeDateShape();
      }

      //toggle the popup component
      togglePopup() {
        this.setState({
          showPopup: !this.state.showPopup,
          DefaultSpace : "Search"
        });
      }
      //take the originplace(Airport name) from the user and set it in the state 
    setOriginPlace(originPlace){
      let newOriginPlace;
      let org = originPlace.split('(');
      for (var i = 1; i < org.length; i++) {newOriginPlace = org[i].split(')')[0];}
        this.setState({ originPlace : newOriginPlace })
    }

    //take the destinationplace(Airport name) from the user and set it in the state 
    setDestinationPlace(destinationPlace){
      let newDestinationPlace;
      let des = destinationPlace.split('(');
      for (var i = 1; i < des.length; i++) {newDestinationPlace = des[i].split(')')[0];}
        this.setState({ destinationPlace : newDestinationPlace })
    }

    //get the Airports, cities and countries names from the json file
    getAirportsNameFromFile(){
      const DataFile  = require('../../airports.json');  //file size 1.6MB nearly and content nealy 7K Airport Name
      let Airport = []
      DataFile.map((index)=>{ Airport.push(index.city + ", " + index.country + " (" + index.code+ ")"); }) //push all Airports names        
      this.state.Airports = Airport;
    }

    //fetch the date from the api  
    fetchTheData(callback){
      var self =this;
      if(this.state.originPlace =="" || this.state.destinationPlace == ""){
        alert('please insert origin and destination place fields')

      }
      else{
        this.setState({
          DefaultSpace :"Loading....."
        })
      unirest.post("https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/pricing/v1.0")
      .header("X-RapidAPI-Key", "dde53a9062msh03e3f34724e422bp1c2542jsn9c9d6e846969")
      .header("Content-Type", "application/x-www-form-urlencoded")
      .send("country=US")
      .send("currency=USD")
      .send("locale=en-US")
      .send(`originPlace=${this.state.originPlace}-sky`)
      .send(`destinationPlace=${this.state.destinationPlace}-sky`)
      .send(`outboundDate=${this.state.outboundDate}`)
      .send("adults=1")
      .end(function (result) {
        if(result.status==400){
          alert("Sorry but these Airport doesn't exist in the Ariports list of the api please try some popular Airports")
          self.setState({
            DefaultSpace :"Search"
          })
        }
        else{
        var sessionkey = result.headers.location.substr(64, 36);
        // self.showmessage();

      fetch(`https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/pricing/uk2/v1.0/${sessionkey}?pageIndex=0&pageSize=10`, { 

      headers: {
        'X-RapidAPI-Key': 'dde53a9062msh03e3f34724e422bp1c2542jsn9c9d6e846969'
      } })
      .then(res => res.json())
      .then((data)=>{
        // console.log(data);
        self.setState({
          PricingData: data
        })
        //after fetching the data callback togglePopup() methode to open the Popup and show data 
        callback();

          })
       } })
    }
  
  }

    //get the date and set it to the state
    handleChange(date) {    
      this.setState({ TripDate: date }, () => { this.ChangeDateShape() }); 
    }

    //change the date shape from words to numbers to fit the post request
     ChangeDateShape(){
      let year = this.state.TripDate.toString().substr(11,4);
      let day = this.state.TripDate.toString().substr(8,2);
      let month;
      switch(this.state.TripDate.toString().toLowerCase().substr(4,3)){
        case "jan":month="01";break;
        case "feb":month="02";break;
        case "mar":month="03";break;
        case "apr":month="04";break;
        case "may":month="05";break;
        case "jun":month="06";break;
        case "jul":month="07";break;      
        case "aug":month="08";break;
        case "sep":month="09";break;
        case "oct":month="10";break;
        case "nov":month="11";break;
        case "dec":month="12";break;  
      }
      let newDate = year+"-"+month+"-"+day;
      this.setState({outboundDate: newDate })
    }
    //send the data to the stateless function to show the data of trips in it 
    showTrips() {
      let price = this.state.PricingData.Itineraries.map((item, i)=>{
        return (item.PricingOptions[0].Price )})

        let Arrival= this.state.PricingData.Legs.map((item, i)=>{
          return ( item.Arrival )})

        let Departure= this.state.PricingData.Legs.map((item, i)=>{
          return ( item.Departure )})

        let Duration= this.state.PricingData.Legs.map((item, i)=>{
          var hours = Math.trunc(item.Duration/60);
          var minutes = item.Duration % 60;
          var dur=`${hours}h ${minutes}m`
          return (  dur  )})

        let Agents= this.state.PricingData.Agents.map((item, i)=>{
          return ( item.ImageUrl )})
           if(this.state.PricingData.Itineraries.length == 0){
            return (
            <div className="eContainer">
              <h1  id="ErrorMessage">Sorry there is no Trip at this Date try another Date or Place Now </h1>
              <button onClick={()=>{this.togglePopup()}} id="errorbutton" >Close</button>
            </div>
              )


          }
            else{
      return(
        
        price.map((item, i)=>{
          return(
          <div className="container"> 
            <div id="Agents"><img src={Agents[i]} alt="" /></div>
            <div id="Departure"><span>Departure : {Departure[i].split('T')[1]}</span>
            <span>Arrival : {Arrival[i].split('T')[1]}</span>
            </div>          
            <div id="Duration">Duration : {Duration[i]}</div>
            <div id="price">Price : {price[i]}</div>
            <div  className="th"><button id="select" onClick={()=>{this.togglePopup()}}>select</button></div>
          </div>
        )
      }))           
}
}
    render(){
      return(<Bulk.Consumer>{(app)=>{
        console.log(this.state)
          return(
              <React.Fragment>
                      
                      <div className="form">
                        
                        <Autocomplete title="OriginPlace"  onChange={(changedItem) => {this.setOriginPlace(changedItem)}} items={this.state.Airports} >
                          {(props) => {
                            const { getInputProps, getRef, inputValue } = props
                            return ( <TextInput placeholder="Country, City or airport" style={this.state.inputStyle} value={inputValue} innerRef={getRef} {...getInputProps()} /> )
                          }}
                        </Autocomplete>
                        
                        <Autocomplete title="DestinationPlace"  onChange={(changedItem) => {this.setDestinationPlace(changedItem)}} items={this.state.Airports} >
                          {(props) => {
                            const { getInputProps, getRef, inputValue } = props
                            return ( <TextInput placeholder="Country, City or airport" style={this.state.inputStyle} value={inputValue} innerRef={getRef} {...getInputProps()} /> )
                          }}
                        </Autocomplete>
                        <DatePicker selected={this.state.TripDate} className="ds" onChange={(date)=>{this.handleChange(date)}}/>
                        
                        <button onClick={()=>{this.fetchTheData(this.togglePopup.bind(this))}} className="button" >
                        {this.state.DefaultSpace}
                        </button>
                          {this.state.showPopup ? 
                            <Popup
                            text={this.showTrips()}
                            closePopup={this.togglePopup.bind(this)}
                            />
                            : null
                          }
                     
                      </div> 
              </React.Fragment>)
          }}</Bulk.Consumer>
      )
  }
}

const Popup = (props) =>{
  return (
    <div className='popup'>
      <div className='popup_inner'>
      <span className="close" onClick={props.closePopup}></span>
      <div id="trips">{props.text}</div>
      </div>
    </div>
    )
}

export default Fetch;



















// defaultValue={this.state.NewPrespName}
// defaultValue={this.state.NewPrespAge}
// onChange={(event)=>{this.setAgeCase(event.target.value)}}


    // show(){
    //   console.log(this.state);

    // }


    // setDefaultDrug(drug){
    //   this.setState({ DefaultSpace : drug })
    // }

    // console.log(year+"-"+ month +"-"+day)
    