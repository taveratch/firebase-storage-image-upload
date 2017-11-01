import React from 'react'
import config from 'src/config/firebase'
import firebase from 'firebase'
import { observer } from 'mobx-react'

const IDLE = 'IDLE'
const UPLOADING = 'UPLOADING'
const DONE = 'DONE'

@observer
class App extends React.Component {

  constructor(props) {
    super(props)
    this.initFirebase()
    this.state = {
      downloadUrl: '',
      state: IDLE
    }
  }

  initFirebase = () => {
    const firebaseApp = firebase.initializeApp(config)
    this.storage = firebaseApp.storage()
  }

  handleOnChange = (event) => {
    const file = event.target.files[0]
    this.setState({ state: UPLOADING })
    this.storage.ref(`images/${file.name}`).put(file)
      .then(snapshot => {
        this.setState({
          downloadUrl: snapshot.downloadURL,
          state: DONE
        })
      })
  }

  render() {
    return (
      <div className='container'>
        <input type="file" onChange={this.handleOnChange} />
        <div>
          {this.state.state === UPLOADING && <p>Uploading...</p>}
          {this.state.state === DONE && (
            <div>
              <a href={this.state.downloadUrl}>{this.state.downloadUrl}</a>
              <img className='img-responsive w-100' src={this.state.downloadUrl} alt="" />
            </div>
          )}
        </div>
      </div>
    )
  }
}

export default App