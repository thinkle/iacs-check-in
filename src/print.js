import React from 'react';
import './print.css';

function PrintScreen (props) {

    return (
        props.user &&
    <div>
      <div className='print'>
        <div className='badge'>
          <div className='left'>
            <div className='date'>{props.user.timestamp.toLocaleDateString()}</div>
          </div>
          <div className='center'>
            <div className='role'>{props.user.role}</div>
            <div className='name'>{props.user.name}</div>
            <div className='purpose'>{props.user.purpose}</div>
            <div className='time'>{props.user.timestamp.toLocaleTimeString()}</div>
          </div>
          <div className='right'>
            <div className='day'>
              {props.user.timestamp.toLocaleString('en', {weekday: 'long'})}
            </div>
          </div>
        </div>
      </div>
      <div className='noprint'>
        <div className='buttons'>
          <div className='button' onClick={()=>window.print()}>Print</div>
          <div className='button' onClick={props.onComplete}>Done</div>
        </div>
      </div>
    </div> ||
            <div>{JSON.stringify(props.user)}</div>
    )
}

export default PrintScreen;
