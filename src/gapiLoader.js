import React,{useEffect,useState} from 'react';

// LOCAL MODE 
//import apiInfo from './secrets.js'; // comment out before committing
//const localMode = true; // comment out before committing
//// REMOTE MODE
var apiInfo // comment to work local
const localMode = false; // comment to work local


const GOOGLESCOPES = {
}

function addScope (parent, child, suffixes=['readonly']) {
    const baseObj = {}
    if (child) {
        baseObj.all = `https://www.googleapis.com/auth/${parent}.${child}`
    }
    else {
        baseObj.all = `https://www.googleapis.com/auth/${parent}`
    }
    suffixes.forEach(
        (suffix)=>{
            baseObj[suffix] = baseObj.all+`.${suffix}`;
        }
    );
    if (!child) {
        if (!GOOGLESCOPES[parent]) {
            GOOGLESCOPES[parent] = baseObj;
            return;
        }
        else {
            GOOGLESCOPES[parent] = {...GOOGLESCOPES[parent], ...baseObj}
            return;
        }
    }
    // Assume child...
    if (!GOOGLESCOPES[parent]) {
        GOOGLESCOPES[parent] = {}        
    }

    if (child.indexOf('.')!=-1) {
        console.log('Got nested child... ',child);
        var layers = child.split('.')
        var myparent = GOOGLESCOPES[parent];
        
        layers.slice(0,-1).forEach(
            (child)=>{
                if (!myparent[child]) {
                    myparent[child] = {}
                }
                myparent = myparent[child]
            }
        );
        myparent[layers[layers.length-1]] = baseObj;
    }
    else {
        GOOGLESCOPES[parent][child] = baseObj;
    }
}

// classroom scopes...
['courses','rosters','coursework.students','coursework.me','guardianlinks.students','announcements'].forEach(
    (scope)=>addScope('classroom',scope)
);
['appfolder','file','install','scripts'].forEach(
    (scope)=>addScope('drive',scope,[])
);
['apps','metadata','activity'].forEach(
    (scope)=>addScope('drive',scope) // includes readonly
);
addScope('drive',null,['readonly']); // top-level permissions
addScope('drive','appdata',[]); // top-level permissions
addScope('spreadsheets',null,['readonly']); // top-level sheets permissions

console.log("APIs look like: %s",JSON.stringify(GOOGLESCOPES));

const SCOPES = [];
SCOPES.push(GOOGLESCOPES.drive.file.all);


const DISCOVERY_DOCS = [
    //"https://www.googleapis.com/discovery/v1/apis/classroom/v1/rest",
    "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest",
    //"https://sheets.googleapis.com/$discovery/rest?version=v4"
]
console.log('scopes are ',SCOPES);

const awaitGapi = (spy)=> new Promise((resolve,reject)=>{

    const maxAttempts = 10;
    const attempts = []
    console.log('Start waiting for gapi...');
    
    function checkForGapi () {
        attempts.push(new Date())
        if (window.gapi) {
            console.log('Got it!');
            // if (spy) {
            //     window.origGapi = window.gapi;
            //     window.gapi = Spy(window.gapi,'gapi');
            // }
            resolve(window.gapi);
        }
        else {
            console.log('Try again... attempts #',attempts.length);
            if (attempts.length > maxAttempts) {
                reject({
                    message:'Waited too long...',
                    attempts}
                      )
            }
            else {
                console.log('timeout...')
                window.setTimeout(checkForGapi,1000)
            }
        }
    }

    checkForGapi()
});

function Gapi (props) {
    const [authorized,setAuthorized] = useState(false);
    const [signedIn,setSignedIn] = useState(false);
    const [gapi,setGapi] = useState(window.gapi);
    const [insertedGapiScript,setInsertedGapiScript] = useState(false);
    console.log('Got gapi? %s',gapi);
    const [courses,setCourses] = useState([]);

    function initClient () {
        console.log('initClient!');
        if (gapi) {
            gapi.client.init({
            apiKey : apiInfo.API_KEY,
            clientId : apiInfo.CLIENT_ID,
            discoveryDocs : DISCOVERY_DOCS,
            scope : SCOPES.join(' '),
        })
            .then(()=>{
                console.log('client initialized!');
                if (props.onApiLoaded) {
                    props.onApiLoaded(true);
                }
                gapi.auth2.getAuthInstance().isSignedIn.listen(
                    (isSignedIn)=>{
                        console.log('is signed in? %s',isSignedIn);
                        setAuthorized(isSignedIn)
                        debugger;
                        if (isSignedIn) {
                            console.log('Yes logged in - log onready!!')
                            props.onReady && props.onReady();
                        }
                        else {
                            console.log('Not logged in - log out!')
                            props.onLoggedOut && props.onLoggedOut();
                        }
                    }
                )
                var state = gapi.auth2.getAuthInstance().isSignedIn.get();
                console.log('initial sign-in state? %s',state);
                setAuthorized(state);
                if (state) {
                    props.onReady && props.onReady();
                }
            })
            .catch((err)=>{
                console.log('client init failed :(');
                console.log(err);
            });
        }
        else {
            console.log('No gapi :(');
        }
    }

    function handleAuthClick (event) {
        console.log('authClick!');
        gapi.auth2.getAuthInstance().signIn();
    }

    function handleSignoutClick (event) {
        console.log('signOutclick!');
        gapi.auth2.getAuthInstance().signOut();
    }

    
    useEffect( ()=>{
        if (!gapi && !window.gapi && !insertedGapiScript) {
            console.log('Load gapi script into document')
            const script = document.createElement('script');
            script.src = ''
            script.setAttribute('src','https://apis.google.com/js/client.js');
            script.setAttribute('crossorigin','');
            script.async = true;
            document.body.appendChild(script);
            setInsertedGapiScript(true);
            console.log('Done attaching gapi script into document')
            awaitGapi(props.spy).then((mygapi)=>{
                setGapi(mygapi)
            })
            return;
        }
        if (window.gapi && !gapi) {
            console.log('window.gapi defined -- set gapi to point to it :)');
            setGapi(window.gapi);
        }
        
        if (localMode) {handleClientLoad();}
        else {
            fetch('https://check-in.netlify.com/.netlify/functions/apiInfo/')
                .then((resp)=>{
                    resp.json()
                        .then((data)=>{
                            console.log('Got our API Info!');
                            apiInfo = data;
                            console.log('handleClientLoad()!');
                            handleClientLoad();
                        });
                })
                .catch((err)=>console.log('oops?'));
        }
    },[gapi]);


    function handleClientLoad () {
        console.log('load auth2!');
        gapi && gapi.load('client:auth2',initClient)
    }

    return (
            <div>
              <div>
                <div>
                  {apiInfo=={} && 'No API info yet'
                   || <span>
                        Signed {authorized && 'in' || 'out'}
                      </span>
                  }
                </div>
                <div>
                  {authorized &&
                   <button onClick={handleSignoutClick}>Sign Out</button>
                   ||
                   <button className='button' onClick={handleAuthClick}>Sign In</button>
                  }
                </div>
              </div>
            </div>
    )

}

export default Gapi;
