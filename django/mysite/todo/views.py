from django.views.generic import ListView, CreateView, UpdateView, DeleteView
from django.shortcuts import render
from django.urls import reverse_lazy


from todo.models import Todo

# Create your views here.
class TodoListView(ListView):
    model = Todo
    template_name = 'todo/todo_list.html'
    context_object_name = 'todo_list'


class TodoCreateView(CreateView):
    model = Todo
    template_name = 'todo/todo_form.html'
    fields = ['title']
    success_url = reverse_lazy('todo:todo_list')


class TodoUpdateView(UpdateView):
    model = Todo
    template_name = 'todo/todo_form.html'
    fields = ['title']
    success_url = reverse_lazy('todo:todo_list')


class TodoDeleteView(DeleteView):
    model = Todo
    template_name = 'todo/todo_confirm_delete.html'
    fields = ['title']
    success_url = reverse_lazy('todo:todo_list')
    context_object_name = 'todo'
