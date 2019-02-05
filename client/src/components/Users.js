import React from 'react';
import './Users.css';

const Users = (props) => {
  return (
    <div className="users">
      <div className="users__self">
        <span className="users__label">Username: </span>
        <span className="users__id">#{props.user}</span>
      </div>
      <div className="users__others">
        <span className="users__label">Sending to: </span>
        {props.users.length > 0 ?
          props.users.map((id, index) => (
            <span className="users__id" key={id}>#{id}</span>
          ))
          :
          <span className="users__id">Nobody else...</span>
        }
      </div>
    </div>
  )
}

export default Users;