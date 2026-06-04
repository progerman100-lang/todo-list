const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const searchInput = document.getElementById("searchInput");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");

const themeBtn = document.getElementById("themeBtn");

let filter = "all";

let tasks =
    JSON.parse(localStorage.getItem("tasks")) || [];

loadTheme();
render();

function saveTasks() {
    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );
}

function render() {

    taskList.innerHTML = "";

    const search =
        searchInput.value.toLowerCase();

    let filtered = tasks.filter(task => {

        const matchesSearch =
            task.text.toLowerCase().includes(search);

        if (!matchesSearch) return false;

        if (filter === "active")
            return !task.completed;

        if (filter === "completed")
            return task.completed;

        return true;
    });

    filtered.forEach(task => {

        const li = document.createElement("li");

        li.className =
            `task ${task.completed ? "completed" : ""}`;

        li.innerHTML = `
            <input type="checkbox"
                ${task.completed ? "checked" : ""}>

            <span class="task-text">
                ${task.text}
            </span>

            <button class="action-btn edit-btn">
                ✏️
            </button>

            <button class="action-btn delete-btn">
                🗑️
            </button>
        `;

        const checkbox =
            li.querySelector("input");

        checkbox.addEventListener(
            "change",
            () => {

                task.completed =
                    checkbox.checked;

                saveTasks();
                render();
            }
        );

        li.querySelector(".delete-btn")
            .addEventListener(
                "click",
                () => {

                    tasks =
                        tasks.filter(
                            t => t.id !== task.id
                        );

                    saveTasks();
                    render();
                }
            );

        li.querySelector(".edit-btn")
            .addEventListener(
                "click",
                () => {

                    const newText =
                        prompt(
                            "Изменить задачу:",
                            task.text
                        );

                    if (
                        newText &&
                        newText.trim()
                    ) {

                        task.text =
                            newText.trim();

                        saveTasks();
                        render();
                    }
                }
            );

        taskList.appendChild(li);
    });

    updateStats();
}

function addTask() {

    const text =
        taskInput.value.trim();

    if (!text) return;

    tasks.unshift({
        id: Date.now(),
        text,
        completed: false
    });

    taskInput.value = "";

    saveTasks();
    render();
}

function updateStats() {

    totalTasks.textContent =
        `Всего: ${tasks.length}`;

    completedTasks.textContent =
        `Выполнено: ${
            tasks.filter(
                t => t.completed
            ).length
        }`;
}

addBtn.addEventListener(
    "click",
    addTask
);

taskInput.addEventListener(
    "keydown",
    e => {

        if (e.key === "Enter")
            addTask();
    }
);

searchInput.addEventListener(
    "input",
    render
);

document
.querySelectorAll(".filter-btn")
.forEach(btn => {

    btn.addEventListener(
        "click",
        () => {

            document
                .querySelectorAll(
                    ".filter-btn"
                )
                .forEach(
                    b => b.classList.remove(
                        "active"
                    )
                );

            btn.classList.add(
                "active"
            );

            filter =
                btn.dataset.filter;

            render();
        }
    );
});

themeBtn.addEventListener(
    "click",
    () => {

        document.body.classList.toggle(
            "dark"
        );

        localStorage.setItem(
            "theme",
            document.body.classList.contains(
                "dark"
            )
        );
    }
);

function loadTheme() {

    const dark =
        localStorage.getItem(
            "theme"
        ) === "true";

    if (dark) {
        document.body.classList.add(
            "dark"
        );
    }
}