import React,{useState,useEffect} from 'react';
import {TextField,ChooseField} from './widgets'
import fieldsets from './fields.js';

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
            if (type=='allcaps') {
                return v.toUpperCase();
            }
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
                    return `${out.substr(0,3)}-${out.substr(3)}`;
                }
                else if (out.length >= 11) {
                    return `${out.substr(0,1)} (${out.substr(1,3)}) ${out.substr(4,3)}-${out.substr(7,4)} ${out.substr(11)}`;
                }
                else if (out.length > 7) {
                    return `(${out.substr(0,3)}) ${out.substr(3,3)}-${out.substr(6)}`;
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
          {fieldsets.map(
              (fieldset)=>(
                  !fieldset.noEntry &&
                  <div className='formgroup'>
                    <h3>{fieldset.title}</h3>
                    {fieldset.fields.map(
                        (field)=>(
                            field.type=='text' &&
                                <TextField {...fp(field.key,field.validationType)} {...field} />
                                ||
                                <ChooseField {...fp(field.key,field.validationType)} {...field} />
                        )
                    )
                    }
                  </div>)
          )
          }

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
