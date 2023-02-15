import { useQuery } from '@apollo/client';
import { QUERY_USERS_BY_ID, QUERY_ME } from "../../utils/queries";
import { useState, useEffect } from 'react';

const MatchesDisplay = (matchedUserIds) => {
    const [matchedProfiles, setMatchedProfiles] = useState(null)
    const { loading, data } = useQuery(QUERY_USERS_BY_ID, {
        variables: {
            _id: matchedUserIds.matches
        }
    })

    const {loading: meLoading, data: me} = useQuery(QUERY_ME)

    useEffect(() => {
        setMatchedProfiles(data)
    }, [data])

    console.log('did state update:  ', matchedProfiles);

    return (
        <div>
            {matchedProfiles?.usersById?.filter(user => user._id !== me.me._id).map(user => 
                <p key={user._id}>
                    {user.username} || Role: {user.role}
                </p>
            )}
        </div>
    )
}
export default MatchesDisplay;