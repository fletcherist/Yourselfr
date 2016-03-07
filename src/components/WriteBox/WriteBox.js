import React from 'react';
import s from './WriteBox.scss';
import { connect } from 'react-redux';
import { actions as postsActions } from '../../redux/modules/posts';
import { config } from '../../redux/config';
import cx from 'classnames';

function formToTray () {
  var form = document.getElementById('textForm');
  form.style.width = '60%';
}

function formToFull () {
  var form = document.getElementById('textForm');
  form.style.width = '100%';
}

class WriteBox extends React.Component {
    constructor (props) {
      super(props);
      this.state = {
        username: undefined,
        text: '',
        created_by: undefined,
        isOpen: true,
        photo: undefined
      }

      console.log(this.state);
    }

    componentWillReceiveProps (props) {
      var phrases = [
        `Что вы думаете о  ${props.username}?`,
        `Поделись мнением о ${props.username}!`,
        `Хороший ли человек ${props.username}?`,
        `${props.username} любит сериалы?`,
        `У ${props.username} есть вторая половинка?`
      ];
      var random = Math.floor(Math.random() * phrases.length)

      this.setState({
        username: props.username,
        created_by: props.alias,
        text: '',
        isOpen: true,
        textPlaceholder: phrases[random]
      })
    }

    handleSubmitButton (e) {
      var text = this.textBox.value;
      var photo = this.state.photo;
      if (!photo && !text) {
        this.textBox.focus();
      }
      if (/^\s+$/.test(text)) {
        return this.textBox.focus();
      }
      this.props.sendPost(text, photo);
      this.textBox.value = '';
      this.preview.src = '';
      this.preview.classList.add('hidden')
      formToFull();
    }

    selectPhoto (e) {
      this.photoInput.click();
    }

    attachPhoto (e) {
      var photo = this.photoForm;
      console.log(photo);
      var fd = new FormData();
      fd.append('file', photo[0].files[0]);

      var preview = this.preview;
      var reader = new FileReader();

      reader.onload = function () {
        formToTray();
        preview.src = reader.result;
        preview.classList.remove('hidden');
      }

      if (photo[0].files[0]) {
        reader.readAsDataURL(photo[0].files[0]);
      } else {
        console.log('not working');
        preview.src = '';
      }

      fetch(`${config.http}/upload/photo`, {
        method: 'post',
        body: fd
      })
      .then((r) => r.json())
      .then((res) => {
        console.log('its works' + res);
        this.setState({
          photo: res.url
        });
      })
      .catch((e) => {
        console.log('Error catched while attaching a photo', e);
      })
    }

    toggle () {
      this.setState({
        isOpen: !this.state.isOpen
      })
    }
    render () {
      var attachPreview = cx(s.attachPreview, 'hidden');
      return (
        <div>
            { // <div className={s.form} onClick={this.toggle.bind(this)}>
             //  <div className={s.formOpen}>+ Добавить своё мнение</div>
            // </div>
          }
            <div
                  className={s.container}
                  ref={(r) => this.writeBox = r }
                  style={{
                    maxHeight: this.state.isOpen ? '175px' : '0px'
                  }}>
                <form ref={ (r) => this.photoForm = r } id='attach-photo' encType='multipart/form-data' method='post' className={s.attachForm}>
                    <input type='file' name='photo' onChange={this.attachPhoto.bind(this)} ref={ (r) => this.photoInput = r } id='attach-input' className='attachPhoto-input'/>
                </form>
                <textarea
                    placeholder={this.state.textPlaceholder}
                    id='textForm'
                    ref={(ref) => this.textBox = ref}
                    style={{
                      visibility: this.state.isOpen ? 'visible' : 'hidden'
                    }}
                >
                </textarea>
                <img id='attach-preview'
                  ref={(r) => this.preview = r}
                  className={attachPreview}/>
                <div
                  className={s.above}
                  style={{
                    display: this.state.isOpen ? 'block' : 'none'
                  }}>
                    <div
                        className={cx('button button--submit', s.button)}
                        onClick={this.handleSubmitButton.bind(this)}>
                        отправить
                    </div>
                    <div className={s.photoHolder} onClick={this.selectPhoto.bind(this)}>
                      <div className={s.photoTitle}>прикрепить</div>
                      <div className={s.addPhoto}></div>
                    </div>
                </div>
            </div>
        </div>
        );
    }
}

WriteBox.propTypes = {
  sendPost: React.PropTypes.func.isRequired,
  alias: React.PropTypes.string.isRequired,
  username: React.PropTypes.string.isRequired
}

function mapStateToProps (state) {
  return {
    alias: state.user.alias,
    username: state.user.username
  }
}

export default connect(mapStateToProps, postsActions)(WriteBox);
