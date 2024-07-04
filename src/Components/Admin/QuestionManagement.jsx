
import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

const QuestionManagement = () => {
  const [questions, setQuestions] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [formValues, setFormValues] = useState({ question: '', answer: '' });
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    // Simulate fetching questions from an API
    setQuestions([
      { question: 'What is your age?', answer: '' },
      { question: 'Do you have any chronic diseases?', answer: '' },
    ]);
  }, []);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormValues({ question: '', answer: '' });
    setEditIndex(null);
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddEditQuestion = () => {
    if (editIndex !== null) {
      const updatedQuestions = [...questions];
      updatedQuestions[editIndex] = formValues;
      setQuestions(updatedQuestions);
    } else {
      setQuestions([...questions, formValues]);
    }
    handleCloseDialog();
  };

  const handleEditQuestion = (index) => {
    setFormValues(questions[index]);
    setEditIndex(index);
    handleOpenDialog();
  };

  const handleDeleteQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  return (
    <Container>
      <Typography variant="h5" component="h2" gutterBottom>
        Manage Questions
      </Typography>
      <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleOpenDialog}>
        Add Question
      </Button>
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
              <TableCell>{question.question}</TableCell>
              <TableCell>{question.answer}</TableCell>
              <TableCell>
                <IconButton color="primary" onClick={() => handleEditQuestion(index)}>
                  <EditIcon />
                </IconButton>
                <IconButton color="secondary" onClick={() => handleDeleteQuestion(index)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editIndex !== null ? 'Edit Question' : 'Add Question'}</DialogTitle>
        <DialogContent sx={{ minHeight: '300px' }}>
          <TextField
            margin="dense"
            label="Question"
            name="question"
            value={formValues.question}
            onChange={handleFormChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Answer"
            name="answer"
            value={formValues.answer}
            onChange={handleFormChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleAddEditQuestion} color="primary">
            {editIndex !== null ? 'Save' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default QuestionManagement;
