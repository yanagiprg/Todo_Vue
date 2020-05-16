const STORAGE_KEY = 'todos-vuejs-demo'
const taskStorage = {
  fetch: function () {
    const tasks = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    tasks.forEach(function (task, index) {
      task.id = index
    })
    taskStorage.uid = tasks.length
    return tasks
  },
  save: function (tasks) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  }
}

new Vue({
  el: '#app',

  data: {
    tasks: [],
    form: {
      id: "",
      name: "",
      deadline: "",
      priority: "0",
    },
    completed: false,
    editIndex: 0,
    editing: false,
  },

  computed: {
    remaining() {
      const tasks = this.unfinished(this.tasks)
      return tasks.length
    },

    done() {
      const tasks = this.finished(this.tasks)
      return tasks.length
    },

    calcRatio() {
      const finishedTasks = Number(this.finished(this.tasks).length)
      const tasks = Number(this.tasks.length)
      return Math.round(finishedTasks / tasks * 100)
    },

    computedDate(task) {
      const today = moment()
      const a = moment(task.deadline)
      const daysDiff = a.diff(today, 'days')
      if (daysDiff === 0) {
        return '今日が期限です'
      } else if (daysDiff < 0) {
        return '期限が過ぎています'
      } else {
        return `残り${daysDiff}日`
      }
    }
  },

  watch: {
    tasks: {
      handler: function (tasks) {
        taskStorage.save(tasks)
      },
      deep: true
    }
  },

  created() {
    this.tasks = taskStorage.fetch()
  },

  methods: {
    addTask() {
      const task = Object.assign({}, this.form)
      this.tasks.push(task)
      this.resetTask()
    },

    editTask(task) {
      this.editing = true
      this.resetTask()      
      this.editIndex = this.tasks.indexOf(task)
      this.form = Object.assign({}, task)
      $('#editModal').modal('show');
    },

    updateTask() {
      Object.assign(this.tasks[this.editIndex], this.form);
      this.resetTask()
      $('#editModal').modal('hide')
      this.editing = false
    },

    resetTask() {
      this.form.id = ""
      this.form.name = ""
      this.form.deadline = ""
      this.form.priority = "0"
    },

    removeTask(task) {
      const index = this.tasks.indexOf(task)
      this.tasks.splice(index, 1)
    },

    removeFinishedTasks() {
      this.tasks = this.unfinished(this.tasks);
    },

    deleteAllTasks() {
      this.tasks.splice(0)
      $('#alertModal').modal('hide')
    },

    finished(tasks) {
      return tasks.filter((task) =>
        task.completed
      )
    },

    unfinished(tasks) {
      return tasks.filter((task) =>
        !task.completed
      )
    },

    expiredDate(task) {
      const today = moment()
      const a = moment(task.deadline)
      const daysDiff = a.diff(today, 'days')
      if (daysDiff < 0) return 'expired'
    },

    expiredTask(task) {
      const today = moment()
      const a = moment(task.deadline)
      const daysDiff = a.diff(today, 'days')
      if (daysDiff === 0) {
        return '今日が期限です'
      } else if (daysDiff < 0) {
        return '期限が過ぎています'
      } else {
        return `残り${daysDiff}日`
      }
    },

    taskColors(task) {
      switch (task.priority) {
        case "1":
          return "blue";
        case "0":
          return "white";
        case "-1":
          return "yellow";
        default:
          break;
      }
    },

    valueToStrings(task) {
      switch (task.priority) {
        case "1":
          return "低";
        case "0":
          return "中";
        case "-1":
          return "高";
        default:
          break;
      }
    },

    sortByPriority(){
        const sorted = this.tasks.sort(function (a, b) {
          return  a.priority < b.priority ? -1 : 
          a.priority > b.priority ? 1 : 0
        });
      sorted.sort(function (p) {
        return p.completed? 1 : -1
      })
    },

    sortByDeadline(){
        const sorted = this.tasks.sort(function (a, b) {
          return  a.deadline < b.deadline ? -1 : 
          a.deadline > b.deadline ? 1 : 0
        });
      sorted.sort(function (p) {
        return p.completed? 1 : -1
      })
    }

  }
})