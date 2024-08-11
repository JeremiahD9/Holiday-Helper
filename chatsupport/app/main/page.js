"use client";
import * as React from "react";
import {
  Box,
  Stack,
  TextField,
  Button,
  AppBar,
  Toolbar,
  Typography,
  Container,
  IconButton,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import { useState, useEffect } from "react";
import ProgressBar from "../components/progressBar";
import { GiAirplaneDeparture } from "react-icons/gi";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";

const Smartphone = styled(Box)(({ theme }) => ({
  position: "relative",
  width: "360px",
  height: "640px",
  margin: "6px",
  border: "16px black solid",
  borderTopWidth: "60px",
  borderBottomWidth: "60px",
  borderRadius: "36px",

  "&:before": {
    content: '""',
    display: "block",
    width: "60px",
    height: "5px",
    position: "absolute",
    top: "-30px",
    left: "50%",
    transform: "translate(-50%, -50%)",
    background: "#333",
    borderRadius: "10px",
  },

  "&:after": {
    content: '""',
    display: "block",
    width: "35px",
    height: "35px",
    position: "absolute",
    left: "50%",
    bottom: "-65px",
    transform: "translate(-50%, -50%)",
    background: "#333",
    borderRadius: "50%",
  },

  ".content": {
    width: "100%",
    height: "100%",
    background: "white",
  },
}));

const Card = styled(Box)(({ theme }) => ({
  // maxWidth: "500px",
  minHeight: "200px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",

  height: "300px",
  padding: "35px",

  border: "1px solid rgba(255, 255, 255, .25)",
  borderRadius: "20px",
  backgroundColor: "rgba(255, 255, 255, 0.45)",
  boxShadow: "0 0 10px 1px rgba(0, 0, 0, 0.25)",

  backdropFilter: "blur(15px)",

  ".card-footer": {
    fontSize: "0.65em",
    color: "#446",
  },
}));

export default function Home() {
  const [progress, setProgress] = useState(0);
  const [progressColor, setProgressColor] = useState("#21d150");
  const [user] = useAuthState(auth);
  const router = useRouter();
  console.log({ user });

  useEffect(() => {
    if (!user) {
      router.push("/");
    }
  }, [user, router]);

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I'm here to help you start saving for your dream vacation. Would you like to set up your first trip budget?",
    },
  ]);

  const [moneySpent, setMoneySpent] = useState(0);

  const [vacationExpenses, setVacationExpenses] = useState({
    vacation_budget: {
      total_budget: null,
      money_spent: null,
      expenses: {
        flight: null,
        accommodation: null,
        activities: null,
        food: null,
        transportation: null,
        souvenirs: null,
      },
    },
  });

  const [expensesDescription, setExpensesDescription] = useState({
    vacation_budget: {
      total_budget: null,
      expenses: {
        flight: null,
        accommodation: null,
        activities: null,
        food: null,
        transportation: null,
        souvenirs: null,
      },
    },
  });

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff8c7",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    margin: 5,
    height: "210px",
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));

  const calculateMoneySpent = () => {
    const spent = Object.values(vacationExpenses.vacation_budget.expenses)
      .filter((value) => value !== null)
      .reduce((sum, value) => sum + value, 0);

    console.log("Calculated Money Spent: ", spent); // Log immediately after calculation
    setMoneySpent(spent);
  };

  const calculateProgress = () => {
    if (
      vacationExpenses.vacation_budget.total_budget === null ||
      moneySpent === 0
    ) {
      setProgress(0);
    } else {
      let percent =
        (moneySpent / vacationExpenses.vacation_budget.total_budget) * 100;
      if (percent < 50) {
        setProgressColor("#21d150");
      } else if (percent < 75) {
        setProgressColor("#dde324");
      } else {
        setProgressColor("#d40f0f");
      }
      setProgress(Math.trunc(percent));
    }
  };

  const updateDescription = async () => {
    const response = await fetch("api/description", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        conversation: [...messages, { role: "user", content: message }],
        expenseJson: vacationExpenses,
      }),
    });

    if (response.ok) {
      const responseText = await response.text();
      //console.log("Description: ", responseText)
      setExpensesDescription(JSON.parse(responseText));
    }
  };

  // useEffect (() => {
  //   console.log("Desciption JSON: ", expensesDescription)
  // }, [expensesDescription])

  const updateExpenses = async () => {
    const response = await fetch("/api/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify([...messages, { role: "user", content: message }]),
    });

    if (response.ok) {
      const responseText = await response.text();
      //console.log("Response: ", responseText)
      setVacationExpenses(JSON.parse(responseText));
    }
  };

  useEffect(() => {
    console.log("Results: ", vacationExpenses);
    // console.log("Predicted Progress: ", ((vacationExpenses.vacation_budget.money_spent) / (vacationExpenses.vacation_budget.total_budget) * 100))
    calculateMoneySpent();
  }, [vacationExpenses]);

  useEffect(() => {
    calculateProgress();
  }, [moneySpent]);

  const sendMessage = async () => {
    setMessage("");
    setMessages((messages) => [
      ...messages,
      { role: "user", content: message },
      { role: "assistant", content: "" },
    ]);
    const response = fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([...messages, { role: "user", content: message }]),
    }).then(async (res) => {
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let result = "";
      return reader.read().then(function processText({ done, value }) {
        if (done) {
          return result;
        }
        const text = decoder.decode(value || new Uint8Array(), {
          stream: true,
        });
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1];
          let otherMessages = messages.slice(0, messages.length - 1);

          return [
            ...otherMessages,
            { ...lastMessage, content: lastMessage.content + text },
          ];
        });
        return reader.read().then(processText);
      });
    });
  };

  const [message, setMessage] = useState("");

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection={"column"}
      overflow="hidden"
    >
      <AppBar position="static" top sx={{ marginBottom: 1 }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            href="/sign-up"
          >
            <GiAirplaneDeparture />
          </IconButton>
          <Typography variant="h4">DreamTrip AI</Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Button color="inherit" onClick={() => signOut(auth)}>
            Log Out
          </Button>
        </Toolbar>
      </AppBar>
      <Stack direction="row">
        <Smartphone sx={{ marginLeft: 1, width: "30%" }}>
          <Stack
            direction="column"
            width="100%"
            height="100%"
            p={2}
            spacing={3}
          >
            <Stack
              direction="column"
              spacing={2}
              flexGrow={1}
              overflow={"auto"}
              maxHeight={"100%"}
            >
              {messages.map((message, index) => (
                <Box
                  key={index}
                  display="flex"
                  justifyContent={
                    message.role === "assistant" ? "flex-start" : "flex-end"
                  }
                >
                  <Box
                    bgcolor={
                      message.role === "assistant"
                        ? "primary.main"
                        : "secondary.main"
                    }
                    color="white"
                    borderRadius={16}
                    p={3}
                  >
                    {message.content}
                  </Box>
                </Box>
              ))}
            </Stack>
            <Stack direction="row" spacing={2}>
              <TextField
                label="Message"
                fullWidth
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                }}
              />
              <Button
                variant="contained"
                onClick={() => {
                  sendMessage();
                  updateExpenses();
                  updateDescription();
                }}
              >
                Send
              </Button>
            </Stack>
          </Stack>
        </Smartphone>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            width: "70%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Card sx={{ height: "100%" }} width="90%">
            <Stack
              sx={{
                height: "75px",
                marginTop: 2,
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              Budget: ${vacationExpenses.vacation_budget?.total_budget || "N/A"} <br/>
              Remaining Funds: ${(vacationExpenses.vacation_budget.total_budget - moneySpent) || "N/A"}
              <ProgressBar
                bgcolor={progressColor}
                completed={progress}
                fullWidth
              />
            </Stack>
            <Box width="100%" height="100%" display="flex" flexDirection="row">
              <Box width="100%" height="100%">
                <Grid container spacing={2} rowSpacing={5}>
                  <Grid xs={4}>
                    <Item>
                      Travel: $
                      {vacationExpenses.vacation_budget.expenses?.flight ||
                        "N/A"}{" "}
                      <br />{" "}
                      {expensesDescription.vacation_budget.expenses?.flight ||
                        "No Description Available"}
                    </Item>
                  </Grid>
                  <Grid xs={4}>
                    <Item>
                      Accommodations: $
                      {vacationExpenses.vacation_budget.expenses
                        ?.accommodation || "N/A"}{" "}
                      <br />{" "}
                      {expensesDescription.vacation_budget.expenses
                        ?.accommodation || "No Description Available"}
                    </Item>
                  </Grid>
                  <Grid xs={4}>
                    <Item>
                      Activities: $
                      {vacationExpenses.vacation_budget.expenses?.activities ||
                        "N/A"}{" "}
                      <br />{" "}
                      {expensesDescription.vacation_budget.expenses
                        ?.activities || "No Description Available"}
                    </Item>
                  </Grid>

                  <Grid xs={4}>
                    <Item>
                      Food: $
                      {vacationExpenses.vacation_budget.expenses?.food || "N/A"}{" "}
                      <br />{" "}
                      {expensesDescription.vacation_budget.expenses?.food ||
                        "No Description Available"}
                    </Item>
                  </Grid>
                  <Grid xs={4}>
                    <Item>
                      Transportation: $
                      {vacationExpenses.vacation_budget.expenses
                        ?.transportation || "N/A"}{" "}
                      <br />{" "}
                      {expensesDescription.vacation_budget.expenses
                        ?.transportation || "No Description Available"}
                    </Item>
                  </Grid>
                  <Grid xs={4}>
                    <Item>
                      Souvenirs: $
                      {vacationExpenses.vacation_budget.expenses?.souvenirs ||
                        "N/A"}{" "}
                      <br />{" "}
                      {expensesDescription.vacation_budget.expenses
                        ?.souvenirs || "No Description Available"}
                    </Item>
                  </Grid>
                </Grid>
              </Box>
              {/* <Box border="1.5px solid orange" width="30%" display="flex" flexDirection="column" justifyContent="center">
                <Item style={{height: "100%"}}>
                  Extra Funds
                </Item>
              </Box> */}
            </Box>
          </Card>
        </Box>
      </Stack>
    </Box>
  );
}
