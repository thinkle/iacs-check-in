import React,{useState} from 'react';
import {ChooseField} from './widgets';
import PrintScreen from './print.js';
function Checkout (props) {
    
    const [user,setUser] = useState();

    return (
            <div>
            <ChooseField
              label='Name'
              value={user}
        onChange={(v) => setUser(v)}
        onCommit={()=>{}}
              options={props.checkedIn.map((data)=>({value:data,text:`${data.first} ${data.last}`}))}
            />
              {user && <PrintScreen noButtons={true} user={user}/>}
              <div className='buttons'>
                <button className='button' onClick={()=>props.onCheckOut(user)}>Check Out</button>
              </div>
            </div>
    );
}

export default Checkout;
