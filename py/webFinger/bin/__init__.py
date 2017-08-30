#!/usr/bin/env python
# -*- coding: utf-8 -*-
import requests


class ServerScanner(object):
	def __init__(self):
		self.response = {}
	
	def scan(self, url):
		r = requests.get(url)
		self.response = r
		return self
	
	def server(self):
		return self.response.headers.get('server')
