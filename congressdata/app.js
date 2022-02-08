
const api_senate = fetch("https://api.propublica.org/congress/v1/113/senate/members.json", {
    type: 'GET',
    datatype: 'json',
    headers: {
        'X-API-Key': 'Q9Eib0KXN0vBcLDpac5VsFUgs1SjUZfpRHg987ft',
    }
});

const api_house = fetch("https://api.propublica.org/congress/v1/113/house/members.json", {
    type: 'GET',
    datatype: 'json',
    headers: {
        'X-API-Key': 'Q9Eib0KXN0vBcLDpac5VsFUgs1SjUZfpRHg987ft',
    }
});

var senators;
var glance;
var mostloyal;
var leastloyal;
var leastEngaged;
var mostEngaged;

var json = [];
var miembros = [];

async function fetched(api) { 
    const datos = await api
        .then(response => response.json())
    return datos;
}
async function callTables(api) {
    json = await fetched(api);
    miembros = json.results[0].members;
    senators = new Vue({
        el: '#tables',
        data: {
            senadores: []
        }
    });
    senators.senadores = miembros;
    let spinner = document.getElementById("Spinner");
    spinner.style.visibility = 'hidden';
    stateSelect(miembros);
    filters(miembros);
}
async function callTableGlanceLoyal(api){
    json = await fetched(api);
    miembros = json.results[0].members;
    
    glance = new Vue({
        el: '#glance',
        data: {
                "nroDemocrats":[], 
                "pctVotesDemocrats":[],
        
                "nroRepublicans":[], 
                "pctVotesRepublicans":[], 
        
                "nroIndependists":[], 
                "pctVotesIndependists":[],
    
                "total":[],
                "pctTotal":[],
            }
    });
    mostloyal = new Vue({
        el:"#mostloyal",
        data:{
            ML:[]
        }
    });
    leastloyal = new Vue({
        el:"#leastloyal",
        data:{
            LL:[]
        }
    });

        glance.nroDemocrats= numDemocrats(miembros);
        glance.pctVotesDemocrats= numDemocratspct(miembros, numDemocrats(miembros));

        glance.nroRepublicans= numRepublicans(miembros);
        glance.pctVotesRepublicans= numRepublicanspct(miembros, numRepublicans(miembros));

        glance.nroIndependists= numIndependists(miembros);
        glance.pctVotesIndependists= numIndependistspct(miembros, numIndependists(miembros));
    
        glance.total= numDemocrats(miembros) + numRepublicans(miembros) + numIndependists(miembros);
        
        if (numIndependists(miembros) == 0) {
            glance.pctTotal= ((numDemocratspct(miembros, numDemocrats(miembros))+numRepublicanspct(miembros, numRepublicans(miembros)))/2).toFixed(2)
        }
        else{
            glance.pctTotal= ((numDemocratspct(miembros, numDemocrats(miembros))+numRepublicanspct(miembros, numRepublicans(miembros))+numIndependistspct(miembros, numIndependists(miembros)))/3).toFixed(2)
        }
        
        let spinner = document.getElementById("Spinner");
        spinner.style.visibility = 'hidden';

        totalMiembros = miembros.length;
        var json3 = miembros.filter(num => num.total_votes != 0);
        //---------PartyLoyal------------------
        leastloyal.LL = json3.sort(((a, b) => a.votes_with_party_pct - b.votes_with_party_pct)).slice(0, tenPrc(totalMiembros));
        
        mostloyal.ML = json3.sort(((a, b) => b.votes_with_party_pct - a.votes_with_party_pct)).slice(0, tenPrc(totalMiembros));
    
}
async function callTablesGlanceAtten(api) {
    json = await fetched(api);
    miembros = json.results[0].members;
    glance = new Vue({
        el: '#glance',
        data: {
                "nroDemocrats":[], 
                "pctVotesDemocrats":[],
        
                "nroRepublicans":[], 
                "pctVotesRepublicans":[], 
        
                "nroIndependists":[], 
                "pctVotesIndependists":[],
    
                "total":[],
                "pctTotal":[],
            }
    });
    leastEngaged = new Vue({
        el:"#leastengaged",
        data:{
            LE:[]
        }
    });
    mostEngaged = new Vue({
        el:"#mostengaged",
        data:{
            ME:[]
        }
    });


        glance.nroDemocrats= numDemocrats(miembros);
        glance.pctVotesDemocrats= numDemocratspct(miembros, numDemocrats(miembros));

        glance.nroRepublicans= numRepublicans(miembros);
        glance.pctVotesRepublicans= numRepublicanspct(miembros, numRepublicans(miembros));

        glance.nroIndependists= numIndependists(miembros);
        glance.pctVotesIndependists= numIndependistspct(miembros, numIndependists(miembros));
    
        glance.total= numDemocrats(miembros) + numRepublicans(miembros) + numIndependists(miembros);
        
        if (numIndependists(miembros) == 0) {
            glance.pctTotal= ((numDemocratspct(miembros, numDemocrats(miembros))+numRepublicanspct(miembros, numRepublicans(miembros)))/2).toFixed(2)
        }
        else{
            glance.pctTotal= ((numDemocratspct(miembros, numDemocrats(miembros))+numRepublicanspct(miembros, numRepublicans(miembros))+numIndependistspct(miembros, numIndependists(miembros)))/3).toFixed(2)
        }
        
    let spinner = document.getElementById("Spinner");
    spinner.style.visibility = 'hidden';
    
    totalMiembros = miembros.length;
    var json3 = miembros.filter(num => num.total_votes != 0);
    //---------Attendance------------------
    leastEngaged.LE= json3.sort(((a, b) => b.missed_votes_pct - a.missed_votes_pct)).slice(0, tenPrc(totalMiembros));
    mostEngaged.ME= json3.sort(((a, b) => a.missed_votes_pct - b.missed_votes_pct)).slice(0, tenPrc(totalMiembros));
    
    
}
function stateSelect(json) {
    var states = []
    json.forEach(state => {
        states.push(state.state)
    })
    const statesArr = new Set(states);

    states = [...statesArr];
    for (var i = 0; i < states.length; i++) {
        var option;
        option = `<option value="${states[i]}">${states[i]}</option>`;
        document.getElementById("stateSelect").innerHTML += option;
    };
}
function filters(json) {

    var rep = document.getElementById("republic").checked;
    var dem = document.getElementById("democrat").checked;
    var idt = document.getElementById("independent").checked;
    var ver = rep && dem && idt;
    var fal = rep || dem || idt;
    fal = !fal
    if (ver == true) {

        aplifilter2(json);
    }
    else if (fal == true) {

        aplifilter2(json);
    }
    else {
        checked(json);

    }
    function checked() {
        var congressfilt = []
        if (rep == true) {
            json.forEach(partyfilter => {
                if (partyfilter.party === "R") {
                    congressfilt.push(partyfilter);
                }


            })
        }
        if (dem == true) {
            json.forEach(partyfilter => {
                if (partyfilter.party === "D") {
                    congressfilt.push(partyfilter);
                }


            })
        }
        if (idt == true) {
            json.forEach(partyfilter => {
                if (partyfilter.party === "ID") {
                    congressfilt.push(partyfilter);
                }

            })
        }
        aplifilter2(congressfilt)
    }
    function aplifilter2(json2) {

        var statev = document.getElementById("stateSelect").value;
        var statefilt = []
        if (statev === "ALL") {

            json2.forEach(statefilter => {
                statefilt.push(statefilter);

            })

        }

        else {
            json2.forEach(statefilter => {
                if (statefilter.state === statev) {
                    statefilt.push(statefilter);
                }
            })
        } senators.senadores = statefilt;
    }
}

//-----------DEMOCRATS
function numDemocrats(json) {
    // debugger
    var democrats = [];
    json.forEach(member => {
        if (member.party === "D") {
            democrats.push(member);
        }
    })
    return democrats.length
}
function numDemocratspct(json, numd) {
    var democratspct = 0;
    json.forEach(votes => {
        if (votes.party === "D") {
            democratspct += votes.votes_with_party_pct;
        }
    })
    let pct_votes = Number((democratspct / numd).toFixed(2));
    return pct_votes
}
//-----------REPUBLICANS
function numRepublicans(json) {
    var republicans = [];
    json.forEach(member => {
        if (member.party === "R") {
            republicans.push(member);
        }
    })
    return republicans.length
}
function numRepublicanspct(json, numr) {
    var republicanspct = 0
    json.forEach(votes => {
        if (votes.party === "R") {
            republicanspct += votes.votes_with_party_pct;
        }
    })
    let pct_votes = Number((republicanspct / numr).toFixed(2));
    return pct_votes
}
//----------INDEPENDISTS
function numIndependists(json) {
    var independists = [];
    json.forEach(member => {
        if (member.party === "ID") {
            independists.push(member);
        }
    })
    return independists.length
}
function numIndependistspct(json, numid) {
    var independistspct = 0
    json.forEach(votes => {
        if (votes.party === "ID") {
            independistspct += votes.votes_with_party_pct;
        }
    })
    let pct_votes = Number((independistspct / numid).toFixed(2));
    return pct_votes
}
function tenPrc(party) {
    var tenPrcOfArray = party / 100 * 10;
    return tenPrcOfArray;
}

