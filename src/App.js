import logo from './logo.svg';
import './App.css';

const clientID = process.env.REACT_APP_clientID
const apiKey = process.env.REACT_APP_api_key

function App() {
  return (
    <div className="App">
      <div>
        <h1>
          VeryFi-CSC Task 7
        </h1>
        <input id="img" type="file" onChange = {upload}/>
        <div><img id= "show" alt="your uploaded image" style={{'max-height':'20vw'}}></img></div>
        <div>
          <h2>The Items:</h2>
          <div id="veryRes"></div>
        </div>
      </div>
    </div>
  );
}

async function upload(e){
  var shower = document.getElementById('show');
  shower.src = URL.createObjectURL(e.target.files[0]);
  var y = document.getElementById("veryRes")
  y.innerHTML = 'loading...'

  const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

  const newBase64 = await toBase64(e.target.files[0])

  const data = {
    'file_name': e.target.files[0].name,
    'file_data': newBase64
  }

  const requestDetails = {
    method: 'POST',
    headers: {
      'Content-Type':'application/json',
      'Accept': 'application/json',
      'CLIENT-ID': clientID,
      'AUTHORIZATION': apiKey
  },
    body: JSON.stringify(data)
  };

  const request = new Request('https://api.veryfi.com/api/v7/partner/documents/',requestDetails)

  const response = await fetch(request);

  response.json()
  .then(data => {
    var y = document.getElementById("veryRes")
    y.innerHTML = 'almost there...'
    console.log(data)
    var retHTML=''
    if (data.ocr_text === '' || data.subtotal === 0 ){
      retHTML = "Pls upload a valid receipt."
    }else{
      for(var i =0; i<data.line_items.length; i++){
        retHTML += '<h3>Name: '+data.line_items[i].description+'<br>Price: '+data.line_items[i].total+'</h3>'
      }
      retHTML += '<h3>Subtotal: '+data.subtotal+'</h3>'
    }    
    y.innerHTML = retHTML
  }).catch(err => console.log(err))
}



export default App;
