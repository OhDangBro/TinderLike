import { React, useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import "../../css/chat.css";
import auth from "../../utils/auth";
import { useSubscription, useQuery, useLazyQuery } from '@apollo/client';
import { useMutation } from "@apollo/client";
import { GET_MESSAGES } from '../../utils/subscriptions';
import { QUERY_MESSAGES, QUERY_MESSAGES_TO_RECIPIENT } from '../../utils/queries';
import { POST_MESSAGE } from '../../utils/mutations';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';
import InputAdornment from '@mui/material/InputAdornment';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import dateFormat from '../../utils/dateFormat';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  borderRadius: '0',
  color: theme.palette.text.secondary,
}));

const Chat = (props) => {
  let mergeResult = [];
  let newMergeResult = [];
  const loggedIn = auth.loggedIn(); // assign the auth login to one word variable makes it easier to type
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [newMessages, setNewMessages] = useState([]);
  const [partnerMessages, setPartnerMessages] = useState([]);
  const [userMessages, setUserMessages] = useState([]);
  const { data, loading } = useSubscription(
    GET_MESSAGES,
    { onSubscriptionData: (data) => { handleNewMessage(data.subscriptionData.data.messagePosted) } });

  const [getMessagesTo, { data: messagesTo, loading: loadingMessagesTo }] = useLazyQuery(
    QUERY_MESSAGES_TO_RECIPIENT,
    { variables: { username: props.myData.me.username, recipient: props.currentChatPartner }, }
  );

  const [getMessagesFrom, { data: messagesFrom, loading: loadingMessagesFrom }] = useLazyQuery(
    QUERY_MESSAGES_TO_RECIPIENT,
    {
      variables: { username: props.currentChatPartner, recipient: props.myData.me.username },
      onCompleted: (data) => { organizeMessages() }
    }
  );
  console.log('subscription ran: ', data);
  const { subscribeToMore, data: result, loading: loadingMessages } = useQuery(QUERY_MESSAGES);

  const handleNewMessage = (data) => {
    setUserMessages([...userMessages, data]);
  }

  const organizeMessages = () => {
    let array1 = messagesTo;
    let array2 = messagesFrom;
    mergeResult = [].concat(array1.messagesToRecipient, array2.messagesToRecipient);
    mergeResult.sort((a, b) => b.createdAt > a.createdAt ? -1 : b.createdAt > a.createdAt ? 1 : 0);
    setMessages(mergeResult);
  }

  const subscribeToNewComments = () => {
    subscribeToMore({
      document: GET_MESSAGES,
      variables: {},
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const newFeedItem = subscriptionData.data.messagePosted;
        return Object.assign({}, prev, {
          messages: [...prev.messages, newFeedItem]
        });
      }
    })
  }

  const [postMessage] = useMutation(POST_MESSAGE);

  const [postMessageFrom] = useMutation(POST_MESSAGE);

  const handleChange = (e) => {
    setMessage(e.target.value);
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      postIt();
    }
  };

  const handleKeyDownFrom = (event) => {
    if (event.key === 'Enter') {
      postItFrom();
    }
  };

  async function postIt() {
    try {
      await postMessage({
        variables: { username: props?.myData.me.username, text: message, recipient: props?.currentChatPartner }
      });
    } catch (e) {
      console.error(e);
    } finally {
      setMessage('');
    }
  }

  async function postItFrom() {
    try {
      await postMessageFrom({
        variables: { username: props?.currentChatPartner, text: message, recipient: props?.myData.me.username }
      });
    } catch (e) {
      console.error(e);
    } finally {
      setMessage('');
    }
  }

  useEffect(() => {
    getMessagesFrom();
    getMessagesTo();
  }, [messagesTo, messagesFrom]);
  console.log('lazy ran? ', messagesTo);
  console.log('state combined messages: ', messages);
  // console.log('merge result out: ', mergeResult)
  if (!loggedIn) { // if not logged in they dont get the page and data
    return <div>You must login</div>
  }
  if (loadingMessages) {
    //displaying loading placeholder until user and me queries are all done
    return <div>Loading...</div>;
  }

  return (
    <div style={{ marginBottom: '5rem' }}>
      <Grid>
        <h2>Chatting with: {props.currentChatPartner}</h2>
        <Item style={{ maxHeight: '400px', overflowY: 'scroll' }}>
          {messages?.map(message => {
            if (message.username === props.currentChatPartner) {
              return (
                <Stack style={{ position: 'relative', margin: '5px 20px' }} alignItems="start">
                  <p style={{color: 'black', fontSize: '8px'}}>{dateFormat(parseInt(message.createdAt))}</p>
                  <Chip avatar={<Avatar>{props.currentChatPartner.charAt(0)}</Avatar>} label={message.text}></Chip>
                </Stack>
              );
            }
            return (
              <Stack style={{ position: 'relative', margin: '5px 20px' }} spacing={1} alignItems="end">
                <p style={{color: 'black', fontSize: '8px'}}>{dateFormat(parseInt(message.createdAt))}</p>
                <Chip avatar={<Avatar>{props.myData?.me.username.charAt(0)}</Avatar>} color="primary" label={message.text} />
              </Stack>
            );
          })}
          {/* This is where extra messages are tacked on in the DOM */}
          {userMessages?.map(message => {
            if (message.username === props.currentChatPartner) {
              return (
                <Stack style={{ position: 'relative', margin: '5px 20px' }} alignItems="start">
                  <Chip avatar={<Avatar>{props.currentChatPartner.charAt(0)}</Avatar>} label={message.text}></Chip>
                </Stack>
              );
            }
            return (
              <Stack style={{ position: 'relative', margin: '5px 20px' }} spacing={1} alignItems="end">

                <Chip avatar={<Avatar>{props.myData?.me.username.charAt(0)}</Avatar>} color="primary" label={message.text} />
              </Stack>
            );
          })}
        </Item>
        <Divider />
        <Item>
          {props.myData.me.username}'s chat box'
          <TextField
            style={{ width: '100%' }}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            id="input-with-icon-textfield"
            label="Type here"
            value={message}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SendIcon onClick={handleKeyDown} />
                </InputAdornment>
              ),
            }}
            variant="standard"
          />
          {props.currentChatPartner}'s chat box'
          <TextField
            style={{ width: '100%' }}
            onChange={handleChange}
            onKeyDown={handleKeyDownFrom}
            id="input-with-icon-textfield"
            label="Type here"
            value={message}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SendIcon onClick={handleKeyDownFrom} />
                </InputAdornment>
              ),
            }}
            variant="standard"
          />
        </Item>
      </Grid>
    </div>
  )
}
export default Chat;