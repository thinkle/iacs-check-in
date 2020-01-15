import React,{useState,useEffect} from 'react';
import _ from 'lodash';
import logo from './iacs.png';
import './App.css';
import Checkin from './checkin.js';
import Checkout from './checkout.js';
import PrintScreen from './print.js';
import UserList from './UserList.js';
import Google from './gapiLoader.js';
import SheetWriter from './googleSheetWriter.js';
import fieldsets from './fields.js';
import {Dropdown,Error} from './widgets.js';

function useCheckin (props) {

    var localCopy = window.localStorage.getItem(
        'users'
    );

    var googleSheetId = window.localStorage.getItem(
        'ssid'
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
    const [gapiReady,setGapiReady] = useState(false);
    const [docUpdated,setDocUpdated] = useState(true);
    const [error,setError] = useState();
    const [doc,setDoc] = useState({title:'School Check In Data',id:googleSheetId,url:SheetWriter({id:googleSheetId}).getUrl()});

    // if (!error) {
    // try {
    //     const duck = 2 + 'hello' * 7.23;
    //     duck = duck + 3
    // }
    //     catch (err) {
    //         console.log('TEST ERROR',err);
    //         setError(err);
    // }}

    useEffect( ()=>{
        function checkGapi () {
            console.log('checkGapi...');
            if (!gapiReady) {
                if (window.gapi) {
                    console.log('Got gapi...');
                    if (window.gapi.auth2) {
                        console.log('Got auth2...');
                        if (window.gapi.auth2.getAuthInstance() && window.gapi.auth2.getAuthInstance().isSignedIn.get()) {
                            console.log('Authorized!');
                            setGapiReady(true);
                            return;
                        }
                    }
                }
            }
            console.log('Check in another half sec...');
            window.setTimeout(checkGapi,500);
        }
        checkGapi();
    },[]);

    function sortUsers (users) {
        const today = new Date();
        var uu = users.map((u)=>({...u,timestamp: new Date(u.timestamp), out : u.out && new Date(u.out)}));
        uu = _.orderBy(uu,['out','timestamp'],['desc','desc'])
        uu = uu.filter(
            (u)=>(u.timestamp.getDay()==today.getDay())
        );
        return uu;
    }

    function toCsv (users) {
        const uu = sortUsers(users);
        var out = ''
        fieldsets.forEach(
                    (fieldSet)=>{
                        fieldSet.fields.forEach(
                            (field) => {
                                out += (field.key[0].toUpperCase() + field.key.substr(1)) + ','
                            }
                        )
                    }
                );
        out += '\n' + uu.map(
            (user)=>{
                var row = ''
                fieldsets.forEach(
                    (fieldSet)=>{
                        fieldSet.fields.forEach(
                            (field) => {
                                if (field.formatValue) {
                                    row += (field.formatValue(user[field.key])+',');
                                }
                                else {
                                    row += (user[field.key] || "")+','
                                }
                            }
                        )
                    }
                );
                return row;
            }
        ).join('\n')
        return out;

    }

    async function updateDoc (users) {
        console.log("Let's try updating this baby!")
        setDocUpdated(false);
        try {
            var result = await SheetWriter(doc).write(toCsv(users));
            setDoc(result);
            setDocUpdated(true);
            if (result.id) {
                console.log('Save ID');
                window.localStorage.setItem('ssid',result.id);
            }
        }
        catch (err) {
            setError(err);
            console.log('Error updating doc',err);
        }
    }


    function setUsers (users) {
        users = sortUsers(users);
        window.localStorage.setItem('users',JSON.stringify(users))
        updateDoc(users);
        _setUsers(users);
    }

    return {

        async addUser (user) {setUsers([...users,user])},

        clearError () {
            setError();
        },

        async checkoutUser (user) {

            const newUsers = _.cloneDeep(users)
            const userObj = _.find(newUsers,['first',user.first,'last',user.last]);
            if (userObj) {
                userObj.out = new Date();
                setUsers(newUsers);
            }
            else {
                throw 'No user'
            }
        },
        checkedIn : users.filter((u)=>!u.out),
        users,
        doc,
        error,
        docUpdated,
    }
}

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



function App(props) {

    const [mode,setMode] = useState(
         'start'
    )
    const [completeScreenProps,setCompleteScreenProps] = useState({});
    const [checkingInUser,setCheckingInUser] = useState(
        // {name:'Thomas Hinkle',
        //  timestamp: new Date(),
        //  role:'Test Role',
        //  purpose:'Test Purpose'
        // }
    );
    const {checkedIn,users,
           addUser,doc,docUpdated,error,
           checkoutUser,clearError,
          } = useCheckin(props);


    function handleCheckOut (user) {
        console.log('Check out',user);
        checkoutUser(user)
            .then(
                ()=>{
                    setCompleteScreenProps({
                        title:`Checked Out ${user.first} ${user.last}`,
                        message:'Thanks for checking out!'
                    }
                    );
                    setMode('complete')
                }
            );
    }

    function handlePrintingComplete () {
        setCompleteScreenProps({
            title : `Checked In ${checkingInUser.first} ${checkingInUser.last}`,
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
                      onClick={()=>setMode('details')}
                    >
                      Visitor Details
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
             <div><h2>Visitors</h2>
               <UserList users={checkedIn}/>
               <div className="noprint"><div className='buttons'><button className="button right" onClick={()=>window.print()}>Print</button></div></div>
             </div>
             ||mode=='details' &&
             <div>
               <h2>Today's Visitors: All Details</h2>
               <UserList users={users} fieldsets={['Info','Vehicle','Checkin Data']}/>
             </div>
             ||mode=='start' &&
             <Google onReady={()=>setMode('')}/>
             ||mode=='google' &&
             <Google />
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
          <div className='footer'>
            <a target="_blank" href={doc.url}>Google Sheet w/ Sign In Info</a>
            {docUpdated && '✓' || <span className="busy">Updating document...</span>}
            {error && <Error err={error} name='Syncing error' onClear={clearError}/>}
          </div>
        </div>
    );

    function chooser () {
        return <div className='buttons'>
          <a className="button" onClick={()=>setMode('checkin')}>Check In</a>
          <a className="button" onClick={()=>setMode('checkout')}>Check Out</a>
          {mode && <a className="button exit" onClick={()=>setMode()}>Exit</a>}
        </div>
    }


}




export default App;
