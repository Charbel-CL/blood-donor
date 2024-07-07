import React, { useState, useEffect } from "react";
import {
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  LinearProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Box,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./DonationForm.css";

const DonationForm = () => {
  const [currentStep, setCurrentStep] = useState(() => {
    return parseInt(localStorage.getItem("currentStep")) || 0;
  });
  const [questions, setQuestions] = useState([]);
  const [bloodRequests, setBloodRequests] = useState([]);
  const [answers, setAnswers] = useState(() => {
    return JSON.parse(localStorage.getItem("answers")) || {};
  });
  const [eligibilityMessage, setEligibilityMessage] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestionsAndRequests = async () => {
      try {
        const questionsResponse = await axios.get("http://localhost:5212/api/Questions");
        setQuestions(questionsResponse.data);

        const bloodRequestsResponse = await axios.get("http://localhost:5212/api/BloodRequests");
        setBloodRequests(bloodRequestsResponse.data);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchQuestionsAndRequests();
  }, []);

  useEffect(() => {
    localStorage.setItem("currentStep", currentStep);
    localStorage.setItem("answers", JSON.stringify(answers));
  }, [currentStep, answers]);

  useEffect(() => {
    if (answers[questions[currentStep]?.question_id]) {
      checkEligibilityForCurrentStep(
        questions[currentStep].question_id,
        answers[questions[currentStep].question_id]
      );
    }
  }, [currentStep]);

  const handleChange = (event, id) => {
    const newAnswers = {
      ...answers,
      [id]: event.target.value,
    };
    setAnswers(newAnswers);

    checkEligibilityForCurrentStep(id, event.target.value);
  };

  const handleNext = () => {
    if (!eligibilityMessage && answers[questions[currentStep].question_id]) {
      if (currentStep < questions.length - 1) {
        setCurrentStep(currentStep + 1);
        setEligibilityMessage("");
      } else {
        handleSubmit();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setEligibilityMessage("");
    }
  };

  const checkEligibilityForCurrentStep = (id, answer) => {
    let message = "";

    if (
      (id === 1 && answer === "no") ||
      (id === 2 && answer === "no") ||
      (id === 3 && answer === "no") ||
      (id === 4 && answer === "yes") ||
      (id === 5 && answer === "yes") ||
      (id === 6 && answer === "yes") ||
      (id === 7 && answer === "yes") ||
      (id === 8 && answer === "yes") ||
      (id === 9 && answer === "yes") ||
      (id === 10 && answer === "yes")
    ) {
      message = getEligibilityMessage(id);
    }

    setEligibilityMessage(message);
  };

  const getEligibilityMessage = (id) => {
    switch (id) {
      case 1:
        return "You must be between 18 and 65 years old to donate.";
      case 2:
        return "You must weigh at least 50 kg to donate.";
      case 3:
        return "You must be in good health to donate.";
      case 4:
        return "If you have traveled to certain regions recently, you may be ineligible to donate.";
      case 5:
        return "If you have a chronic illness, you may be ineligible to donate.";
      case 6:
        return "If you have had recent surgeries, you may be ineligible to donate.";
      case 7:
        return "If you are taking certain medications, you may be ineligible to donate.";
      case 8:
        return "If you have ever tested positive for HIV, you are ineligible to donate.";
      case 9:
        return "If you have received a blood transfusion, you may be ineligible to donate.";
      case 10:
        return "If you have symptoms of cold or flu, you are ineligible to donate.";
      default:
        return "";
    }
  };

  const handleSubmit = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      setDialogMessage("You need to be logged in to submit the form.");
      setOpenDialog(true);
      return;
    }

    const selectedRequest = bloodRequests.find(req => req.blood_type === user.bloodType && req.status === 'Pending');
    if (!selectedRequest) {
      setDialogMessage("No matching blood request found.");
      setOpenDialog(true);
      return;
    }

    const submissionData = questions.map((question) => ({
      question_id: question.question_id,
      user_id: user.user_id,
      request_id: selectedRequest.request_id,
      question_text: question.question_text,
      response: answers[question.question_id],
      response_date: new Date(),
    }));

    try {
      await axios.post(
        "http://localhost:5212/api/PatientQuestions",
        submissionData
      );
      localStorage.removeItem("currentStep");
      localStorage.removeItem("answers");
      setOpenDialog(true);
    } catch (error) {
      console.error("Error submitting responses:", error);
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    navigate("/timeslots");
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className="container-questions">
      <div className="form-wrapper">
        <h1 className="form-title">Donation Eligibility Form</h1>
        <div className="progress-bar">
          <LinearProgress
            variant="determinate"
            value={(currentStep / questions.length) * 100}
            className="progress-bar-style"
          />
        </div>
        {questions.length > 0 && (
          <div className="question-slide">
            <h2 className="question-slide-title">Page {currentStep + 1}</h2>
            <p className="quiz-question">
              {questions[currentStep]?.question_text}
            </p>
            <RadioGroup
              row
              className="quiz-options"
              onChange={(event) =>
                handleChange(event, questions[currentStep].question_id)
              }
              value={answers[questions[currentStep]?.question_id] || ""}
            >
              <FormControlLabel value="yes" control={<Radio />} label="Yes" />
              <FormControlLabel value="no" control={<Radio />} label="No" />
            </RadioGroup>
          </div>
        )}
        {eligibilityMessage && (
          <p className="eligibility-message">{eligibilityMessage}</p>
        )}
        <div className="navigation-buttons">
          <Button
            variant="contained"
            color="warning"
            disabled={currentStep === 0}
            onClick={handleBack}
          >
            Back
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleNext}
            disabled={
              !answers[questions[currentStep]?.question_id] ||
              eligibilityMessage
            }
          >
            {currentStep === questions.length - 1 ? "Submit" : "Next"}
          </Button>
        </div>
      </div>

      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Form Submission</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Your form has been submitted successfully!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DonationForm;
