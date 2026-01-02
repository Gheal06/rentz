let player_colors=["deepskyblue","red","lime","yellow","magenta","orange"];
var game_state=null, body;
function set_local_storage(){
    //console.log(game_state);
    localStorage.setItem('rentz_game_state',JSON.stringify(game_state));
    load_local_storage();
}
function dec_state(){
    if(game_state['state']==undefined || game_state['state']==-3) return;
    //if(game_state['state']==-2) game_state.removeAttribute('player_cnt');
    //if(game_state['state']==-1) game_state.removeAttribute('player_names');
    //if(game_state['state']==0) game_state.removeAttribute('player_names');
    game_state['state']=game_state['state']-1;
    //console.log(game_state);
    set_local_storage();
}
function inc_state(){
    game_state['state']=game_state['state']+1;
}
function reset_game(ask_confirm=1){
    if(!ask_confirm || confirm("Are you sure you want to reset the game?")){
        game_state={state: -3};
        set_local_storage();
    }
}
function set_player_cnt(){
    value=document.getElementById('player_cnt_input').value;
    if(!value) return;
    game_state['player_cnt']=value;
    //console.log(game_state['player_cnt']);
    inc_state();
    set_local_storage();
}
function prompt_player_cnt(){
    var div=document.createElement('div');
    div.classList.add('flex');
    div.classList.add('smborder');
    div.classList.add('centerx');
    div.classList.add('centery');
    div.style.position='relative';
    div.style.top='40vh';
    div.style.width='20vw';
    var p=document.createElement('p'); p.innerText="Number of players:";
    var input=document.createElement('input');
    input.type='number';
    input.id='player_cnt_input';
    input.min=2;
    input.max=6;
    input.value=4;
    var submit=document.createElement('button');
    submit.classList.add('centery');
    submit.onclick=set_player_cnt;
    submit.innerText='Submit';
    div.appendChild(p);
    div.appendChild(input);
    div.appendChild(submit);
    body.appendChild(div);
}
function set_player_names(n){
    //console.log('a');
    //console.log(n);
    var names = [];
    for(var i=0;i<n;i++){
        var name=document.getElementById('name_input'+i).value;
        //console.log(name);
        if(name==undefined || name.length==0) return;
        names[i]=name;
    }
    //console.log('a');
    game_state['player_names']=names;
    inc_state();
    set_local_storage();
}
function prompt_player_names(table, n){
    var header=document.createElement('tr');
    for(var i=0;i<n;i++){
        var td=document.createElement('td');
        td.classList.add('smborder');
        var span=document.createElement('span');
        span.innerText="Player "+(i+1)+": ";
        var input=document.createElement('input');
        input.type='text';
        input.id='name_input'+i;
        td.appendChild(span);
        td.appendChild(input);
        header.appendChild(td);
    }
    table.appendChild(header);
    body.appendChild(table);
    {
        var td=document.createElement('td');
        td.classList.add('nohover');
        var submit=document.createElement('button');
        submit.addEventListener('click',() => {set_player_names(n);});
        submit.innerText='Submit';
        td.appendChild(submit);
        header.appendChild(td);
    }
}
let all_games=["K♥+","K♥-","♦+","♦-","Q+","Q-","Whist","Levate","Rentz","Rentz-","T+","T-"];
let game_multiplier=[100,-100,10,-10,25,-25,20,-20,50,-50,1,1];
let game_target_sum=[1,1,-1,-1,4,4,8,8,-1,-1,-1,-1];
let game_colors=["white","white","white","white","white","white","white","white","white","white","white","white"];
let default_checked=[1,1,0,1,0,1,1,1,1,0,0,1];
function set_game_preferences(){
    var preferences=[],len=0;
    for(var i=0;i<all_games.length;i++){
        //console.log(i);
        var elem=document.getElementById('game_checkbox'+i);
        if(elem.checked==1) preferences[len++]=i;
    }
    game_state['games']=preferences;
    game_state['history']=[];
    inc_state();
    set_local_storage();
}
function prompt_games(table, n){
    var header=document.createElement('tr');
    {
        var td=document.createElement('td');
        td.classList.add('smborder');
        var span=document.createElement('span');
        span.innerText="Game Type";
        td.appendChild(span);
        header.appendChild(td);
    }
    {
        var td=document.createElement('td');
        td.classList.add('smborder');
        var span=document.createElement('span');
        span.innerText="Use?";
        td.appendChild(span);
        header.appendChild(td);
    }
    /*for(var i=0;i<n;i++){
        var td=document.createElement('td');
        td.classList.add('smborder');
        var span=document.createElement('span');
        span.innerText=game_state.player_names[i];
        span.style.color=player_colors[i];
        span.style.fontWeight='bold';
        td.appendChild(span);
        header.appendChild(td);
    }*/
    table.appendChild(header);
    for(var i=0;i<all_games.length;i++){
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
        {
            var td=document.createElement('td');
            td.classList.add('smborder');
            var input=document.createElement('input');
            td.classList.add('centerx');
            //td.classList.add('flex');
            input.type="checkbox";
            input.id="game_checkbox"+i;
            if(default_checked[i]) input.checked=1;
            td.appendChild(input);
            tr.appendChild(td);
        }
        /*for(var j=0;j<n;j++){
            var td=document.createElement('td');
            td.classList.add('smborder');
            tr.appendChild(td);
        }*/
        table.appendChild(tr);
    }
    body.appendChild(table);
    {
        var div=document.createElement('div'); 
        div.classList.add('flex'); 
        div.classList.add('centerx');
        var input=document.createElement('button');
        input.innerText='Submit';
        div.appendChild(input);
        body.appendChild(div);
        input.addEventListener('click',()=>{set_game_preferences();});
    }
}
function load_local_storage(){
    body=document.getElementById('body');
    body.innerHTML='<center><button onclick="dec_state()" class="undobutton">Undo</button></center></div><br>';
    //console.log('a');
    game_state=localStorage.getItem('rentz_game_state');
    if(game_state == null){
        reset_game(0);
        return;
    }
    game_state=JSON.parse(localStorage.getItem('rentz_game_state'));
    
    if(game_state['state']==-3){ /// se alege nr de jucatori
        body.innerHTML='';
        prompt_player_cnt();
        return;
    }
    var table=document.createElement('table'),n=game_state['player_cnt'];
    table.classList.add('centery');
    if(game_state['state']==-2){
        prompt_player_names(table, n);
        return;
    }
    if(game_state['state']==-1){ /// se aleg jocurile efective
        prompt_games(table, n);
        return;
    }
    if(game_state['state']<=2*n*game_state['games'].length){ /// inca in joc
        body.innerHTML='';
        draw_game_history(table, n);
        return;
    }
    draw_final_screen(body, n);
}
