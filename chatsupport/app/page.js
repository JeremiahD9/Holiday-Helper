"use client"
import * as React from 'react';
import { Box, Stack, TextField, Button, AppBar, Toolbar, Typography, Container} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import {useState} from "react"

export default function Home() {
  
  const [messages, setMessages] = useState([
    {role: "assistant", content: "Hi! Im your life assistant. How can I help you"},
  
  ])

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff8c7',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    margin: 5,
    height: "250px",
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));
  
  const sendMessage = async () => {
    setMessage('')
    setMessages((messages) => [...messages, {role: "user", content: message}, {role: "assistant", content: ""}])
    const response = fetch('/api/chat', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([...messages, {role: "user", content: message}]),
    }).then(async(res) => {
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let result = ''
      return reader.read().then(function processText({done, value}){
        if (done) {
          return result
        }
        const text = decoder.decode(value || new Uint8Array(), {stream: true})
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1]
          let otherMessages = messages.slice(0, messages.length - 1)

          return [...otherMessages, {...lastMessage, content: lastMessage.content + text},]
        })
        return reader.read().then(processText)
      })
    })
    
  }

  const[message, setMessage] = useState("")

  return (
    <Box width="100vw" height="100vh" display="flex" flexDirection={"column"} overflow= "hidden">
      <AppBar position="static" top sx={{marginBottom: 1}} >
        <Toolbar>
          <Typography variant="h4">Holiday Helper</Typography>
        </Toolbar>
      </AppBar>
      <Stack direction="row" border="1.5px solid black">
        <Stack direction="column" width="500px" height="650px" border="1.5px solid black" p={2} spacing={3} sx={{marginLeft: 1, borderRadius: 3}}>
          <Stack direction="column" spacing={2} flexGrow={1} overflow={"auto"} maxHeight={"100%"}>
            {
              messages.map((message, index) => (
                <Box key={index} display="flex" justifyContent={message.role === "assistant" ? "flex-start" : "flex-end"}>
                  <Box bgcolor={message.role === "assistant" ? "primary.main" : "secondary.main"} color="white" borderRadius={16} p={3}>
                    {message.content}
                  </Box>
                </Box>
              ))
            }
          </Stack>
          <Stack direction="row" spacing={2}>
            <TextField label="Message" fullWidth value={message} onChange={(e) => {setMessage(e.target.value)}} />
            <Button variant="contained" onClick={sendMessage}>
              Send
            </Button>
          </Stack>
        </Stack>
        <Container sx={{ border: "1.5px solid red", display: "flex", flexDirection: "column"}}>
          <Box sx={{ border: "1.5px solid blue", height: "75px", marginTop: 2, width: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
            Budget
          </Box>
          <Box border="1.5px solid green" width="100%" height= "100%" display="flex" flexDirection="row">
            <Box border="1.5px solid purple" width="70%" height="100%">
              <Grid container spacing={2} rowSpacing={5}>
                <Grid xs={4}>
                  <Item>Location</Item>
                </Grid>
                <Grid xs={4}>
                  <Item>Hotel</Item>
                </Grid>
                <Grid xs={4}>
                  <Item>Duration</Item>
                </Grid>

                <Grid xs={4}>
                  <Item>Activies</Item>
                </Grid>
                <Grid xs={4}>
                  <Item>Food</Item>
                </Grid>
                <Grid xs={4}>
                  <Item>Travel</Item>
                </Grid>
              </Grid>
            </Box>
            <Box border="1.5px solid orange" width="30%" display="flex" flexDirection="column" justifyContent="center">
              <Item style={{height: "100%"}}>
                Extra Funds
              </Item>
            </Box>
          </Box>
        </Container>
      </Stack>
    </Box>
  );
}
