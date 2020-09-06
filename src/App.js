import React, {useState, useEffect} from 'react';
import {DropzoneArea} from 'material-ui-dropzone';
import Amplify, {API} from 'aws-amplify';
import hecklebot from './hecklebot.png';
import './App.css';

Amplify.configure({
    API: {
        endpoints: [
            {
                name: "PetProjects",
                endpoint: "https://azs68j5xif.execute-api.us-west-2.amazonaws.com/dev"
            },
        ]
    }
});

function App() {
  const message = 'I can identify airplanes, cars, birds, cats, deers, dogs, frogs, horses, ships, and (not pickup) trucks!'
  const [speech, setSpeech] = useState(message)

  useEffect(() => {
    if (speech === '') return
    const disappearTimer = setTimeout(() => {
      setSpeech('')
    }, 10000);
    return () => clearTimeout(disappearTimer);
  }, [speech]);

  useEffect(() => {
    const inactivityTimer = setTimeout(() => {
      if (speech != '') return
      setSpeech(message)
    }, 10000);
    return () => clearTimeout(inactivityTimer);
  }, [speech]);

  return (
    <div className="App-header">
      <h1>Hecklebot Will Identify Your Pictures</h1>
      <div className="main">
        <div className="left">
          <Speechzone speech={speech} />
          <img className="hecklebot-img" alt="hecklebot" src={hecklebot} />
        </div>
        <Dropzone identification={(speech) => setSpeech(speech)} />
      </div>
    </div>
  );
}

class Speechzone extends React.Component{
  constructor(props){
    super(props);
    this.state = {
    };
  }
  render() {
    if (!this.props.speech) return (<p></p>)
    return (
      <p className='oval-speech-border'>{this.props.speech} </p>
      )
  }
}

class Dropzone extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      files: []
    };
  }
  handleChange(files){
    //API.post('PetProjects', '/cifar10', {body: {file: files}}).then(response => {console.log(response)})
    if (files.length === 0) return
    new Response(files[files.length-1]).arrayBuffer().then(buffer => JSON.stringify({buffer: Array.from(new Uint8Array(buffer))})).then(array => API.post('PetProjects', '/cifar10', {body: {file: array}})).then(res => this.props.identification(res.prediction), err => console.log(err))
    this.setState({
      files: files
    });
  }
  render(){
    return (
      <DropzoneArea
        onChange={this.handleChange.bind(this)}
        dropzoneClass='dropzone'
        filesLimit={99}
        dropzoneText='Drag and drop an image or click here.'
        acceptedFiles={['image/jpeg', 'image/png', 'image/bmp']}
        />
    )
  }
}

export default App;
