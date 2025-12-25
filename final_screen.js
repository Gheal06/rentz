var ctx,output;
function clear_canvas(){
    ctx.clearRect(0,0,output.width,output.height);
}
function drawsegment(x1, y1, x2, y2, width=4,color="#000000"){
    x1*=output.width; x2*=output.width;
    y1*=output.height; y2*=output.height;
    ctx.beginPath();
    ctx.lineWidth=width;
    ctx.strokeStyle=color;
    ctx.moveTo(x1,y1);
    ctx.lineTo(x2,y2);
    ctx.stroke();
    ctx.closePath();
}
function adjusty(y, minval, maxval){
    return 0.9-(y-minval)/(maxval-minval)*0.8
}
function adjustx(x, minval, maxval){
    return 0.15+(x-minval)/(maxval-minval)*0.75;
}
function drawsegment2(x1, y1, x2, y2, minx, maxx, miny, maxy, width=4,color="#000000"){
    drawsegment(adjustx(x1,minx,maxx),adjusty(y1,miny,maxy),
                adjustx(x2,minx,maxx),adjusty(y2,miny,maxy),
                width,color);
}
function drawvertline(x,width){
    drawsegment(x,0,x,1,width,'white');
}
function drawhorline(y,width){
    drawsegment(0.09,y,1,y,width,'white');
}
function drawylabel(y, minval, maxval, is_thick=0){
    var drawy=adjusty(y,minval,maxval);
    drawsegment(0.09,drawy,0.9,drawy,(is_thick?2:1),'white');
    drawsegment(0.09,drawy,0.11,drawy,2,'white');
    drawtext(0.085,drawy,y,20,'white','middle','end');
}
function drawxlabel(x, minval, maxval, is_thick=0){
    var drawx=adjustx(x,minval,maxval);
    drawsegment(drawx,0.1,drawx,0.91,(is_thick?2:1),'white');
    drawsegment(drawx,0.89,drawx,0.91,2,'white');
    drawtext(drawx,0.915,x,20,'white','top','center');
}
function drawdisk(x,y,minx,maxx,miny,maxy,r,color="#000000"){
    //console.log(x,y);
    x=adjustx(x,minx,maxx)*output.width;
    y=adjusty(y,miny,maxy)*output.height;
    //console.log(x,y,r);
    ctx.beginPath();
    ctx.arc(x,y,r*Math.min(output.width,output.height),0,2 * Math.PI,false);
    ctx.fillStyle = color;
    ctx.fill();
    //ctx.lineWidth = 5;
    //ctx.strokeStyle = '#003300';
    //ctx.stroke();
    ctx.closePath();
}
function drawtext(x1,y1,text,fontsize,color,baseline,align){
    x1*=output.width;
    y1*=output.height;
    ctx.font=fontsize+"px sans-serif";
    ctx.fillStyle=color;
    ctx.textBaseline=baseline;
    ctx.textAlign=align;
    ctx.fillText(text,x1,y1);
}
function compute_partial_scores(n){
    var ret=[[]],history=game_state['history'];
    for(var j=0;j<n;j++) ret[0][j]=0;
    for(var i=0;i<history.length;i++){
        ret[i+1]=[];
        for(var j=0;j<n;j++){
            ret[i+1][j]=ret[i][j]+history[i]['totaldelta'][j];
        }
    }
    return ret;
}
function draw_final_screen(body, n){
    
    var partial_scores=compute_partial_scores(n),history=game_state['history'];;
    var sorted=[];
    for(var i=0;i<n;i++) sorted[i]=[Number(partial_scores[partial_scores.length-1][i]),Number(i)];
    sorted.sort((a,b) => {
        if(a[0]>b[0]) return -1;
        if(a[0]<b[0]) return 1;
        if(a[1]>b[1]) return -1;
        if(a[1]<b[1]) return 1;
        return 0;
    });
    //console.log(partial_scores);
    var minval=0,maxval=0;
    for(var i=0;i<=history.length;i++){
        for(var j=0;j<n;j++){
            //console.log(i,j);
            minval=Math.min(minval,partial_scores[i][j]);
            maxval=Math.max(maxval,partial_scores[i][j]);
        }
    }
    //console.log(partial_scores);
    var div=document.createElement('div');
    //div.classList.add('flex');
    div.classList.add('centerx');
    output=document.createElement('canvas');
    output.height=Math.floor(window.screen.availHeight*0.75);
    output.width=Math.floor(window.screen.availWidth*0.85);
    ctx=output.getContext("2d");
    //drawvertline(0.1,3);
    //drawvertline(0.9,1);
    //drawhorline(0.1,1);
    //drawhorline(0.9,1);
    //drawtext(0.085,0.1,maxval,20,'white','middle','end');
    //drawtext(0.085,0.9,minval,20,'white','middle','end');
    var xstep=Number(n);
    //console.log("xstep=",xstep);
    drawxlabel(0,0,history.length,1);
    drawxlabel(history.length,0,history.length,1);
    for(var i=0;i+xstep<=history.length;i+=xstep){
        drawxlabel(i,0,history.length);
    }
    var ystep=Math.max(50,Math.ceil((maxval-minval)/600)*50),curry;
    //console.log(ystep);
    drawylabel(0,minval,maxval,1);
    drawylabel(minval,minval,maxval,1);
    drawylabel(maxval,minval,maxval,1);
    curry=maxval-maxval%ystep;
    while(curry>minval){
        if(maxval-curry>=ystep && curry-minval>=ystep)
            drawylabel(curry,minval,maxval);
        curry-=ystep;
    }
    for(var i=0;i<history.length;i++){
        for(var j=0;j<n;j++){
            drawsegment2(i,partial_scores[i][j],i+1,partial_scores[i+1][j],0,history.length,minval,maxval,3,player_colors[j]);
            //drawdisk(i+1,partial_scores[i+1][j],0,history.length,minval,maxval,0.015,player_colors[j]);
        }
    }
    output.classList.add('smborder');
    var div2=document.createElement('div');
    div2.classList.add('flex');
    div2.classList.add('centerx');
    var table=document.createElement('table');
    {
        var tr=document.createElement('tr');
        {
            var td=document.createElement('td'); td.classList.add('smborder');
            var span=document.createElement('span');
            span.style.fontWeight='bold';
            span.innerText='Rank';
            td.appendChild(span);
            tr.appendChild(td);
        }
        {
            var td=document.createElement('td'); td.classList.add('smborder');
            var span=document.createElement('span');
            span.style.fontWeight='bold';
            span.innerText='Player';
            td.appendChild(span);
            tr.appendChild(td);
        }

        {
            var td=document.createElement('td'); td.classList.add('smborder');
            var span=document.createElement('span');
            span.style.fontWeight='bold';
            span.innerText='Final Score';
            td.appendChild(span);
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    for(var i=0;i<n;i++){
        var playerid=sorted[i][1],final_score=sorted[i][0];
        var tr=document.createElement('tr');
        {
            var td=document.createElement('td'); td.classList.add('smborder');
            var span=document.createElement('span');
            span.innerText=i+1+'.';
            if(i==0) span.style.color='gold';
            if(i==1) span.style.color='silver';
            if(i==2) span.style.color='#CD7F32';
            td.appendChild(span);
            tr.appendChild(td);
        }
        {
            var td=document.createElement('td'); td.classList.add('smborder');
            var span=document.createElement('span');
            span.innerText=game_state['player_names'][playerid];
            span.style.color=player_colors[playerid];
            td.appendChild(span);
            tr.appendChild(td);
        }

        {
            var td=document.createElement('td'); td.classList.add('smborder');
            var span=document.createElement('span');
            span.innerText=final_score;
            if(i==0) span.style.color='gold';
            if(i==1) span.style.color='silver';
            if(i==2) span.style.color='#CD7F32';
            td.appendChild(span);
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    div2.appendChild(table);
    var sep=document.createElement('div');
    sep.classList.add('smborder');
    sep.classList.add('centery');
    sep.style.width='90%';
    sep.style.padding='0px';
    div.appendChild(sep);
    var h1=document.createElement('h1');
    h1.innerText='Leaderboard';
    div.appendChild(h1);
    div.appendChild(div2);
    var h2=document.createElement('h2');
    h2.innerText='Point History';
    div.appendChild(document.createElement('br'));
    sep=document.createElement('div');
    sep.classList.add('smborder');
    sep.classList.add('centery');
    sep.style.width='90%';
    sep.style.padding='0px';
    div.appendChild(sep);
    div.appendChild(h2);
    div.appendChild(output);
    body.appendChild(div);
}
