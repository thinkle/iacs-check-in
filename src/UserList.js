import React from 'react';
import fieldsets from './fields.js';
import _ from 'lodash';

function UserDetails (props) {
    
    var myfieldsets = props.fieldsets.map((fs)=>_.find(fieldsets,['title',fs]));

    return <span className='userDetails'>
             {myfieldsets.map(
                 (fieldset)=><span className="detailSet">
                 {fieldset.fields.map(
                     (field)=><><span className={'userDetail '+field.key} style={field.outStyle}>
                                  {field.formatValue && field.formatValue(props.user[field.key]) || props.user[field.key]}
                                </span>&nbsp;</>
                 )}
                 </span>
             )}
           </span>
}

function User (props) {

    const fieldsets = props.fieldsets || ['Info']
    
    return (
        props.menu && 
            <button className='button user' {...props}>
              <UserDetails fieldsets={fieldsets} {...props}/>
            </button>
        ||
        <div className='user'>
          <UserDetails fieldsets={fieldsets} {...props}/>
        </div>
    );
}

function UserList (props) {
    return (
            <div>
              {props.users.map(
                  (u)=><User {...props} user={u} menu={!!props.onSelected} onClick={()=>props.onSelected(u)}/>
              )}
            </div>
    );
}

export default UserList;
