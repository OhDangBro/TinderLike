import React from "react";
import { Link } from "react-router-dom";

import backIcon from "../../images/backIcon.svg"

const Subheader = (props) => {

  return(
    <div className="subheader">
      <Link to={props.link}>
        <img src={backIcon}></img>
        {props.previousPageTitle && 
          <span>{props.previousPageTitle}</span>
        }
      </Link>
      <h5 style={{ color: 'white' }}>{props.pageTitle}</h5>
    </div>
    )
}

export default Subheader;