
function SheetWriter (
    { title='spreadsheet',
      shareWith=[],
      id='',
    }
) {
    return {
        write (body,description='') {
            if (id) {
                return updateFile(id,{description,body})
            }
            else {
                return createFile({title,body,description})
            }
        }
    }
    
}

function getAccessToken () {
    return window.gapi.auth.getToken().access_token;
}

async function createFile ({title,description,body}) {
    var metadata = {
        name : title,
        mimeType : 'application/vnd.google-apps.spreadsheet',
        appProperties : {
                        role : 'foo'
                    }
    }
    var file = new Blob([body || '1,2,3\nA,B,C'],{type:'text/csv'});
    //var file = new Blob([body || '<html><body><table><tbody><tr><td>1</td><td>2</td></tr><tr><td colspan="2">Hello</td></tr></tbody></table></body></html>'],{type:'text/html'});
    var form = new FormData();
    form.append('metadata',new Blob([JSON.stringify(metadata)],
                                    {type:'application/json'}))
    form.append('file',file);
    const resp = await fetch(
        'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id',{
            method : 'POST',
            headers : new Headers({'Authorization':'Bearer '+getAccessToken()}),
            body : form
        })
    console.log('Got a response!',resp);
    const val = await resp.json()
    console.log(val)
    return {
        title:title,
        description:description,
        id:val.id,
        url:`https://docs.google.com/spreadsheets/d/${val.id}/edit#`
    }
}

async function updateFile (id,{description,body}) {
    const metadata = {mimeType:'application/vnd.google-apps.document',}
    var form = new FormData()
     form.append('metadata',new Blob([JSON.stringify(metadata)],
                                     {type:'application/json'}));
    //                               //{type:'application/vnd.google-apps.document'}));
    form.append('file',body);
    const resp = await fetch(
        `https://www.googleapis.com/upload/drive/v2/files/${id}/?uploadType=media`,{
            method : 'PUT',
            headers : new Headers({'Authorization':'Bearer '+getAccessToken()}),
            body : new Blob([body])
        })
    const val = await resp.json();
    console.log('Pushed to file: ',val);
    return {
        url:val.alternateLink,
        ...val
    }
}

window.createFile = createFile
window.updateFile = updateFile;

export default SheetWriter
