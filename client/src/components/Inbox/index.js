import { React, useEffect, useState } from 'react';
import "../../css/chat.css";
import auth from "../../utils/auth";
import { useQuery } from '@apollo/client';
import { QUERY_ME, QUERY_USERS } from '../../utils/queries';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import MatchList from '../MatchList';
import Chat from '../Chat';

const Inbox = () => {
  const loggedIn = auth.loggedIn(); // assign the auth login to one word variable makes it easier to type
  const [partner, setPartner] = useState(null);
  const [me, setMe] = useState(null); // value to control logged in user state
  const [users, setUsers] = useState(null); // value to control logged in user state
  // const { data, loading } = useSubscription(GET_MESSAGES);
  const { loading: loadingMe, data: myData } = useQuery(QUERY_ME);
  const { loading: loadingUsers, data: usersData } = useQuery(QUERY_USERS);


  const matchedUserIds = me?.me.friends?.map(friend => friend._id).concat(me?.me._id);
  console.log('matched ids: ', matchedUserIds);

  const handleClick = (username) => {
    setPartner(username)
  }

  useEffect(() => {
    setMe(myData);
    
  }, [myData, usersData]) 

  if (!loggedIn) { 
    return <div>You must login</div>
  }
  if (loadingMe) {

    return <div>Loading...</div>;
  }

  return (
    <div style={{ marginBottom: '5rem' }}>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={4}>
           
            <MatchList userNameClick={handleClick} matches={matchedUserIds} myID={me?.me._id}></MatchList> 
          </Grid>
          <Grid item xs={8}>
          {partner &&
            <Chat myData={me} currentChatPartner={partner}/>
          }
          </Grid>
        </Grid>
      </Box>
      <hr></hr>
    </div>
  )
}
export default Inbox;