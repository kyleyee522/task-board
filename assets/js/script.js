// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem('tasks'));
let nextId = JSON.parse(localStorage.getItem('nextId'));
const taskNameInputEl = $('#task-name');
const taskDescInputEl = $('#task-description');
const taskDateInputEl = $('#task-date');
const taskModalForm = $('#the-form');
const body = $('body');

// Todo: create a function to generate a unique task id
function generateTaskId() {
	// Here we use a tool called `crypto` to generate a random id for our project. This is a unique identifier that we can use to find the project in the array. `crypto` is a built-in module that we can use in the browser and Nodejs.
	return crypto.randomUUID();
}

// Todo: create a function to create a task card
function createTaskCard(task) {
	const taskCard = $('<div>').addClass('card project-card draggable my-3');
	taskCard.attr('data-project-id', task.id);

	// Create a new card header element and add the classes `card-header` and `h4`. Also set the text of the card header to the project name.
	const cardHeader = $('<header>');
	cardHeader.addClass('card-header h4');
	cardHeader.text(task.name);

	// Create a new card body element and add the class `card-body`.
	const cardBody = $('<body>');
	cardBody.add('card-body');

	// Create a new paragraph element and add the class `card-text`. Also set the text of the paragraph to the project type.
	const cardType = $('<p>');
	cardType.addClass('card-text');
	cardType.text(task.description);

	// Create a new paragraph element and add the class `card-text`. Also set the text of the paragraph to the project due date.
	const cardDate = $('<p>');
	cardDate.addClass('card-text');
	cardDate.text(task.date);

	// Create a new button element and add the classes `btn`, `btn-danger`, and `delete`. Also set the text of the button to "Delete" and add a `data-project-id` attribute and set it to the project id.
	const cardDeleteBtn = $('<button>');
	cardDeleteBtn.addClass('btn btn-danger delete btn-delete-project');
	cardDeleteBtn.text('Delete');
	cardDeleteBtn.attr('data-project-id', task.id);

	if (task.dueDate && task.status !== 'done') {
		const now = dayjs();
		const taskDueDate = dayjs(task.dueDate, 'DD/MM/YYYY');

		// ? If the task is due today, make the card yellow. If it is overdue, make it red.
		if (now.isSame(taskDueDate, 'day')) {
			taskCard.addClass('bg-warning text-white');
		} else if (now.isAfter(taskDueDate)) {
			taskCard.addClass('bg-danger text-white');
			cardDeleteBtn.addClass('border-light');
		}
	}

	cardBody.append(cardType, cardDate, cardDeleteBtn);

	taskCard.append(cardHeader, cardBody);

	return taskCard;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
	let tasks = JSON.parse(localStorage.getItem('tasks'));

	console.log(tasks);

	if (tasks === null) {
		tasks = [];
	}
	// ? Empty existing project cards out of the lanes
	const todoList = $('#todo-cards');
	todoList.empty();

	const inProgressList = $('#in-progress-cards');
	inProgressList.empty();

	const doneList = $('#done-cards');
	doneList.empty();

	for (task of tasks) {
		// console.log(task);
		const taskCard = createTaskCard(task);
		if (task.status === 'to-do') {
			todoList.append(taskCard);
		} else if (task.status === 'in-progress') {
			inProgressList.append(taskCard);
		} else {
			doneList.append(taskCard);
		}
	}

	// ? Use JQuery UI to make task cards draggable
	$('.draggable').draggable({
		opacity: 0.7,
		zIndex: 100,
		// ? This is the function that creates the clone of the card that is dragged. This is purely visual and does not affect the data.
		helper: function (e) {
			// ? Check if the target of the drag event is the card itself or a child element. If it is the card itself, clone it, otherwise find the parent card  that is draggable and clone that.
			const original = $(e.target).hasClass('ui-draggable')
				? $(e.target)
				: $(e.target).closest('.ui-draggable');
			// ? Return the clone with the width set to the width of the original card. This is so the clone does not take up the entire width of the lane. This is to also fix a visual bug where the card shrinks as it's dragged to the right.
			return original.clone().css({
				width: original.outerWidth(),
			});
		},
	});
}

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
		description: projectDesc,
		dueDate: projectDate,
		status: 'to-do',
	};

	let tasks = JSON.parse(localStorage.getItem('tasks'));

	if (!tasks) {
		tasks = [];
	}

	tasks.push(newProject);

	localStorage.setItem('tasks', JSON.stringify(tasks));

	renderTaskList();

	// Clear the form inputs
	projectName = taskNameInputEl.val('');
	projectDesc = taskDescInputEl.val('');
	projectDate = taskDateInputEl.val('');
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {
	const taskId = $(event.target).attr('data-project-id');
	const tasks = JSON.parse(localStorage.getItem('tasks'));

	// if (tasks === null) {
	// 	tasks = [];
	// }
	console.log(taskId);
	for (task of tasks) {
		if (taskId === task.id) {
			tasks.splice(task, 1);
		}
	}

	localStorage.setItem('tasks', JSON.stringify(tasks));

	renderTaskList();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
	// ? Read projects from localStorage
	let tasks = JSON.parse(localStorage.getItem('tasks'));

	if (tasks === null) {
		tasks = [];
	}

	// ? Get the project id from the event
	const taskId = ui.draggable[0].dataset.projectId;

	// ? Get the id of the lane that the card was dropped into
	const newStatus = event.target.id;

	for (let task of tasks) {
		// ? Find the project card by the `id` and update the project status.
		if (task.id === taskId) {
			task.status = newStatus;
		}
	}
	// ? Save the updated projects array to localStorage (overwritting the previous one) and render the new project data to the screen.
	localStorage.setItem('tasks', JSON.stringify(tasks));
	renderTaskList();
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker

$(document).ready(function () {
	renderTaskList();

	taskModalForm.on('submit', handleAddTask);

	body.on('click', '.btn-delete-project', handleDeleteTask);

	$('#task-date').datepicker({
		changeMonth: true,
		changeYear: true,
	});

	$('.lane').droppable({
		accept: '.draggable',
		drop: handleDrop,
	});
});
