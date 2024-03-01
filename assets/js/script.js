// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem('tasks'));
let nextId = JSON.parse(localStorage.getItem('nextId'));
const taskNameInputEl = $('#task-name');
const taskDescInputEl = $('#task-description');
const taskDateInputEl = $('#task-date');
// const addTaskBtn = $('#add-task-button');
// const taskModalForm = $('#task-modal-form');
const taskModalForm = $('#the-form');

// Todo: create a function to generate a unique task id
function generateTaskId() {
	// ? Here we use a tool called `crypto` to generate a random id for our project. This is a unique identifier that we can use to find the project in the array. `crypto` is a built-in module that we can use in the browser and Nodejs.
	return crypto.randomUUID();
}

// Todo: create a function to create a task card
function createTaskCard(task) {}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {}

// Todo: create a function to handle adding a new task
function handleAddTask(event) {
	event.preventDefault();

	let uniqueId = generateTaskId();

	let projectName = taskNameInputEl.val();
	let projectDesc = taskDescInputEl.val();
	let projectDate = taskDateInputEl.val();

	const newProject = {
		id: uniqueId,
		name: projectName,
		type: projectDesc,
		dueDate: projectDate,
		status: 'to-do',
	};

	console.log(newProject);
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
	// ? Get the project id from the event
	const taskId = ui.draggable[0].dataset.projectId;

	// ? Get the id of the lane that the card was dropped into
	const newStatus = event.target.id;
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
// taskModalForm.on('submit', handleAddTask);

$(document).ready(function () {
	taskModalForm.on('submit', handleAddTask);
	// $(function () {
	// 	$('#the-submit').on('click', function (e) {
	// 		$('#the-form').submit();
	// 		handleAddTask();
	// 	});
	// });

	$('#task-date').datepicker({
		changeMonth: true,
		changeYear: true,
	});
});
