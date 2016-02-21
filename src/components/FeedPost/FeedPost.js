import React from 'react';
import Like from '../Like';

import s from './FeedPost.scss';
import cx from 'classnames/bind';
import { config } from '../../redux/config';
import { isValidPhoto } from '../Toools';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { actions as postsActions } from '../../redux/modules/posts';

class Post extends React.Component {
    constructor (props) {
      super(props);
      this.displayName = '';

      this.state = {
        created_at: this.props.created_at,
        createdPronounce: 'сейчас',
        isHot: false
      }
    }

    tickTime () {
      var time = new Date(this.state.created_at);

      var now = new Date();

      var passed = ((now - time) / 1000).toFixed(0); // Seconds
      var result;
      if (passed < 5) {
        result = 'сейчас'
      } else if (passed < 60) {
        result = passed + 'сек'
      } else if (passed < 60 * 60) {
        result = (passed / 60).toFixed(0) + 'мин';
      } else if (passed < 60 * 60 * 24) {
        result = (passed / (60 * 60)).toFixed(0) + 'ч'
      } else if (passed < 60 * 60 * 24 * 7) {
        result = (passed / (60 * 60 * 24)).toFixed(0) + 'дн'
      } else if (passed < 60 * 60 * 24 * 7 * 4) {
        result = (passed / (60 * 60 * 24 * 7)).toFixed(0) + 'нед'
      } else if (passed < 60 * 60 * 24 * 7 * 4 * 12) {
        result = (passed / (60 * 60 * 24 * 7 * 4)).toFixed(0) + 'мес'
      } else if (passed < 60 * 60 * 24 * 7 * 30 * 12) {
        result = 'давно'
      }

      // posts, posted <5s ago will show coloured.
      var isHot = false;
      if (passed < 5) {
        isHot = true;
      }

      this.setState({
        createdPronounce: result,
        isHot: isHot
      })
    }
    componentDidMount () {
      this.loadInterval = setInterval(this.tickTime.bind(this), 1000);
      // setInterval(this.tickTime.bind(this), 1000);
    }
    componentWillUnmount () {
      this.loadInterval && clearInterval(this.loadInterval);
      this.loadInterval = false;
    }
    componentWillMount () {
      this.tickTime();
    }

    render () {
      let ccx = cx.bind(s);
      let postClasses = ccx({
        post: true,
        hot: this.state.isHot
      })

      var isPhoto;
      this.props.attachments &&
      this.props.attachments.photo &&
      this.props.attachments.photo !== 'undefined' ? isPhoto = true : isPhoto = false

      var photo = isValidPhoto(this.props.user.photo);
      var linkHref = '/' + this.props.user.alias;
      return (
        <div className={postClasses}>
                <div className={s.time}>
                    <Link to={linkHref}>
                      <img
                        src={photo}
                        className={s.photo}/>
                    </Link>
                </div>
                <div className={s.text}>
                    <div>
                      <span className={s.time}>{this.state.createdPronounce} назад о</span>
                      {' '}
                      <Link to={linkHref}><b>{this.props.user.username}</b></Link>
                    </div>
                    <span dangerouslySetInnerHTML={{__html: this.props.text}}></span>
                    {isPhoto && (
                      <div>
                        <img src={`${config.http}/upload/photo/${this.props.attachments.photo}`}
                            className={s.attachmentPhoto}
                        />
                      </div>
                    )}
                </div>
          </div>
        );
    }
}

Post.propTypes = {
  text: React.PropTypes.string.isRequired,
  created_at: React.PropTypes.string.isRequired,
  id: React.PropTypes.string.isRequired,
  likes: React.PropTypes.number,
  attachments: React.PropTypes.object
}

const mapStateToProps = () => {
  return {}
}
export default connect(mapStateToProps, postsActions)(Post);
