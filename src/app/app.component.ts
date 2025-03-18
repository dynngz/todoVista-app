import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { ConfirmationComponent } from './confirmation/confirmation.component';

interface TodoItem {
  id: number;
  description: string;
  done: boolean;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Vista Todo';
  description = '';
  todoList = signal<TodoItem[]>([]);
  readonly dialog = inject(MatDialog);
  private nextId = 1;
  private readonly STORAGE_KEY = 'vista-todo-items';

  ngOnInit() {
    this.loadFromLocalStorage();
  }

  private saveToLocalStorage() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify({
      items: this.todoList(),
      nextId: this.nextId
    }));
  }

  private loadFromLocalStorage() {
    const savedData = localStorage.getItem(this.STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        this.todoList.set(parsed.items || []);
        this.nextId = parsed.nextId || 1;
      } catch (error) {
        console.error('Error al cargar datos guardados:', error);
      }
    }
  }

  save() {
    if (this.description.trim()) {
      this.todoList.update((list) => {
        const updatedList = [...list, { 
          id: this.nextId++, 
          description: this.description, 
          done: false 
        }];
        
        // Guardar después de actualizar
        setTimeout(() => this.saveToLocalStorage(), 0);
        
        return updatedList;
      });
      this.description = '';
    }
  }

  checkmarkChanged(index: number) {
    this.todoList.update((list) => {
      const newList = [...list];
      newList[index].done = !newList[index].done;
      
      setTimeout(() => this.saveToLocalStorage(), 0);
      
      return newList;
    });
  }

  editTask(index: number) {
    const item = this.todoList()[index];

    const dialogRef = this.dialog.open(ConfirmationComponent, {
      width: '400px',
      panelClass: 'vista-dialog',
      data: {
        title: 'Editar Tarea',
        message: 'Modifica la descripción de tu tarea:',
        confirmText: 'Guardar',
        cancelText: 'Cancelar',
        value: item.description,
        isEdit: true
      }
    });

    dialogRef.afterClosed().subscribe((newDescription) => {
      if (newDescription && typeof newDescription === 'string' && newDescription.trim()) {
        this.todoList.update((list) => {
          const newList = [...list];
          newList[index].description = newDescription.trim();
          
          setTimeout(() => this.saveToLocalStorage(), 0);
          
          return newList;
        });
      }
    });
  }

  deleteConf(item: TodoItem) {
    const dialogRef = this.dialog.open(ConfirmationComponent, {
      width: '400px',
      panelClass: 'vista-dialog',
      data: {
        title: 'Eliminar Tarea',
        message: '¿Estás seguro que quieres eliminar esta tarea?',
        confirmText: 'Eliminar',
        cancelText: 'Cancelar'
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.todoList.update((list) => {
          const filteredList = list.filter((todo) => todo.id !== item.id);
          
          setTimeout(() => this.saveToLocalStorage(), 0);
          
          return filteredList;
        });
      }
    });
  }
}