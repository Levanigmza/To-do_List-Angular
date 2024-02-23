import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({

  providedIn: 'root',
  
})
export class TaskService {
  private apiUrl = 'http://localhost:5000/api'; 

  constructor(private http: HttpClient) {}

  getTasks(): Observable<any> {
    const url = `${this.apiUrl}/task`; 
    console.log('Request URL:', url);
    return this.http.get(url);
  }

  addTask(task: any): Observable<any> {
    const url = `${this.apiUrl}/task`;
    console.log('Request URL:', url);
    return this.http.post<any>(url, task);
}

updateTask(taskId: number, updatedTask: any): Observable<any> {
  const url = `${this.apiUrl}/task/update/${taskId}`;
  return this.http.put(url, updatedTask, { responseType: 'text' });
}


deleteTask(id: number): Observable<any> {
    const url = `${this.apiUrl}/task/delete/${id}`;
  
    return this.http.delete(url, { responseType: 'text' });
  }
  

}
