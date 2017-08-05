loop下每个testsuite下同一个block相加除以5
    sum=
loop{'suitName--A'}{'blocks'}[1]['uploadTime']+
loop{'suitName--A'}{'blocks'}[2]['uploadTime']+
loop{'suitName--A'}{'blocks'}[3]['uploadTime']+
loop{'suitName--A'}{'blocks'}[4]['uploadTime']+
loop{'suitName--A'}{'blocks'}[5]['uploadTime']

avg=sum/5

loop{}
    suit{}
        block[]
            {
                upload
                process
            }