import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FilterByTypePipe } from './filter-by-type.pipe';
import { TaskService } from './task.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';

interface Task {
  id: number;
  taskName: string;
  taskStatusID: number;
  statusName: string;
}




@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, FilterByTypePipe, HttpClientModule],
  providers: [HttpClient, TaskService],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],

})

export class AppComponent {
  constructor(private taskService: TaskService) { }

  title = 'To-do_List';

  showMessage = true;
  createNewtask = false;
  edit_task= false;

  editedTask: any;
  
  currentTasks: Task[] = [];
  doneTasks: Task[] = [];
  currentTasksPage: number = 1;
  doneTasksPage: number = 1;
  pageSize: number = 5;
  errorMessage: string = '';

  taskName: string = '';
  taskType: string = '';
  taskNameError: boolean = false;
  taskTypeError: boolean = false;

  tasks: Task[] = [];

  isNextButtonDisabled(tasks: Task[], page: number): boolean {
    const startIndex = (page - 1) * this.pageSize;
    return tasks.slice(startIndex + this.pageSize).length === 0;
  }

  new_Task() {
    this.edit_task = false;
    this.taskName= '';
    this.taskType = '';
    if (this.createNewtask == false) {
      this.createNewtask = true
    }
    else {
      this.createNewtask = false
    }
  }


  addTask() {
    if (this.taskName.trim() === '') {
      this.taskNameError = true;
    } else {
      this.taskNameError = false;
    }

    if (this.taskType.trim() === '' || this.taskType === 'current' || this.taskType === 'done') {
      this.taskTypeError = false;
    } else {
      this.taskTypeError = true;
    }

    if (!this.taskNameError && !this.taskTypeError) {
      console.log('Task Name:', this.taskName);
      console.log('Task Type:', this.taskType);

      const taskStatusID = this.taskType === 'current' ? 1 : 2;

      const task = {
        taskName: this.taskName,
        taskStatusID: taskStatusID,
      };

      this.taskService.addTask(task).subscribe(
        (response) => {
          console.log('Task added', response);
        },
        (error) => {
          console.error('Error', error);
        }
      );

      this.taskName = '';
      this.taskType = '';
    }
  }

  getTasks() {
    this.taskService.getTasks().subscribe(
      (tasks) => {
        this.showMessage = false;

        this.currentTasks = tasks.filter((task: Task) => task.taskStatusID === 1);
        this.doneTasks = tasks.filter((task: Task) => task.taskStatusID === 2);
      },
      (error) => {
        console.error('Error fetching tasks:', error);
      }
    );
  }
  get currentTasksForDisplay(): Task[] {
    const startIndex = (this.currentTasksPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.currentTasks.slice(startIndex, endIndex).slice(0, this.pageSize);
  }
  
  get doneTasksForDisplay(): Task[] {
    const startIndex = (this.doneTasksPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.doneTasks.slice(startIndex, endIndex);
  }


  changeCurrentTasksPage(pageChange: number) {
    this.currentTasksPage += pageChange;
  }

  changeDoneTasksPage(pageChange: number) {
    this.doneTasksPage += pageChange;
  }

  correctTask(task: Task) {
    this.edit_task = true;
    this.createNewtask = false;
    this.editedTask =task; 
    this.taskName = this.editedTask.taskName;
    this.taskType = this.editedTask.taskStatusID === 1 ? 'current' : 'done';
  }

  savecorrected_Task(task: Task) {
    const updatedTask = {
      id: task.id,
      taskName: this.taskName, 
      taskStatusID: this.taskType === 'current' ? 1 : 2 
    };
  
    this.taskService.updateTask(task.id, updatedTask).subscribe(
      (response) => {
        this.edit_task = false;
        this.getTasks();
        console.log('Task updated successfully:', response);
  
        const index = this.currentTasks.findIndex(t => t.id === task.id);
        if (index !== -1) {
          this.currentTasks[index] = response;
        }
      },
      (error) => {
        console.error('Error updating task:', error);
      }
    );
  
  }
  
  
  


  deleteTask(task: Task) {
    this.taskService.deleteTask(task.id).subscribe(
      (response) => {
        console.log('Task deleted successfully:', response);
        this.getTasks();

        const index = this.tasks.indexOf(task);
        if (index !== -1) {
          this.tasks.splice(index, 1);
        }
      },
      (error) => {
        console.error('Error deleting task:', error);
      }
    );
  }
  
  


  ngOnInit(): void {

     this.getTasks();

  }

}
