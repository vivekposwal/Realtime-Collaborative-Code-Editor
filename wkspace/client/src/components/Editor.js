import { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUpload,
  faShareAlt,
  faDownload,
  faTools,
  faPlay,
  faCheck,
  faPaperPlane,
} from '@fortawesome/free-solid-svg-icons';
import {
  Button,
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  Form,
  FormGroup,
  Label,
  Input,
} from 'reactstrap';
import Spacer from './Spacer';
import Ace from './Ace';
import FileUpload from './FileUpload';
import { download } from '../js/utils';
import languages from '../js/languages';
import AceContext from '../context/AceContext';
import io from 'socket.io-client';

class Editor extends Component {
  state = {
    settingsOpen: false,
    roomId: '', // Added state for room ID
  };

  socket = null;

  toggleSettings = this.toggleSettings.bind(this);
  handleLanguage = this.handleLanguage.bind(this);

  componentDidMount() {
    // Connect to the server using socket.io
    const { roomId } = this.state;
    this.socket = io('http://localhost:5000/');

    // Join the specified room
    this.socket.emit('joinRoom', roomId);

    // Listen for changes made to the editor
    this.socket.on('serverCodeChanged', ({ language, code }) => {
      console.log('someone changed code');
      this.props.onChange({ language, code });
    });
  }

  componentWillUnmount() {
    // Disconnect from the server when the component is unmounted
    this.socket.disconnect();
  }

  toggleSettings() {
    this.setState((state) => ({
      settingsOpen: !state.settingsOpen,
    }));
  }

  handleLanguage(event) {
    const language = event.target.value;
    this.props.onChange({ language, code: languages[language].template });
  }

  handleEditorChange = (code) => {
    // Send the changes made to the editor to the server
    const { roomId } = this.state;
    this.socket.emit('clientCodeChange', {
      roomId,
      language: this.props.value.language,
      code,
    });
  };

  handleRoomIdChange = (event) => {
    const roomId = event.target.value;
    this.setState({ roomId });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const { roomId } = this.state;
    // Join the specified room
    this.socket.emit('joinRoom', roomId);
    this.setState({ connectedToRoom: true });

    alert(`connected to room ${roomId}`);
  };

  renderAceComponent() {
    const { connectedToRoom } = this.state;
    if (!connectedToRoom) {
      return null; // Hide the ACE component if not connected to a room
    }

    return (
      <Ace
        mode={languages[this.props.value.language].mode}
        value={this.props.value.code}
        onChange={(code) => {
          this.props.onChange({ code });
          this.handleEditorChange(code);
        }}
      />
    );
  }

  render() {
    return (
      <div className="editor-area">
        <Form onSubmit={this.handleSubmit} className="form-inline">
          {/* Modified input field for room ID */}
          <FormGroup>
            <Input
              type="text"
              name="roomId"
              id="roomId"
              placeholder="Enter Room ID"
              value={this.state.roomId}
              onChange={this.handleRoomIdChange}
            />
          </FormGroup>
          <Spacer />
          <Button type="submit">
            <FontAwesomeIcon icon={faPaperPlane} /> Join Room
          </Button>
        </Form>
        <div className="editor-menu">
          <FileUpload>
            {(upload) => (
              <Button
                onClick={async () =>
                  this.props.onChange({ code: await upload() })
                }
              >
                <FontAwesomeIcon icon={faUpload} /> Load
              </Button>
            )}
          </FileUpload>
          <Spacer />
          <Button onClick={() => this.props.onShare()}>
            <FontAwesomeIcon icon={faShareAlt} /> Share
          </Button>
          <Button onClick={() => download('main.cpp', this.props.value.code)}>
            <FontAwesomeIcon icon={faDownload} /> Download
          </Button>
        </div>

        {this.renderAceComponent()}

        <div className="editor-menu">
          <ButtonDropdown
            isOpen={this.state.settingsOpen}
            toggle={this.toggleSettings}
            direction="up"
          >
            <DropdownToggle>
              <FontAwesomeIcon icon={faTools} /> Settings
            </DropdownToggle>
            <DropdownMenu className="p-4">
              <AceContext.Consumer>
                {(aceProps) => (
                  <Form style={{ width: 300 }}>
                    <FormGroup className="form-row">
                      <Label
                        className="col-4 font-weight-bold"
                        for="language-select"
                      >
                        Language
                      </Label>
                      <Spacer width={6} />
                      <Input
                        className="col"
                        bsSize="sm"
                        type="select"
                        id="language-select"
                        value={this.props.value.language}
                        onChange={this.handleLanguage}
                      >
                        {Object.entries(languages).map(([id, { name }]) => (
                          <option key={id} value={id}>
                            {name}
                          </option>
                        ))}
                      </Input>
                    </FormGroup>
                    <FormGroup className="form-row">
                      <Label
                        className="col-4 font-weight-bold"
                        for="theme-select"
                      >
                        Theme
                      </Label>
                      <Spacer width={6} />
                      <Input
                        className="col"
                        bsSize="sm"
                        type="select"
                        id="theme-select"
                        value={aceProps.theme}
                        onChange={(event) =>
                          this.props.onAceChange({ theme: event.target.value })
                        }
                      >
                        <option value="monokai">Monokai</option>
                        <option value="dawn">Dawn</option>
                        <option value="textmate">Textmate</option>
                        <option value="solarized_light">Solarized Light</option>
                        <option value="solarized_dark">Solarized Dark</option>
                      </Input>
                    </FormGroup>
                    <FormGroup className="form-row">
                      <Label
                        className="col-4 font-weight-bold"
                        for="keybinding-select"
                      >
                        Keybinding
                      </Label>
                      <Spacer width={6} />
                      <Input
                        className="col"
                        bsSize="sm"
                        type="select"
                        id="keybinding-select"
                        value={aceProps.keyboardHandler}
                        onChange={(event) =>
                          this.props.onAceChange({
                            keyboardHandler: event.target.value,
                          })
                        }
                      >
                        <option value="">Default</option>
                        <option value="vim">Vim</option>
                        <option value="emacs">Emacs</option>
                      </Input>
                    </FormGroup>
                  </Form>
                )}
              </AceContext.Consumer>
            </DropdownMenu>
          </ButtonDropdown>
          <Spacer />
          <Button disabled={this.props.working} onClick={this.props.onRun}>
            <FontAwesomeIcon icon={faPlay} /> Run
          </Button>
          <Button disabled={this.props.working} onClick={this.props.onTest}>
            <FontAwesomeIcon icon={faCheck} /> Test
          </Button>
          <Button disabled={this.props.working} onClick={this.props.onSubmit}>
            <FontAwesomeIcon icon={faPaperPlane} /> Submit
          </Button>
        </div>
      </div>
    );
  }
}

export default Editor;
