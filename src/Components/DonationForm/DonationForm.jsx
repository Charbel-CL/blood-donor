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
} from "@mui/material";
import "./DonationForm.css";
import { useNavigate } from "react-router-dom";

const questions = [
  { id: 1, question: "Are you between 18 and 65 years old?" },
  { id: 2, question: "Do you weigh at least 50 kg?" },
  { id: 3, question: "Are you in good health?" },
  { id: 4, question: "Have you traveled outside the country recently?" },
  { id: 5, question: "Do you have a chronic illness?" },
  { id: 6, question: "Have you had any recent surgeries?" },
  { id: 7, question: "Are you taking any medication?" },
  { id: 8, question: "Have you ever tested positive for HIV?" },
  { id: 9, question: "Have you received any blood transfusions?" },
  { id: 10, question: "Do you have any symptoms of cold or flu?" },
];

const DonationForm = () => {
  const [currentStep, setCurrentStep] = useState(() => {
    return parseInt(localStorage.getItem("currentStep")) || 0;
  });
  const [answers, setAnswers] = useState(() => {
    return JSON.parse(localStorage.getItem("answers")) || {};
  });
  const [eligibilityMessage, setEligibilityMessage] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("currentStep", currentStep);
    localStorage.setItem("answers", JSON.stringify(answers));
  }, [currentStep, answers]);

  useEffect(() => {
    if (answers[questions[currentStep].id]) {
      checkEligibilityForCurrentStep(
        questions[currentStep].id,
        answers[questions[currentStep].id]
      );
    }
  }, [currentStep]);

  const handleChange = (event, id) => {
    const newAnswers = {
      ...answers,
      [id]: event.target.value,
    };
    setAnswers(newAnswers);

    // Check eligibility immediately after answer change
    checkEligibilityForCurrentStep(id, event.target.value);
  };

  const handleNext = () => {
    if (!eligibilityMessage && answers[questions[currentStep].id]) {
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

  const handleSubmit = () => {
    // Clear local storage
    localStorage.removeItem("currentStep");
    localStorage.removeItem("answers");

    // Open the confirmation dialog
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    navigate("/timeslots");
  };


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
        <div className="question-slide">
          <h2 className="question-slide-title">Page {currentStep + 1}</h2>
          <p className="quiz-question">{questions[currentStep].question}</p>
          <RadioGroup
            row
            className="quiz-options"
            onChange={(event) => handleChange(event, questions[currentStep].id)}
            value={answers[questions[currentStep].id] || ""}
          >
            <FormControlLabel value="yes" control={<Radio />} label="Yes" />
            <FormControlLabel value="no" control={<Radio />} label="No" />
          </RadioGroup>
        </div>
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
            disabled={!answers[questions[currentStep].id] || eligibilityMessage}
          >
            {currentStep === questions.length - 1 ? "Submit" : "Next"}
          </Button>
        </div>
      </div>

      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Form Submission</DialogTitle>
        <DialogContent>
          <p>Your form has been submitted successfully!</p>
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
