
import TinderCard from "react-tinder-card";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { useState, useEffect } from "react";
import { useQuery, useLazyQuery, useMutation } from "@apollo/client";
import { QUERY_USERS_BY_ROLE, QUERY_ME } from '../../utils/queries';
import MatchesDisplay from '../../components/MatchesDisplay';
import { ADD_FRIEND } from "../../utils/mutations";

const Dashboard = (me, userLocation) => {
  console.log('passed me: ', me)
  const [filteredUsers, setFilteredUsers] = useState([]);
  // swipe stuff
  const [lastDirection, setLastDirection] = useState();

  const { loading, data } = useQuery(QUERY_USERS_BY_ROLE, {
    variables: { role: me.me.me.role }
  });

  // const matchedUserIds = me.me.me.friends.map(friend => friend._id).concat(me.me.me._id);
  // console.log('matched ids: ', matchedUserIds);

  // Begin SWIPE Functions 
  const swiped = (direction, nameToDelete, id) => {
    console.log("removing: " + nameToDelete);
    setLastDirection(direction);
    if (direction === 'right') {
      addMatch(id)
    }
    nextMeat();
  };

  const outOfFrame = (name) => {
    console.log(name + " left the screen!");
  };

  const nextMeat = () => {
    let firstUser = filteredUsers[0];
    setFilteredUsers((current) =>
      current.filter((fruit, index) => index !== 0)
    );
    setFilteredUsers((current) => [...current, firstUser])
  }
  // End SWIPE Functions

  // Begin Location Functions
  const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };
  // End Location Functions

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

  useEffect(() => {
    if (data) {
      // const sortedUsers = users.sort((a, b) => {
      let arrayForSort = [...data.usersByRole]
      const sortedUsers = arrayForSort.sort((a, b) => {
        const distanceA = getDistanceFromLatLonInKm(
          userLocation.latitude,
          userLocation.longitude,
          // a.location.latitude,
          // a.location.longitude
          a.location[0],
          a.location[1]
        );
        const distanceB = getDistanceFromLatLonInKm(
          userLocation.latitude,
          userLocation.longitude,
          // b.location.latitude,
          // b.location.longitude
          b.location[0],
          b.location[1]
        );
        return distanceA - distanceB;
      });
      setFilteredUsers(sortedUsers);
    }
  }, [data]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item md={4} xs={12}>
          <div className="swipe-container">
            <div className="card-container">
              {filteredUsers &&
                filteredUsers.slice(0, 1).map((user) =>
                  <TinderCard
                    className="swipe "
                    key={user.username}
                    onSwipe={(dir) => swiped(dir, user.username, user._id)}
                    onCardLeftScreen={() => outOfFrame(user.username)}
                  >
                    <div
                      style={{ backgroundImage: "url(" + user.url + ")" }}
                      className="card"
                    >
                      <h4>{user.username}</h4>
                      <div
                        style={{
                          backgroundImage: "url(" + user.photoURL + ")",
                          width: "200px",
                          height: "200px",
                          backgroundSize: "cover",
                          margin: "auto"
                        }}
                        className="card"
                      ></div>
                      <h6>height: {user.height} weight: {user.weight} lbs.</h6>
                      <h6>{user.age} years old.</h6>
                      <h6>{user.ethnicity}</h6>
                      <h6>{user.role}</h6>
                      <br>
                      </br>
                      <p>{user.description}</p>
                    </div>
                  </TinderCard>
                )
              }
            </div>
           
          </div>
        </Grid>
        {/* <Grid item md={8} xs={12}>
          <div>
            <p> {me.me.me.username}'s Fren List</p>
            <hr />
            <MatchesDisplay matches={matchedUserIds} myID={me?.me.me._id}></MatchesDisplay >
          </div>
        </Grid> */}
      </Grid>
    </Box>
  )
};

export default Dashboard;