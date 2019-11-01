import React,{useState,useEffect} from 'react';
import _ from 'lodash';
import logo from './iacs.png';
import './App.css';
import Checkin from './checkin.js';
import Checkout from './checkout.js';
import PrintScreen from './print.js';
import UserList from './UserList.js';
import Google from './gapiLoader.js';

import {Dropdown} from './widgets.js';


function Reprint (props) {
    return <div>
             <h2>Select Pass to Reprint</h2>
             <UserList {...props}/>
           </div>
}

function CompleteScreen (props) {
    return (
        <div className='message'>
          <h3>{props.title||'Complete'}</h3>
          <p>{props.message}</p>
          <p>{props.children}</p>
        </div>
    )
}


function useCheckin (props) {

    var localCopy = window.localStorage.getItem(
        'users'
    );
    if (localCopy) {
        try {
            localCopy = JSON.parse(localCopy)
        }
        catch (err) {
            console.log('WARNING: Unable to parse local users',err,localCopy);
            localCopy = undefined;
        }
    }
    if (!localCopy) {
        localCopy = [];
    }

    const [users,_setUsers] = useState(localCopy);

    function setUsers (users) {
        window.localStorage.setItem('users',JSON.stringify(users))
        _setUsers(users);
    }

    return {

        async addUser (user) {setUsers([...users,user])},

        async checkoutUser (user) {

            const newUsers = _.cloneDeep(users)
            const userObj = _.find(newUsers,['name',user.name]);
            if (userObj) {
                userObj.out = true;
                setUsers(newUsers);
            }
            else {
                throw 'No user'
            }
        },
        checkedIn : users.filter((u)=>!u.out),
    }
}

function App(props) {

    const [mode,setMode] = useState(
        // 'print'
    )
    const [completeScreenProps,setCompleteScreenProps] = useState({});
    const [checkingInUser,setCheckingInUser] = useState(
        // {name:'Thomas Hinkle',
        //  timestamp: new Date(),
        //  role:'Test Role',
        //  purpose:'Test Purpose'
        // }
    );
    const {checkedIn,
           addUser,
           checkoutUser,
          } = useCheckin(props);


    function handleCheckOut (user) {
        console.log('Check out',user);
        checkoutUser(user)
            .then(
                ()=>{
                    setCompleteScreenProps({
                        title:`Checked Out ${user.name}`,
                        message:'Thanks for checking out!'
                    }
                    );
                    setMode('complete')
                }
            );
    }

    function handlePrintingComplete () {
        setCompleteScreenProps({
            title : `Checked In ${checkingInUser.name}`,
            message : 'Thank you for checking in and printing your name pass! Please come back to this computer to check out when you are done.'
        });
        setCheckingInUser();
        setMode('complete');
    }

    function handleCheckIn (newData) {
        console.log('Check in',newData);
        addUser(newData).then(
            ()=>{
                setCheckingInUser(newData);
                setMode('print');
            }
        );
    }

    function reprint (user) {
        setCheckingInUser(user);
        setMode('print');
    }

    return (
        <div className="App">
          <div className="topwrap">
            <div className="top">
              <img src={logo} className="App-logo" alt="logo" />
              <div className="brand">Check In</div>
              {mode && chooser()}
              <div className="centeringPlaceholder">
                <Dropdown>
                  <div className='buttonMenu'>
                    <button
                      className='button'
                      onClick={()=>setMode('list')}
                    >
                      List visitors
                    </button>
                    <button
                      className='button'
                      onClick={()=>setMode('google')}
                    >
                      Set up google link
                    </button>
                    <button
                      className='button'
                      onClick={()=>setMode('reprint')}
                    >
                      Re-print pass
                    </button>

                  </div>
                </Dropdown>
              </div>
            </div>
          </div>
          <div className="main">
            {!mode && chooser ()
             ||mode=='list' &&
             <UserList users={checkedIn}/>
             ||mode=='google' &&
             <Google/>
             ||mode=='reprint' &&
             <Reprint users={checkedIn}
                      onSelected={reprint}
             />
             ||mode=='checkin' &&
             <Checkin onCheckIn={handleCheckIn}/>
             ||mode=='checkout' &&
             <Checkout checkedIn={checkedIn} onCheckOut={handleCheckOut}/>            
             ||mode=='print'&&
             <PrintScreen user={checkingInUser} onComplete={handlePrintingComplete}/>
             || mode=='complete' && 
            <CompleteScreen {...completeScreenProps}>
             <div className='buttons'>
               <button className="button" onClick={()=>setMode()}>Done</button>
             </div>
            </CompleteScreen>}
          </div>
        </div>
    );

    function chooser () {
        return <div className='buttons'>
          <a className="button" onClick={()=>setMode('checkin')}>Check In</a>
          <a className="button" onClick={()=>setMode('checkout')}>Check Out</a>
          <a className="button exit" onClick={()=>setMode()}>Exit</a>
        </div>
    }


}




export default App;
