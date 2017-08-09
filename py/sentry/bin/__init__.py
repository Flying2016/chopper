# coding: utf-8
import functools
import requests


class Spy(object):
	def __init__(self):
		self.version = ''
		self.tasks = {}
	
	def run(self):
		for item in self.tasks.values():
			item['task_fn'](item['url'])
		self.run()
	
	def plug(self):
		pass
	
	def register(self, name, url, task_fn):
		self.tasks[name] = {
			'url': url,
			'task_fn': task_fn
		}
	
	def task(self, name, url):
		def decorator(func):
			@functools.wraps(func)
			def wrapper():
				task_fn = func
				return task_fn
			
			self.register(name=name, url=url, task_fn=wrapper)
			
			return wrapper
		
		return decorator
	
	def show(self):
		return self.tasks
	
	def __str__(self):
		return str(self.tasks)
