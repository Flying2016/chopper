# coding: utf-8
from bin import Spy

app = Spy()


@app.task(name='zhihu', url='')
def zhihu():
    pass


app.run()
