import React from 'react';
import './print.css';

function PrintScreen (props) {
    
    var timestamp = props.user.timestamp;
    if (!timestamp) {
        throw 'No timestamp!';
    }
    if (typeof timestamp == 'string') {
        timestamp = new Date(timestamp);
    }

    return (
        props.user &&
    <div>
      <div className='print'>
        <div className='badge'>
          <div className='left'>
            <div className='date'>{timestamp.toLocaleDateString()}</div>
          </div>
          <div className='center'>
            <div className='role'>{props.user.role}</div>
            <div className='name'>{props.user.first||props.user.name} {props.user.last||''}</div>
            <div className='purpose'>{props.user.purpose}</div>
            <div className='time'>{timestamp.toLocaleTimeString()}</div>
          </div>
          <div className='right'>
            <div className='day'>
              {timestamp.toLocaleString('en', {weekday: 'long'})}
            </div>
          </div>
        </div>
      </div>
      {!props.noButtons && 
      <div className='noprint'>
        <div className='buttons'>
          <div className='button' onClick={()=>window.print()}>Print</div>
          <div className='button' onClick={props.onComplete}>Done</div>
        </div>
      </div>}
    </div> ||
            <div>{JSON.stringify(props.user)}</div>
    )
}

export default PrintScreen;
