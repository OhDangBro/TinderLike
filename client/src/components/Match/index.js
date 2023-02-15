import { React, useEffect, useState } from 'react';
import { useQuery, useMutation, useLazyQuery } from '@apollo/client';
import { QUERY_ME, QUERY_USERS_BY_ROLE } from '../../utils/queries';
import { ADD_FRIEND } from "../../utils/mutations";
import MatchesDisplay from '../MatchesDisplay';
import Auth from '../../utils/auth';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import '../../css/match.css';

const Match = () => {
  const loggedIn = Auth.loggedIn(); // assign the auth login to one word variable makes it easier to type

  const [preference, setPreference] = useState(null); // temp value to control the user preference
  const [me, setMe] = useState(null); // value to control logged in user state
  // const [allUsers, setAllUsers] = useState({}) // this was for QUERY_USERS
  const [users, setUsers] = useState(null)

  //get all users not needed just testing query calls
  // const [tess, { called: calledUsers, loading: loadingUsers, data: users }] = useLazyQuery(QUERY_USERS);
  // get user own profile

  const { loading: loadingMe, data: myData } = useQuery(QUERY_ME);
  // get users by preference
  const [loadPreference, { called: calledUsersRole, loading: loadingUsersRole, data: usersByRole }] = useLazyQuery(QUERY_USERS_BY_ROLE, {
    variables: { role: preference }
  });

  const matchedUserIds = me?.me.friends.map(friend => friend._id).concat(me?.me._id);
  console.log('matched ids: ', matchedUserIds);

  const filteredUsers = users?.usersByRole.filter(
    user => !matchedUserIds.includes(user._id)
  )
  console.log('filtered users: ', filteredUsers);


  const [addFriend] = useMutation(ADD_FRIEND); //setup mutation for adding ppl

  const addMatch = async (id) => {
    try {
      await addFriend({
        variables: { id: id },
      });
    } catch (e) {
      console.error(e);
    }
  }
  const handlePreferenceChange = (event) => {
    setPreference(event.target.value);
    // loadPreference()
  };

  useEffect(()=>{
    // getMe()
    setMe(myData);
    // setAllUsers(users);
    loadPreference();
    setUsers(usersByRole)
  },[myData, usersByRole])

  useEffect(()=> {
    if (me) {
      let myPreference = (me.me.role === 'female' ? 'male' : 'female' )
      setPreference(myPreference);
    }
  })
  console.log('checking preferences: ', preference)

  if (!loadingUsersRole && !loadingMe) {
    <div>Loading...</div>
  }
  if (!loggedIn) { // if not logged in they dont get the page and data
    return <div>You must login</div>
  }
  if (loadingUsersRole && loadingMe) {
    //displaying loading placeholder until user and me queries are all done
    return <div>Loading...</div>;
  }
  return (
    <div>
      <p>What is your preference?</p>
      <FormControl>
        <FormLabel id="demo-controlled-radio-buttons-group">Gender</FormLabel>
        <RadioGroup
          aria-labelledby="demo-controlled-radio-buttons-group"
          name="controlled-radio-buttons-group"
          value={preference}
          onChange={handlePreferenceChange}>
          <FormControlLabel value="female" control={<Radio />} label="Female" />
          <FormControlLabel value="male" control={<Radio />} label="Male" />
        </RadioGroup>
      </FormControl>     
      <hr />
      <br/> 
      <div className='flex-row gap-1'>
        <div>
          {/* if value equals "female" show <p>Female</p> else if not...show <p>Male</p>  */}
          {preference === 'female' ? <p>Female</p> : <p>Male</p>}
          <hr/>

          {filteredUsers?.map(user => 
           <div className='flex-row justify-content-space-between align-items-center mb-2'>
             <p key={user.username}>{user.username}</p>  
             <div onClick={() => addMatch(user._id)} className='ml-3 matchBtn'>add</div>
           </div>
          )}
        </div>
        <div>
          <p> {me?.me.username}'s Fren List</p>
          <hr/>

          <MatchesDisplay matches={matchedUserIds} myID={me?.me._id}></MatchesDisplay >
         
          {/* {me?.me.friends.map(friend => 
            <p key={friend._id}> {friend._id}</p>  
          )} */}
        </div>
        
        
        
      </div>
    </div>
  );
}

export default Match