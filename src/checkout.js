import React,{useState} from 'react';
import {ChooseField} from './widgets';

function Checkout (props) {
    
    const [user,setUser] = useState();

    return (
            <div>
            <ChooseField
        label='Name'
        onChange={(v) => setUser(v)}
        onCommit={()=>{}}
        options={props.checkedIn.map((data)=>({value:data,text:data.name}))}
            />
            <h3>{user && user.name}</h3>
            <button className='button' onClick={()=>props.onCheckOut(user)}>Check Out</button>
            </div>
    );
}

export default Checkout;
