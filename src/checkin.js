import React,{useState,useEffect} from 'react';
import {TextField,ChooseField} from './widgets'

function Checkin (props) {

    const [checkInfo,setCheckInfo] = useState({});
    const [nextUp,setNextUp] = useState('');
    const [isReady,setIsReady] = useState(false);
    const required = ['name','role','purpose'];

    useEffect(()=>updateForm(),[])
    
    function setKey (k,v) {
        setCheckInfo({
            ...checkInfo,
            [k]:v
        });
    }

    function fp (k, type) {

        function validate (v) {
            if (type=='phone') {
                var out = ''
                for (let l of v) {
                    if ('1234567890'.indexOf(l) > -1) {
                        out += l;
                    }
                }
                if (out.length <= 3) {
                    return out
                }
                else if (out.length <= 7) {
                    return `${out.substr(0,3)}-${out.substr(3)}`
                }
                else if (out.length > 7) {
                    return `(${out.substr(0,3)}) ${out.substr(3,3)}-${out.substr(6,4)}`
                }
            }
            else {
                return v;
            }
        }

        return {
            value : checkInfo[k],
            onChange : (v)=>{
                v = validate(v);
                setKey(k,v);
            },
            onCommit : ()=>updateForm(),
            label : k[0].toUpperCase() + k.substr(1),
            highlight : k==nextUp
        }
    }

    //function isReady () {
    function updateForm () {
        for (var key of required) {
            if (!checkInfo[key]) {
                setIsReady(false);
                setNextUp(key);
                return
            }
        }
        setNextUp('');
        setIsReady(true);
    }
    
    function checkIn () {
        if (!isReady) {
            window.alert('Not complete yet!');
        }
        else {
            props.onCheckIn({
                ...checkInfo,
                timestamp : new Date(),
            });
            
        }
    }

    return (
        <div className="form">
          <div className="formgroup">
            <h3>Info</h3>
            <TextField {...fp('name')}/>
            <ChooseField
              {...fp('role')}
              options={[
                  'Volunteer',
                  'Vendor',
                  'Visitor',
                  'Family',
                  'College Representative',
                  'Consultant',
              ]}
            />
            <ChooseField
              {...fp('purpose')}
              options={[
                  'Meeting',              
                  'Consultation',
                  'Conference',
                  'Volunteer'
              ]}
            />
          </div>

          <div className="formgroup">
            <h3>Vehicle</h3>
            <ChooseField
              {...fp('make')}
              options={['Honda','Toyota','GM','Ford','Other']}
              />
            <TextField
              {...fp('model')}
              />
            <TextField
              {...fp('license')}
            />
            <TextField {...fp('cell phone','phone')}/>
          </div>

          <button  className={'button ' + (isReady&&'active'||'inactive')} onClick={checkIn}>
            Complete Check-In
          </button>
          
          <pre>
            {JSON.stringify(checkInfo)}
          </pre>
        </div>
    );

    
    
}



export default Checkin;
