import { useQuery } from '@apollo/client';
import { QUERY_USERS_BY_ID, QUERY_ME } from "../../utils/queries";
import { useState, useEffect } from 'react';

const MatchList = (props) => {
  console.log('the props: ', props.userNameClick);
    const [matchedProfiles, setMatchedProfiles] = useState(null)
    const { loading, data } = useQuery(QUERY_USERS_BY_ID, {
        variables: {
            _id: props.matches
        }
    })

    const {loading: meLoading, data: me} = useQuery(QUERY_ME)

    useEffect(() => {
        setMatchedProfiles(data)
    }, [data])

    console.log('did state update:  ', matchedProfiles);

    return (
        <div>
            {matchedProfiles?.usersById?.filter(user => user._id !== props.myID).map(user => 
                <p style={{textAlign: 'left'}} onClick={() => props.userNameClick(user.username)} key={user._id}>
                    {user.username}
                </p>
            )}
        </div>
    )
}
export default MatchList;