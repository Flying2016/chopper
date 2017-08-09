#!/usr/bin/env python
# -*- coding: utf-8 -*-

import sys

reload(sys)
sys.setdefaultencoding('utf8')
from bin import Spy

app = Spy()


@app.task(name='zhihu', url='www.baidu.com')
def zhihu():
	print 'sss'


app.run()
print app
print app.show()
