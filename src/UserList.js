import React from 'react';

function User (props) {
    return (
        props.menu && 
            <button className='button user' {...props}>
              <strong>{props.user.name}</strong> ({props.user.role} - {props.user.purpose})
            </button>
        ||
        <div className='user'>
          <strong>{props.user.name}</strong> ({props.user.role} - {props.user.purpose})
        </div>
    );
}

function UserList (props) {
    return (
            <div>
              {props.users.map(
                  (u)=><User user={u} menu={!!props.onSelected} onClick={()=>props.onSelected(u)}/>
              )}
            </div>
    );
}

export default UserList;
