function create_td_with_two_spans(text1, text2){
    var td=document.createElement('td');
    td.classList.add('lrborder');
    var span=document.createElement('span');
    span.style.float='left';
    span.innerText=text1;
    span.style.paddingRight='3rem';
    td.appendChild(span);
    span=document.createElement('span');
    span.style.float='right';
    span.innerText=text2;
    td.appendChild(span);
    return td;
}
function create_rentz_row(n){
    var tr=document.createElement('tr'); tr.classList.add('bluebg');
    {
        var td=document.createElement('td');
        var span=document.createElement('span');
        span.classList.add('centery');
        span.innerText='Input results:';
        td.appendChild(span); tr.appendChild(td);
    }
    for(var i=0;i<n;i++){
        var td=document.createElement('td');
        td.classList.add('rlborder');
        var span=document.createElement('span');
        span.innerText='Place: ';
        var input=document.createElement('input');
        input.type='number';
        input.min=input.value="1", input.max=n;
        td.appendChild(span), td.appendChild(input);
        tr.appendChild(td);
    }
    return tr;
}
function create_normal_row(n, text, sum){
    var tr=document.createElement('tr'); tr.classList.add('bluebg');
    {
        var td=document.createElement('td');
        var span=document.createElement('span');
        span.classList.add('centery');
        span.innerText='Input results:';
        td.appendChild(span); tr.appendChild(td);
    }
    for(var i=0;i<n;i++){
        var td=document.createElement('td');
        td.classList.add('rlborder');
        var span=document.createElement('span');
        span.innerText=text+": ";
        var input=document.createElement('input');
        input.type='number';
        input.min=input.value="0", input.max=sum;
        td.appendChild(span), td.appendChild(input);
        tr.appendChild(td);
    }
    return tr;
}
function toggle_class(class_name){
    var toggler=document.getElementById(class_name);
    if(toggler.classList.contains('selected'))
        toggler.classList.remove('selected');
    else 
        toggler.classList.add('selected');
    var v=document.getElementsByClassName(class_name);
    console.log(v);
    for(var i=0;i<v.length;i++){
        var it=v[i];
        console.log(it.classList);
        if(it.classList.contains('hidden')) it.classList.remove('hidden');
        else it.classList.add('hidden');
    }
}
function select_game(table, n, nv){
    console.log(nv);
    var state=game_state['state'];
    var j=state/2%n,i=-1;
    for(var it=0;it<game_state['games'].length;it++){
        i=game_state['games'][it];
        if(document.getElementById('gameradio_'+i+"_"+j).checked){
            console.log(nv,(nv?"NV":"X"));
            document.getElementById('gamecell_'+i+"_"+j).innerText=(nv?"NV":"X");
            game_state['history'][state/2]={game_id: i, nv: nv};
            inc_state();
            set_local_storage();
            return;
        }
    }
}
function commit_game_results(to_check, n){
    var ok=1;
    to_check.forEach(row => {
        if(row['is_rentz']){
            if(!ok) return;
            var umap = {};
            for(var i=1;ok && i<=n;i++){
                var val=row['tablerow'].children[i].children[1].value;
                if(val<1 || val>n || umap[val]) ok=0;
                umap[val]=1;
            }
        }
        else{
            var s=0;
            for(var i=1;ok && i<=n;i++){
                var val=Number(row['tablerow'].children[i].children[1].value);
                if(val<0 || val>row['sum']) ok=0;
                s+=val;
            }
            console.log('here',s,row['sum']);
            if(s!=row['sum']) ok=0;
        }
    });
    if(!ok) return;
    var state=Math.floor(game_state['state']/2);
    game_state['history'][state]['details'] = [];
    game_state['history'][state]['totaldelta'] = [];
    for(var i=0;i<n;i++){
        game_state['history'][state]['details'][i] = [];
        game_state['history'][state]['totaldelta'][i]=0;
    }
    var rowid=0;
    to_check.forEach(row => {
        for(var i=0;i<n;i++){
            game_state['history'][state]['details'][i][rowid]={};
            game_state['history'][state]['details'][i][rowid]['key']=row['tablerow'].children[i+1].children[0].innerText;
            game_state['history'][state]['details'][i][rowid]['val']=Number(row['tablerow'].children[i+1].children[1].value);
            console.log(i,row['tablerow'].children[i+1].children[1].value,row.score);
            if(row['is_rentz']){
                console.log(row.score);
                game_state['history'][state]['details'][i][rowid]['delta']=(Number(n)+1-Number(row['tablerow'].children[i+1].children[1].value))*row.score;
            }
            else
                game_state['history'][state]['details'][i][rowid]['delta']=Number(row['tablerow'].children[i+1].children[1].value)*row.score;
            game_state['history'][state]['totaldelta'][i]+=game_state['history'][state]['details'][i][rowid]['delta'];
            console.log(game_state['history'][state]['totaldelta'][i]);
        }
        rowid++;
    });
    inc_state();
    set_local_storage();
}
function draw_game_history(table, n){
    console.log('d');
    var header=document.createElement('tr');
    {
        var td=document.createElement('td');
        td.classList.add('smborder');
        td.classList.add('centerx');
        var span=document.createElement('span');
        span.innerText="Game Type";
        td.appendChild(span);
        header.appendChild(td);
    }
    for(var i=0;i<n;i++){
        var td=document.createElement('td');
        td.classList.add('smborder');
        td.classList.add('centerx');
        var span=document.createElement('span');
        span.innerText=game_state.player_names[i];
        span.style.color=player_colors[i];
        span.style.fontWeight='bold';
        td.appendChild(span);
        header.appendChild(td);
    }
    table.appendChild(header);
    for(var it=0;it<game_state['games'].length;it++){
        var i=game_state['games'][it];
        var tr=document.createElement('tr');
        {
            var td=document.createElement('td');
            td.classList.add('smborder');
            var span=document.createElement('span');
            span.innerText=all_games[i];
            span.style.color=game_colors[i];
            td.appendChild(span);
            tr.appendChild(td);
        }
        for(var j=0;j<n;j++){
            var td=document.createElement('td');
            var span=document.createElement('span');
            span.id='gamecell_'+i+'_'+j;
            td.classList.add('centerx');
            td.appendChild(span);

            var checkbox=document.createElement('input');
            checkbox.type='radio';
            checkbox.name='radio_'+j;
            checkbox.id="gameradio_"+i+"_"+j;
            checkbox.style.display="none";
            td.appendChild(checkbox);

            td.classList.add('smborder');
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    body.appendChild(table);
    var history=game_state['history'];
    var scoretable=document.createElement('table');
    var total_score = [];
    for(var i=0;i<n;i++) total_score[i]=0;
    for(var i=0;i*2<game_state['state'];i++){
        var player_id=i%n;
        var game_id=history[i]['game_id'];
        var nv=history[i]['nv'];
        var cell_span=document.getElementById('gamecell_'+game_id+'_'+player_id);
        console.log(game_id,player_id);
        if(nv) cell_span.innerText='NV';
        else cell_span.innerText='X';
        if(i*2+1==game_state['state']) cell_span.classList.add('pulsered');
        if(i<Math.floor(game_state['state']/2)){
            //console.log(history[i]['details'][0]);
            var historytr=document.createElement('tr');
            historytr.id="historydetails_"+i;
            {
                {
                    var td=document.createElement('td');
                    var span=document.createElement('span');
                    span.innerText=all_games[history[i]['game_id']];
                    span.style.fontSize='small';
                    if(history[i]['nv']) span.innerText+=' (NV)'
                    td.appendChild(span);
                    historytr.appendChild(td);
                }
                for(var j=0;j<n;j++){
                    console.log(history[i]['totaldelta'][j]);
                    var delta=Number(history[i]['totaldelta'][j]);
                    historytr.appendChild(create_td_with_two_spans(total_score[j],delta));
                    total_score[j]=Number(total_score[j])+delta;
                }
            }
            table.appendChild(historytr);
            for(var entryid=0;entryid<history[i]['details'][0].length;entryid++){
                var details_tr=document.createElement('tr');
                {
                    var td=document.createElement('td');
                    details_tr.appendChild(td);
                }
                for(var j=0;j<n;j++){
                    var entry=history[i]['details'][j][entryid]; /// key, val, delta
                    console.log(entry);
                    var td=create_td_with_two_spans(entry.key+entry.val,entry.delta);
                    details_tr.appendChild(td);
                }
                details_tr.classList.add('historydetails_'+i);
                details_tr.classList.add('greybg');
                details_tr.classList.add('hidden');
                table.appendChild(details_tr);
            }
            historytr.addEventListener('click',(e)=>{
                var _id=e.currentTarget.id;
                console.log(_id); toggle_class(_id);
            });   
        }
        
    }
    {
        historytr=document.createElement('tr');
        {
            var td=document.createElement('td');
            
            historytr.appendChild(td);
        }
        for(var j=0;j<n;j++){
            historytr.appendChild(create_td_with_two_spans(total_score[j],''));
        }
        table.appendChild(historytr);
    }

    var button_div=document.createElement('div');
    //button_div.classList.add('flex');
    button_div.classList.add('centerx');
    body.appendChild(button_div);
    if(game_state['state']==2*n*game_state['games'].length){
        var button=document.createElement('button'); button.innerText='Continue';
        button.addEventListener('click',()=>{
            inc_state();
            set_local_storage(); 
            console.log(game_state['state']);
        });
        button_div.appendChild(button);
        return;
    }
    if(game_state['state']%2==0){
        var j=game_state['state']/2%n;
        for(var it=0;it<game_state['games'].length;it++){
            i=game_state['games'][it];
            if(document.getElementById('gamecell_'+i+'_'+j).innerText.length==0){
                document.getElementById('gameradio_'+i+'_'+j).style.display='block';
                //console.log(i,j);
            }
        }
        var button1=document.createElement('button'); button1.innerText='Submit';
        button1.addEventListener('click',()=>{select_game(table,n,0);});
        button_div.appendChild(button1);
        var button2=document.createElement('button'); button2.innerText='Submit (Blind)';
        button2.addEventListener('click',()=>{select_game(table,n,1);});
        button_div.appendChild(button2);
    }
    else{
        var state=Math.floor(game_state['state']/2);
        var game_id=game_state['history'][state]['game_id'];
        var game_name=all_games[game_id];
        var nv=game_state['history'][state]['nv'],nvmul=(nv?2:1);
        var to_check=[];
        var game_score=game_multiplier[game_id]*nvmul;
        if(game_name=='Rentz' || game_name=='Rentz-'){
            var tr=create_rentz_row(n);
            to_check.push({is_rentz:1, tablerow:tr, score:game_score});
            table.appendChild(tr);
        }
        else if(game_name=='T+'){
            var tr=create_normal_row(n,"K♥+",1);
            to_check.push({is_rentz:0, tablerow:tr, score:100*nvmul, sum:1});
            table.appendChild(tr);

            tr=create_normal_row(n,"♦+",2*n);
            to_check.push({is_rentz:0, tablerow:tr, score:10*nvmul, sum:2*n});
            table.appendChild(tr);

            tr=create_normal_row(n,"Q+",4);
            to_check.push({is_rentz:0, tablerow:tr, score:25*nvmul, sum:4});
            table.appendChild(tr);

            tr=create_normal_row(n,"Whist",8);
            to_check.push({is_rentz:0, tablerow:tr, score:20*nvmul, sum:8});
            table.appendChild(tr);
        }
        else if(game_name=='T-'){
            var tr=create_normal_row(n,"K♥-",1);
            to_check.push({is_rentz:0, tablerow:tr, score:-100*nvmul, sum:1});
            table.appendChild(tr);

            tr=create_normal_row(n,"♦-",2*n);
            to_check.push({is_rentz:0, tablerow:tr, score:-10*nvmul, sum:2*n});
            table.appendChild(tr);

            tr=create_normal_row(n,"Q-",4);
            to_check.push({is_rentz:0, tablerow:tr, score:-25*nvmul, sum:4});
            table.appendChild(tr);

            tr=create_normal_row(n,"Levate",8);
            to_check.push({is_rentz:0, tablerow:tr, score:-20*nvmul, sum:8});
            table.appendChild(tr);
        }
        else{
            var target_sum=(game_target_sum[game_id]==-1?2*n:game_target_sum[game_id]);
            var tr=create_normal_row(n,game_name,target_sum);
            to_check.push({is_rentz:0, tablerow:tr, score:game_score, sum:target_sum});
            table.appendChild(tr);
        }
        var button=document.createElement('button'); button.innerText='Submit';
        button.addEventListener('click',()=>{commit_game_results(to_check,n);});
        button_div.appendChild(button);
    }
}
