# coding: utf-8
import requests
from functools import wraps


class Spy(object):
    def __init__(self):
        self.version = ''
        self.tasks = {}

    def run(self):
        pass

    def plug(self):
        pass

    def task(self, func):
        @wraps(func)
        def wrapper(name, url, impl):
            """print log before a function."""
            self.tasks['name'] = {
                'name': name,
                'url': url,
                'fn': impl
            }

        return wrapper
