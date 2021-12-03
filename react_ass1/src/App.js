import React,{useState,useEffect} from 'react';
import {format,addMonths,subMonths,startOfWeek,startOfMonth,endOfMonth,endOfWeek} from 'date-fns';
import addDays from 'date-fns/addDays';
import axios from 'axios';
import './App.css';

export const App=()=> {
  const [dates,setDates]=useState([]);
  const [changedStartDate,setChangedStartDate]=useState("");
  const [changedEndDate,setChangedEndDate]=useState("");
  const [originalData,setOriginalData]=useState({});
  const [startDate,setStartDate]=useState("hide");
  const [endDate,setEndDate]=useState("hide");

  useEffect(()=>{
    axios.get('https://www.gov.uk/bank-holidays.json')
    .then(response=>{
      setOriginalData(response.data);
     let currentDate= format(new Date(), "yyyy-MM-dd");
      let objKeys=Object.keys(response.data);
      let obj=[];  
      for(let i=0;i<objKeys.length;i++){
        for(let j=0;j<response.data[objKeys[i]].events.length;j++){
          if(response.data[objKeys[i]].events[j].date===currentDate){
            obj.push({
              "division":response.data[objKeys[i]].division,
              "event": response.data[objKeys[i]].events[j]
            })
          }
        }
      }
      setDates(obj);
    })
    .catch(err=>{console.log(err)})
   
  },[]);

  
  function handleBankEvents(Date){
    let objKeys=Object.keys(originalData);
    let obj=[];  
    if(typeof Date ==='string'){
      for(let i=0;i<objKeys.length;i++){
        for(let j=0;j<originalData[objKeys[i]].events.length;j++){
          if(originalData[objKeys[i]].events[j].date===Date){
            obj.push({
              "division":originalData[objKeys[i]].division,
              "event": originalData[objKeys[i]].events[j]
            })
          }
        }
      }
      setDates(obj);
    }else{
      for(let i=0;i<objKeys.length;i++){
        for(let j=0;j<originalData[objKeys[i]].events.length;j++){
          for(let k=0;k<Date.length;k++){
            if(originalData[objKeys[i]].events[j].date===Date[k]){
              obj.push({
                "division":originalData[objKeys[i]].division,
                "event": originalData[objKeys[i]].events[j]
              })
            }
          }
        }
      }
      setDates(obj);
    }
   
  }

  function handleStartDateChange(e){
    setChangedStartDate(e.target.value);
    if(e.target.value !==""){
      setEndDate('dis');
    }else{
      setEndDate('hide');
    }
    let objKeys=Object.keys(originalData);
    let obj=[];
    if(e.target.value!=="" && changedEndDate!==""){
      for(let i=0;i<objKeys.length;i++){
        for(let j=0;j<originalData[objKeys[i]].events.length;j++){
          if(originalData[objKeys[i]].events[j].date>=e.target.value && originalData[objKeys[i]].events[j].date<=changedEndDate){
            obj.push({
              "division":originalData[objKeys[i]].division,
              "event": originalData[objKeys[i]].events[j]
            })
          }
        }
      }
      setDates(obj);
    }
  }
  function handleEndDateChange(e){
    setChangedEndDate(e.target.value)
    let objKeys=Object.keys(originalData);
    let obj=[]
    if(e.target.value!=="" && changedStartDate!==""){
      for(let i=0;i<objKeys.length;i++){
        for(let j=0;j<originalData[objKeys[i]].events.length;j++){
          if(originalData[objKeys[i]].events[j].date>=changedStartDate && originalData[objKeys[i]].events[j].date<=e.target.value){
            obj.push({
              "division":originalData[objKeys[i]].division,
              "event": originalData[objKeys[i]].events[j]
            })
          }
        }
      }
      setDates(obj);
    }
  }

  function handleDatesArr(getMonth){
    const monthStart =startOfMonth(getMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd);
    let getDays = [];
    let day = startDate;
    let formattedDate = "";
    let displayDates=[]
    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, "yyyy-MM-dd");
        getDays.push(formattedDate);
        day = addDays(day, 1);
      }
      displayDates.push(getDays);
      getDays = [];
    }
    return displayDates;
  }


  function handleChangeValue(e){
    
    let currentDate=format(new Date(), "yyyy-MM-dd")

    let displayDates=handleDatesArr(new Date());

    if(e.target.value==="Today"){
      setStartDate("hide");
      setEndDate('hide');
      setChangedStartDate("");
      setChangedEndDate("");
      handleBankEvents(currentDate)
    }
    if(e.target.value==="Yesterday"){
      setStartDate("hide");
      setEndDate('hide');
      setChangedStartDate("");
      setChangedEndDate("");
      let getWeeks;
      for(let i=0;i<displayDates.length;i++){
        for(let j=0;j<displayDates[i].length;j++){
          if(displayDates[i][j]===currentDate){
            if(i===0 && j===0){
              getWeeks=handleDatesArr(subMonths(new Date(),1));
              let count=0;
              for(let i=0;i<7;i++){
                if(getWeeks[getWeeks.length-1][i]===displayDates[0][i]){
                  count++;
                }
              }
              if(count!==0){
                handleBankEvents(getWeeks[getWeeks.length-2][6]);
              }else{
                handleBankEvents(getWeeks[getWeeks.length-1][6]);
              }
            }else{
              if(j!==0){
                j=j-1;
              }else{
                j=displayDates[i].length-1;
                i=i-1;
              }
              return handleBankEvents(displayDates[i][j]);
            }
            
          }
        }
      }
    }
    if(e.target.value==="Tomorrow"){
      setStartDate("hide");
      setEndDate('hide');
      setChangedStartDate("");
      setChangedEndDate("");
      for(let i=0;i<displayDates.length;i++){
        for(let j=0;j<displayDates[i].length;j++){
          if(displayDates[i][j]===currentDate){
            if(j!==displayDates[i].length-1){
              j=j+1; 
            }else{
              j=0;
              i=i+1;
            }
            return handleBankEvents(displayDates[i][j]);
          }
        }
      }
    }
    if(e.target.value==="ThisWeek"){
      setStartDate("hide");
      setEndDate('hide');
      setChangedStartDate("");
      setChangedEndDate("");
      for(let i=0;i<displayDates.length;i++){
        for(let j=0;j<displayDates[i].length;j++){
          if(displayDates[i][j]===currentDate){
            handleBankEvents(displayDates[i]);
          }
        }
      }
    }
    if(e.target.value==="LastWeek"){
      setStartDate("hide");
      setEndDate('hide');
      setChangedStartDate("");
      setChangedEndDate("");
      let getWeeks;
      for(let i=0;i<displayDates.length;i++){
        for(let j=0;j<displayDates[i].length;j++){
          if(displayDates[i][j]===currentDate){
            if(i!==0){
              i=i-1;
              return handleBankEvents(displayDates[i]);
            }else{
              getWeeks=handleDatesArr(subMonths(new Date(),1));
            }
          }
        }
      }
      if(getWeeks.length){
        let count=0;
        for(let i=0;i<7;i++){
          if(getWeeks[getWeeks.length-1][i]===displayDates[0][i]){
            count++;
          }
        }
        if(count!==0){
          handleBankEvents(getWeeks[getWeeks.length-2])
        }else{
          handleBankEvents(getWeeks[getWeeks.length-1])
        }
      }
      
    }
    if(e.target.value==="NextWeek"){
      setStartDate("hide");
      setEndDate('hide');
      setChangedStartDate("");
      setChangedEndDate("");
      let getWeeks;
      for(let i=0;i<displayDates.length;i++){
        for(let j=0;j<displayDates[i].length;j++){
          if(displayDates[i][j]===currentDate){
            if(i!==displayDates.length-1){
              i=i+1;
              return handleBankEvents(displayDates[i]);
            }else{
              getWeeks=handleDatesArr(addMonths(new Date(),1));
            }
          }
        }
      }
 
      if(getWeeks.length){
        let count=0;
        for(let i=0;i<7;i++){
          if(getWeeks[0][i]===displayDates[displayDates.length-1][i]){
            count++;
          }
        }
        if(count!==0){
          handleBankEvents(getWeeks[1])
        }else{
          handleBankEvents(getWeeks[0])
        }
      }
      
    }
    if(e.target.value==="ThisMonth"){
      setStartDate("hide");
      setEndDate('hide');
      setChangedStartDate("");
      setChangedEndDate("");
      let tempArr=[];
      for(let i=0;i<displayDates.length;i++){
        for(let j=0;j<displayDates[i].length;j++){
          if(displayDates[i][j].split("-")[1]===currentDate.split("-")[1]){
            tempArr.push(displayDates[i][j]);
          }
        }
      }
      handleBankEvents(tempArr);
    }
    if(e.target.value==="NextMonth"){
      setStartDate("hide");
      setEndDate('hide');
      setChangedStartDate("");
      setChangedEndDate("");
      let tempArr=[];
      let getMonthDates=handleDatesArr(addMonths(new Date(),1));
      for(let i=0;i<getMonthDates.length;i++){
        for(let j=0;j<getMonthDates[i].length;j++){
          if(getMonthDates[i][j].split("-")[1]===format(addMonths(new Date(),1),'MM')){
            tempArr.push(getMonthDates[i][j]);
          }
        }
      }
      handleBankEvents(tempArr);
    }
    if(e.target.value==="LastMonth"){
      setStartDate("hide");
      setEndDate('hide');
      setChangedStartDate("");
      setChangedEndDate("");
      let tempArr=[];
      let getMonthDates=handleDatesArr(subMonths(new Date(),1));
      for(let i=0;i<getMonthDates.length;i++){
        for(let j=0;j<getMonthDates[i].length;j++){
          if(getMonthDates[i][j].split("-")[1]===format(subMonths(new Date(),1),'MM')){
            tempArr.push(getMonthDates[i][j]);
          }
        }
      }
      handleBankEvents(tempArr);
    }
    if(e.target.value==='custom'){
      setStartDate("dis");
      setEndDate('hide');
      setDates([])
    }
  }

  return (
    <div id="events-wrapper">
      <div id="filter-options">
      <div>
        <input type="radio" name="date" defaultChecked value='Today' onChange={(e)=>handleChangeValue(e)}/>
        Today
      </div>
      <div style={{marginTop:10+"px"}}>
        <input type="radio" name="date" value='Yesterday' onChange={(e)=>handleChangeValue(e)}/>
        Yesterday
      </div>
      <div style={{marginTop:10+"px"}}>
        <input type="radio" name="date" value='Tomorrow' onChange={(e)=>handleChangeValue(e)}/>
        Tomorrow
      </div>
      <div style={{marginTop:10+"px"}}>
        <input type="radio" name="date" value='LastWeek' onChange={(e)=>handleChangeValue(e)}/>
        LastWeek
      </div>
      <div style={{marginTop:10+"px"}}>
        <input type="radio" name="date" value='LastMonth' onChange={(e)=>handleChangeValue(e)}/>
        LastMonth
      </div>
      <div style={{marginTop:10+"px"}}>
        <input type="radio" name="date" value='ThisWeek' onChange={(e)=>handleChangeValue(e)}/>
        ThisWeek
      </div>
      <div style={{marginTop:10+"px"}}>
        <input type="radio" name="date" value='ThisMonth' onChange={(e)=>handleChangeValue(e)}/>
        ThisMonth
      </div>
      <div style={{marginTop:10+"px"}}>
        <input type="radio" name="date" value='NextWeek' onChange={(e)=>handleChangeValue(e)}/>
        NextWeek
      </div>
      <div style={{marginTop:10+"px"}}>
        <input type="radio" name="date" value='NextMonth' onChange={(e)=>handleChangeValue(e)}/>
        NextMonth
      </div>
      <div style={{marginTop:10+"px"}}>
        <input type="radio" name="date" value='custom' onChange={(e)=>handleChangeValue(e)}/>
        custom date range
      </div>
      <div className={startDate}>
        Start Date:
        <input type="date" value={changedStartDate} onChange={(e)=>handleStartDateChange(e)}/>
      </div>
      <div className={endDate}>
        End Date:
        <input type="date" min={changedStartDate} value={changedEndDate} onChange={(e)=>handleEndDateChange(e)}/>
      </div>
      </div>
      <div id="filter-data">
      {dates.length>0?dates.map((item,index)=>{
        return <div key={index} className="data-items">
          <p>Division: {item.division}</p>
          <p>Event Title: {item.event.title}</p>
          <p>Event Date: {item.event.date}</p>
        </div>
      }):<div>No Event</div>}
      </div>
    </div>
  );
}


