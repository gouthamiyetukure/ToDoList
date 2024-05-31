const inputBox = document.getElementById('inputBox');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const completedFilter = document.querySelector('.filter[data-filter="completed"]');
const pendingFilter = document.querySelector('.filter[data-filter="pending"]');
const deleteAllBtn = document.querySelector('.delete-all');

let editTodo = null;
let todos = [];

// Function to add todo
const addTodo = () => {
    const inputText = inputBox.value.trim();
    if (inputText.length <= 0) {
        alert("You must write something in your to do");
        return false;
    }

    if (addBtn.value === "Edit") {
        editLocalTodos(editTodo.target.previousElementSibling.innerHTML);
        editTodo.target.previousElementSibling.innerHTML = inputText;
        addBtn.value = "Add";
        inputBox.value = "";
    } else {
        const li = document.createElement("li");
        const p = document.createElement("p");
        p.innerHTML = inputText;
        li.appendChild(p);

        const editBtn = document.createElement("button");
        editBtn.innerText = "Edit";
        editBtn.classList.add("btn", "editBtn");
        li.appendChild(editBtn);

        const deleteBtn = document.createElement("button");
        deleteBtn.innerText = "Delete";
        deleteBtn.classList.add("btn", "deleteBtn");
        li.appendChild(deleteBtn);

        todoList.appendChild(li);
        inputBox.value = "";

        saveLocalTodos(inputText);
    }
}

// Function to update : (Edit/Delete) todo
const updateTodo = (e) => {
    if (e.target.innerHTML === "Delete") {
        todoList.removeChild(e.target.parentElement);
        deleteLocalTodos(e.target.parentElement);
    }

    if (e.target.innerHTML === "Edit") {
        inputBox.value = e.target.previousElementSibling.innerHTML;
        inputBox.focus();
        addBtn.value = "Edit";
        editTodo = e;
    }
}

// Function to save local todo
const saveLocalTodos = (todo) => {
    todos.push({ text: todo, completed: false });
    updateFilters();
    localStorage.setItem("todos", JSON.stringify(todos));
}

// Function to get local todo
const getLocalTodos = () => {
    if (localStorage.getItem("todos")) {
        todos = JSON.parse(localStorage.getItem("todos"));
        renderTodos();
        updateFilters();
    }
}

// Function to render todos based on filters
const renderTodos = () => {
    todoList.innerHTML = "";
    todos.forEach(todo => {
        if (todo.completed && completedFilter.classList.contains("active")) {
            createTodoElement(todo);
        } else if (!todo.completed && pendingFilter.classList.contains("active")) {
            createTodoElement(todo);
        }
    });
}

// Function to create todo element
const createTodoElement = (todo) => {
    const li = document.createElement("li");
    const p = document.createElement("p");
    p.innerHTML = todo.text;
    li.appendChild(p);

    const editBtn = document.createElement("button");
    editBtn.innerText = "Edit";
    editBtn.classList.add("btn", "editBtn");
    li.appendChild(editBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.innerText = "Delete";
    deleteBtn.classList.add("btn", "deleteBtn");
    li.appendChild(deleteBtn);

    todoList.appendChild(li);
}

// Function to delete local todo
const deleteLocalTodos = (todoElement) => {
    const todoText = todoElement.children[0].innerHTML;
    todos = todos.filter(todo => todo.text !== todoText);
    localStorage.setItem("todos", JSON.stringify(todos));
    updateFilters();
}

// Function to edit local todo
const editLocalTodos = (oldText) => {
    const newText = inputBox.value.trim();
    todos.forEach(todo => {
        if (todo.text === oldText) {
            todo.text = newText;
        }
    });
    localStorage.setItem("todos", JSON.stringify(todos));
    updateFilters();
}

// Function to update filter buttons
const updateFilters = () => {
    const completedCount = todos.filter(todo => todo.completed).length;
    const pendingCount = todos.filter(todo => !todo.completed).length;
    completedFilter.innerText = `Complete (${completedCount})`;
    pendingFilter.innerText = `Incomplete (${pendingCount})`;
}

document.addEventListener('DOMContentLoaded', getLocalTodos);
addBtn.addEventListener('click', addTodo);
todoList.addEventListener('click', updateTodo);
completedFilter.addEventListener('click', () => {
    completedFilter.classList.add("active");
    pendingFilter.classList.remove("active");
    renderTodos();
});
pendingFilter.addEventListener('click', () => {
    completedFilter.classList.remove("active");
    pendingFilter.classList.add("active");
    renderTodos();
});
deleteAllBtn.addEventListener('click', () => {
    todoList.innerHTML = "";
    todos = [];
    localStorage.removeItem("todos");
    updateFilters();
});
