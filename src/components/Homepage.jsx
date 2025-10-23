/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  Button,
  Avatar,
  Tabs,
  Tab,
  TextField,
  MenuItem,
  Typography,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Box,
  Tooltip,
} from "@mui/material";
import {
  Search,
  Logout,
  ExpandMore,
  Add,
  Close,
  FormatBold,
  FormatItalic,
  FormatListBulleted,
  FormatUnderlined,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation } from "react-router-dom";

function Homepage() {
  const [activeTab, setActiveTab] = useState(0);
  const [open, setOpen] = useState(false);
  const [taskCategory, setTaskCategory] = useState("");
  const [description, setDescription] = useState("");
  const location = useLocation();
  const user = location.state?.user;
  const [format, setFormat] = useState({
    bold: false,
    italic: false,
    underline: false,
  });
  const navigate = useNavigate();
  const [taskTitle, setTaskTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [taskStatus, setTaskStatus] = useState("");
  const [tasks, setTasks] = useState([]);
  const [expanded, setExpanded] = useState({
    todo: true,
    inprogress: true,
    completed: true,
  });
  const [currentTask, setCurrentTask] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null); // Add this line
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  console.log("Location state:", location.state);

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded({ ...expanded, [panel]: isExpanded });
  };

  if (user && user.name) {
    console.log("User's name:", user.name);
  } else {
    console.log("User not found or name is missing.");
  }

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/tasks/get`);
        if (response.ok) {
          const data = await response.json();
          setTasks(data);
        } else {
          toast.error("Failed to fetch tasks.");
        }
      } catch (error) {
        console.error("Error fetching tasks: ", error);
        toast.error("An error occurred while fetching tasks.");
      }
    };

    fetchTasks();
  }, []);

  const handleCreateTask = async () => {
    const taskData = {
      title: taskTitle,
      description: description,
      category: taskCategory,
      dueOn: dueDate,
      status: taskStatus,
    };

    const token = localStorage.getItem("authToken"); // Retrieve the token

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/tasks/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Use the token
        },
        body: JSON.stringify(taskData),
      });

      if (response.ok) {
        toast.success("Task created successfully!");
        handleClose();
        setTaskTitle("");
        setDescription("");
        setTaskCategory("");
        setDueDate("");
        setTaskStatus("");
        // Refresh tasks after creation
        const updatedTasks = await fetch(`${process.env.REACT_APP_API_URL}/api/tasks/get`);
        if (updatedTasks.ok) {
          const data = await updatedTasks.json();
          setTasks(data);
        }
      } else {
        toast.error("Failed to create task.");
      }
    } catch (error) {
      console.error("Error creating task: ", error);
      toast.error("An error occurred while creating the task.");
    }
  };

  const handleEditTask = (task) => {
    setCurrentTask(task);
    setTaskTitle(task.title);
    setDescription(task.description);
    setTaskCategory(task.category);
    setDueDate(task.dueOn);
    setTaskStatus(task.status);
    setOpen(true);
  };

  const handleSaveTask = async () => {
    if (currentTask) {
      // Update existing task
      const taskData = {
        title: taskTitle,
        description: description,
        category: taskCategory,
        dueOn: dueDate,
        status: taskStatus,
      };

      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/tasks/update/${currentTask._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(taskData),
          }
        );

        if (response.ok) {
          toast.success("Task updated successfully!");
          handleClose();
          setCurrentTask(null);
          // Refresh tasks after update
          const updatedTasks = await fetch(
            `${process.env.REACT_APP_API_URL}/api/tasks/get`
          );
          if (updatedTasks.ok) {
            const data = await updatedTasks.json();
            setTasks(data);
          }
        } else {
          toast.error("Failed to update task.");
        }
      } catch (error) {
        console.error("Error updating task: ", error);
        toast.error("An error occurred while updating the task.");
      }
    } else {
      // Create new task
      handleCreateTask();
    }
  };

  const handleDeleteTask = async () => {
    if (taskToDelete) {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/tasks/delete/${taskToDelete._id}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          toast.success("Task deleted successfully!");
          setDeleteDialogOpen(false);
          setTaskToDelete(null);
          // Refresh tasks after deletion
          const updatedTasks = await fetch(
            `${process.env.REACT_APP_API_URL}/api/tasks/get`
          );
          if (updatedTasks.ok) {
            const data = await updatedTasks.json();
            setTasks(data);
          }
        } else {
          toast.error("Failed to delete task.");
        }
      } catch (error) {
        console.error("Error deleting task: ", error);
        toast.error("An error occurred while deleting the task.");
      }
    }
  };

  const handleFormatChange = (type) => {
    setFormat((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const handleAvatarClick = () => {
    navigate("/profile", { state: { user } });
  };

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        console.log("User signed out");
        localStorage.clear();
        toast.success("User signed out successfully!");
        navigate("/");
      })
      .catch((error) => {
        console.error("Error signing out: ", error);
      });
  };

  const getFormattedText = () => {
    let style = {};
    if (format.bold) style.fontWeight = "bold";
    if (format.italic) style.fontStyle = "italic";
    if (format.underline) style.textDecoration = "underline";
    return style;
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCategoryChange = (event) => {
    setTaskCategory(event.target.value);
  };

  const renderTasks = (status) => {
    return tasks
      .filter((task) => task.status === status)
      .filter((task) =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .filter((task) => !categoryFilter || task.category === categoryFilter) // Add this line
      .filter(
        (task) =>
          !selectedDate ||
          new Date(task.dueOn).toDateString() ===
            new Date(selectedDate).toDateString()
      )
      .map((task) => (
        <div
          key={task._id}
          className="flex justify-between items-center border-b pb-2 mb-4"
        >
          <div className="flex items-center flex-1">
            <Typography
              style={{
                fontFamily: "Mulish",
                fontWeight: 600,
                fontSize: "15px",
                color: "#000000",
              }}
            >
              {task.title}
            </Typography>
          </div>
          <Typography
            style={{
              fontFamily: "Mulish",
              fontWeight: 600,
              fontSize: "15px",
              color: "#000000",
              flex: 1,
              textAlign: "center",
            }}
          >
            {new Date(task.dueOn).toLocaleDateString("en-US", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </Typography>
          <Typography
            style={{
              fontFamily: "Mulish",
              fontWeight: 600,
              fontSize: "15px",
              color: "#000000",
              flex: 1,
              textAlign: "center",
            }}
          >
            {task.status.toUpperCase()}
          </Typography>
          <Typography
            style={{
              fontFamily: "Mulish",
              fontWeight: 600,
              fontSize: "15px",
              color: "#000000",
              flex: 1,
              textAlign: "center",
            }}
          >
            {task.category}
          </Typography>
          <div className="flex space-x-2">
            <IconButton onClick={() => handleEditTask(task)}>
              <Tooltip title="Edit" arrow="Top">
                <EditIcon />
              </Tooltip>
            </IconButton>
            <Tooltip title="Delete" arrow="Top">
              <IconButton
                onClick={() => {
                  setTaskToDelete(task);
                  setDeleteDialogOpen(true);
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </div>
        </div>
      ));
  };

  const renderBoardColumn = (status, color) => {
    return (
      <div className="flex-1 bg-gray-100 p-4 rounded-lg">
        <Typography
          style={{
            fontFamily: "Mulish",
            fontWeight: 600,
            fontSize: "14px",
            color: "#000000",
            marginBottom: "8px",
            backgroundColor: color,
            padding: "4px 8px",
            borderRadius: "8px",
            display: "inline-block",
          }}
        >
          {status.toUpperCase()}
        </Typography>
        {tasks
          .filter((task) => task.status === status)
          .filter((task) =>
            task.title.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .filter((task) => !categoryFilter || task.category === categoryFilter) // Add this line
          .map((task) => (
            <div
              key={task._id}
              className="bg-white p-4 mb-4 rounded-lg shadow-sm"
            >
              <Typography
                style={{
                  fontFamily: "Mulish",
                  fontWeight: 600,
                  fontSize: "16px",
                  color: "#000000",
                  marginBottom: "4px",
                }}
              >
                {task.title}
              </Typography>
              <div className="flex justify-between">
                <Typography
                  style={{
                    fontFamily: "Mulish",
                    fontWeight: 400,
                    fontSize: "14px",
                    color: "#00000099",
                  }}
                >
                  {task.category}
                </Typography>
                <Typography
                  style={{
                    fontFamily: "Mulish",
                    fontWeight: 400,
                    fontSize: "14px",
                    color: "#00000099",
                  }}
                >
                  {new Date(task.dueOn).toLocaleDateString("en-US", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </Typography>
              </div>
            </div>
          ))}
      </div>
    );
  };

  return (
    <div className="p-4 font-mulish ">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <header className="flex justify-between items-center mb-4">
        <div className="flex items-center mt-2">
          <img src="/Vector.svg" alt="Vector" />
          <Typography
            style={{
              fontFamily: "Mulish",
              fontWeight: 600,
              fontSize: "24px",
              color: "#2F2F2F",
              marginLeft: "8px",
            }}
          >
            TaskBuddy
          </Typography>
        </div>
        <div className="flex flex-col items-center">
          <div className="flex items-center mb-2">
            <Avatar
              alt="User"
              src={user?.avatarUrl || ""}
              className="mr-2"
              onClick={handleAvatarClick} // Add this line
              style={{ cursor: "pointer" }}
            >
              {!user?.avatarUrl && user?.name?.charAt(0)}
            </Avatar>
            {user && (
              <Typography
                style={{
                  fontFamily: "Mulish",
                  fontWeight: 600,
                  fontSize: "16px",
                  color: "#0000099",
                }}
              >
                {user.name}
              </Typography>
            )}
          </div>
          <Button
            onClick={handleLogout}
            startIcon={<Logout />}
            style={{
              background: "#FFF5F5",
              color: "black",
              borderRadius: "12px",
              border: "1px solid #7B198426",
              padding: "8px 16px",
              fontFamily: "Mulish",
              fontWeight: 600,
              fontSize: "14px",
              marginTop: "2px", // Added margin for spacing
              marginLeft: "20px",
            }}
          >
            Logout
          </Button>
        </div>
      </header>

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-4">
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="task view tabs"
            className="mb-2"
            TabIndicatorProps={{
              style: {
                backgroundColor: "black",
              },
            }}
          >
            <Tab
              icon={<img src="/List.png" alt="List" />}
              iconPosition="start"
              label="List"
              style={{
                color: activeTab === 0 ? "black" : "#A9A9A9",
              }}
            />
            <Tab
              icon={<img src="/Board.png" alt="Board" />}
              iconPosition="start"
              label="Board"
              style={{
                color: activeTab === 1 ? "black" : "#A9A9A9",
              }}
            />
          </Tabs>
        </div>
        <div className="flex items-center space-x-2">
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search"
            InputProps={{
              startAdornment: <Search />,
              style: {
                borderRadius: "60px",
                padding: "2px 14px",
                color: "#0000006B",
              },
            }}
            style={{
              borderRadius: "60px",
              width: "204px",
              height: "34px",
            }}
            value={searchQuery} // Add this line
            onChange={(e) => setSearchQuery(e.target.value)} // Add this line
          />
          <Button
            onClick={handleClickOpen}
            style={{
              background: "#7B1984",
              color: "#FFFFFF",
              width: "140px",
              height: "48px",
              borderRadius: "41px",
              fontFamily: "Mulish",
              fontSize: "14px",
              fontWeight: 700,
            }}
          >
            Add Task
          </Button>
        </div>
      </div>

      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          style: {
            borderRadius: "14px",
            fontFamily: "Mulish",
          },
        }}
      >
        <DialogTitle
          style={{
            fontFamily: "Mulish",
            fontWeight: 700,
            fontSize: "24px",
          }}
        >
          {currentTask ? "Edit Task" : "Create Task"}
          <IconButton
            aria-label="close"
            onClick={handleClose}
            style={{ position: "absolute", right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Task Title"
            fullWidth
            margin="dense"
            variant="outlined"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 4,
              },
            }}
          />
          <Box sx={{ position: "relative" }}>
            <TextField
              label="Description"
              fullWidth
              margin="dense"
              multiline
              rows={4}
              variant="outlined"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 4,
                  paddingBottom: "40px",
                },
                "& .MuiInputBase-input": {
                  ...getFormattedText(),
                },
              }}
            />
            <Box
              sx={{
                position: "absolute",
                bottom: 8,
                left: 8,
                display: "flex",
                gap: 1,
              }}
            >
              <Button
                variant="text"
                size="small"
                onClick={() => handleFormatChange("bold")}
              >
                <FormatBold />
              </Button>
              <Button
                variant="text"
                size="small"
                onClick={() => handleFormatChange("italic")}
              >
                <FormatItalic />
              </Button>
              <Button
                variant="text"
                size="small"
                onClick={() => handleFormatChange("underline")}
              >
                <FormatUnderlined />
              </Button>
              <Button variant="text" size="small">
                <FormatListBulleted />
              </Button>
            </Box>
          </Box>

          <TextField
            select
            label="Task Category"
            fullWidth
            margin="dense"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 4,
              },
            }}
            value={taskCategory}
            onChange={handleCategoryChange}
          >
            <MenuItem value="work">Work</MenuItem>
            <MenuItem value="personal">Personal</MenuItem>
          </TextField>
          <TextField
            label="Due on"
            type="date"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 4,
              },
            }}
            fullWidth
            margin="dense"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            select
            label="Task Status"
            fullWidth
            margin="dense"
            value={taskStatus}
            onChange={(e) => setTaskStatus(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 4,
              },
            }}
          >
            <MenuItem value="todo">To-Do</MenuItem>
            <MenuItem value="inprogress">In-Progress</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
          </TextField>
          <Typography variant="body2" style={{ marginTop: "16px" }}>
            Attachment
          </Typography>
          <div
            style={{
              border: "1px dashed #ccc",
              padding: "16px",
              textAlign: "center",
              marginTop: "8px",
            }}
          >
            Drop your files here or
          </div>
        </DialogContent>
        <DialogActions
          sx={{
            backgroundColor: "#F1F1F1",
            padding: "10px",
          }}
        >
          <Button
            onClick={handleClose}
            style={{
              borderRadius: "41px",
              background: "white",
              color: "black",
              width: "105px",
              height: "40px",
              fontWeight: 600,
              fontFamily: "Mulish",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveTask}
            style={{
              background: "#7B1984",
              color: "#FFFFFF",
              borderRadius: "41px",
              width: "119px",
              height: "40px",
              fontFamily: "Mulish",
            }}
          >
            {currentTask ? "Save" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          style: {
            borderRadius: "14px",
            fontFamily: "Mulish",
          },
        }}
      >
        <DialogTitle
          style={{
            fontFamily: "Mulish",
            fontWeight: 700,
            fontSize: "20px",
          }}
        >
          Confirm Deletion
        </DialogTitle>
        <DialogContent>
          <Typography
            style={{
              fontFamily: "Mulish",
              fontWeight: 700,
              fontSize: "18px",
            }}
          >
            Are you sure you want to delete this task?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            style={{
              borderRadius: "41px",
              background: "white",
              color: "black",
              width: "105px",
              height: "40px",
              fontWeight: 600,
              fontFamily: "Mulish",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteTask}
            style={{
              background: "#FF5C5C",
              color: "#FFFFFF",
              borderRadius: "41px",
              width: "119px",
              height: "40px",
              fontFamily: "Mulish",
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <div className="flex items-center space-x-4 mb-4">
        <Typography
          className="mr-2"
          style={{
            fontFamily: "Mulish",
            fontWeight: 600,
            fontSize: "16px",
            color: "#00000099",
          }}
        >
          Filter by:
        </Typography>
        <TextField
          select
          variant="outlined"
          size="small"
          className="w-32"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          InputProps={{
            style: {
              borderRadius: "18px",
            },
          }}
          displayEmpty
          renderValue={(selected) => {
            if (!selected) {
              return <em style={{ color: "#aaa" }}>Category</em>; // Placeholder text
            }
            return selected.charAt(0).toUpperCase() + selected.slice(1);
          }}
        >
          <MenuItem value="work">Work</MenuItem>
          <MenuItem value="personal">Personal</MenuItem>
        </TextField>
        <TextField
          type="date"
          variant="outlined"
          size="small"
          className="w-32"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          InputProps={{
            style: {
              borderRadius: "18px",
            },
          }}
        ></TextField>
      </div>

      {activeTab === 0 ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b pb-2 mb-4">
            <Typography
              style={{
                fontFamily: "Mulish",
                fontWeight: 600,
                fontSize: "14px",
                color: "#00000099",
              }}
            >
              Task name
            </Typography>
            <Typography
              style={{
                fontFamily: "Mulish",
                fontWeight: 600,
                fontSize: "14px",
                color: "#00000099",
              }}
            >
              Due on
            </Typography>
            <Typography
              style={{
                fontFamily: "Mulish",
                fontWeight: 600,
                fontSize: "14px",
                color: "#00000099",
              }}
            >
              Task Status
            </Typography>
            <Typography
              style={{
                fontFamily: "Mulish",
                fontWeight: 600,
                fontSize: "14px",
                color: "#00000099",
                marginRight: "10%",
              }}
            >
              Task Category
            </Typography>
          </div>
          <Accordion
            expanded={expanded.todo}
            onChange={handleAccordionChange("todo")}
            style={{ borderRadius: "8px", boxShadow: "none" }}
          >
            <AccordionSummary
              expandIcon={<ExpandMore />}
              style={{
                backgroundColor: "#FAC3FF",
                borderRadius: "8px",
              }}
            >
              <Typography
                className="text-lg font-semibold"
                style={{
                  fontFamily: "Mulish",
                  fontWeight: 600,
                  fontSize: "16px",
                }}
              >
                Todo
              </Typography>
            </AccordionSummary>
            <AccordionDetails style={{ backgroundColor: "#F5F5F5" }}>
              <Button
                onClick={handleClickOpen}
                startIcon={<Add />}
                style={{
                  color: "#7B1984",
                  textTransform: "none",
                  marginBottom: "8px",
                  marginRight: "80%",
                }}
              >
                Add Task
              </Button>
              {renderTasks("todo")}
            </AccordionDetails>
          </Accordion>

          <Accordion
            expanded={expanded.inprogress}
            onChange={handleAccordionChange("inprogress")}
            style={{ borderRadius: "8px" }}
          >
            <AccordionSummary
              expandIcon={<ExpandMore />}
              style={{ backgroundColor: "#D7E8FF", borderRadius: "8px" }}
            >
              <Typography
                className="text-lg font-semibold"
                style={{
                  fontFamily: "Mulish",
                  fontWeight: 600,
                  fontSize: "16px",
                }}
              >
                In-Progress
              </Typography>
            </AccordionSummary>
            <AccordionDetails style={{ backgroundColor: "#F5F5F5" }}>
              <Button
                startIcon={<Add />}
                onClick={handleClickOpen}
                style={{
                  color: "#7B1984",
                  textTransform: "none",
                  marginBottom: "8px",
                  marginRight: "80%",
                }}
              >
                Add Task
              </Button>
              {renderTasks("inprogress")}
            </AccordionDetails>
          </Accordion>

          <Accordion
            expanded={expanded.completed}
            onChange={handleAccordionChange("completed")}
          >
            <AccordionSummary
              expandIcon={<ExpandMore />}
              style={{ backgroundColor: "#D7FFD7", borderRadius: "8px" }}
            >
              <Typography
                className="text-lg font-semibold"
                style={{
                  fontFamily: "Mulish",
                  fontWeight: 700,
                  fontSize: "16px",
                }}
              >
                Completed
              </Typography>
            </AccordionSummary>
            <AccordionDetails style={{ backgroundColor: "#F5F5F5" }}>
              <Button
                startIcon={<Add />}
                onClick={handleClickOpen}
                style={{
                  color: "#7B1984",
                  textTransform: "none",
                  marginBottom: "8px",
                  marginRight: "80%",
                }}
              >
                Add Task
              </Button>
              {renderTasks("completed")}
            </AccordionDetails>
          </Accordion>
        </div>
      ) : (
        <div className="flex space-x-4">
          {renderBoardColumn("todo", "#FAC3FF")}
          {renderBoardColumn("inprogress", "#85D9F1")}
          {renderBoardColumn("completed", "#A2D6A0")}
        </div>
      )}
    </div>
  );
}

export default Homepage;
