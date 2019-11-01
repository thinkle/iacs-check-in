import React,{useState,useEffect,useRef} from 'react';

function Field (props) {
    return (
        <div className={'formitem '+(props.highlight&&'highlight')}>
          <label className='label'>{props.label}
            <div className='field'>{props.children}</div>
          </label>
        </div>
    );
}

function TextField (props) {

    var widget = useRef(null);

    useEffect(
        ()=>{
            if (props.highlight && widget) {
                console.log('widget',widget);
                widget.current.focus();
            }
        },[props.highlight])
    
    return <Field {...props}>
             <input ref={widget}
                    type='text'
                    value={props.value} {...props}
                    onBlur={props.onCommit}
                    onChange={(e)=>props.onChange(e.target.value)}/>
           </Field>
}

function ChooseField (props) {

    var widget = useRef(null);

    const values = props.options.map((o)=>o.value||o);

    useEffect(
        ()=>{
            if (props.highlight && widget) {
                widget.current.focus()
            }
        },[props.highlight]);

    return <Field {...props}>
             <select {...props}
                     ref={widget}
                     value={values.indexOf(props.value)}
                     onInput={(e)=>{props.onChange(values[e.target.value])}}
                     onChange={props.onCommit}
                     >
               <option value=''>-</option>
               {props.options.map(
                   (o,i)=><option value={i}>{o.text||o.value||o}</option>)}
             </select>
           </Field>
}

export {TextField,ChooseField}
