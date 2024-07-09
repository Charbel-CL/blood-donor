import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Box
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import axios from "axios";

const QuestionManagement = () => {
  const [questions, setQuestions] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [formValues, setFormValues] = useState({
    question_id: "",
    question_text: "",
    question_answer: "",
  });
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get("http://localhost:5212/api/Questions");
      setQuestions(response.data);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormValues({ question_id: "", question_text: "", question_answer: "" });
    setEditIndex(null);
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddEditQuestion = async () => {
    const payload = {
      question_text: formValues.question_text,
      question_answer: formValues.question_answer,
    };

    try {
      if (editIndex !== null) {
        await axios.put(
          `http://localhost:5212/api/Questions/${questions[editIndex].question_id}`,
          payload
        );
      } else {
        await axios.post("http://localhost:5212/api/Questions", payload);
      }
      fetchQuestions();
      handleCloseDialog();
    } catch (error) {
      console.error("Error saving question:", error);
    }
  };

  const handleEditQuestion = (index) => {
    setFormValues(questions[index]);
    setEditIndex(index);
    handleOpenDialog();
  };

  const handleDeleteQuestion = async (index) => {
    try {
      await axios.delete(
        `http://localhost:5212/api/Questions/${questions[index].question_id}`
      );
      setQuestions(questions.filter((_, i) => i !== index));
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };

  return (
    <Container>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
      >
        <Typography variant="h5" component="h2" gutterBottom>
          Manage Questions
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
        >
          Add Question
        </Button>
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Question</TableCell>
            <TableCell>Answer</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {questions.map((question, index) => (
            <TableRow key={index}>
              <TableCell>{question.question_text}</TableCell>
              <TableCell>{question.question_answer}</TableCell>
              <TableCell>
                <IconButton
                  color="primary"
                  onClick={() => handleEditQuestion(index)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  color="secondary"
                  onClick={() => handleDeleteQuestion(index)}
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editIndex !== null ? "Edit Question" : "Add Question"}
        </DialogTitle>
        <DialogContent sx={{ minHeight: "300px" }}>
          <TextField
            margin="dense"
            label="Question"
            name="question_text"
            value={formValues.question_text}
            onChange={handleFormChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Answer"
            name="question_answer"
            value={formValues.question_answer}
            onChange={handleFormChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleAddEditQuestion} color="primary">
            {editIndex !== null ? "Save" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default QuestionManagement;
