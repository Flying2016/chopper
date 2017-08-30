#!/usr/bin/env python
# -*- coding: utf-8 -*-

from bin import ServerScanner

engine = ServerScanner()

if __name__ == "__main__":
	url = "https://www.baidu.com"
	server = engine.scan(url).server()
	print server
