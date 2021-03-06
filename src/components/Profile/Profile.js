import React, { Component, PropTypes } from 'react'
import {connect} from 'react-redux'

import { Avatar, Username, Status } from './Elements'
import SubscribeButton from '../SubscribeButton'
import SocialNetworks from '../SocialNetworks'
import Footer from '../Footer'
import Megaphone from '../Megaphone'
import AttachEmail from '../AttachEmail'
import FriendsSmall from '../FriendsSmall'
import { actions as userActions } from '../../store/modules/user'
import s from './Profile.scss'

class Profile extends Component {
  render () {
    document.title = `${this.props.username} — Йорселфер`

    const { username, alias, photo,
            status, online,
            isFollowing, social } = this.props
    return (
      <div>
        <div className='container--left
           padding-0 container--transparent container--user'
          id='profile'>
          <div className={s.profile}>
            <Avatar photo={photo} alias={alias} />
            <div className={s.info}>
              <Username online={online} username={username} />
              <Status status={status} />
            </div>
          </div>
          {alias !== this.props.me.alias && (
            <SubscribeButton
              alias={alias}
              isFollowing={isFollowing}
              updateCounters
            />
          )}
        </div>

        <div className='hide-on-mobile'>
          <SocialNetworks networks={social} />
        </div>
        {this.props.isYourPage && (
          <div className='hide-on-mobile'>
            <Megaphone alias={alias} username={username} />
            <FriendsSmall />
            <AttachEmail />
          </div>
        )}
      </div>)
  }
}

function mapStateToProps (state) {
  return {
    username: state.user.username,
    alias: state.user.alias,
    photo: state.user.photo,
    background: state.user.background,
    online: state.user.online,
    status: state.user.status,
    stats: state.user.stats,
    social: state.user.social,
    isAuthenticated: state.auth.authenticated,
    isFetching: state.isFetching.user,
    isYourPage: state.auth.isYourPage,
    isFollowing: state.user.isFollowing,

    me: state.auth.user
  }
}

Profile.propTypes = {
  username: PropTypes.string.isRequired,
  alias: PropTypes.string.isRequired,
  photo: PropTypes.string.isRequired,
  background: PropTypes.string,
  online: PropTypes.object,
  isYourPage: PropTypes.bool.isRequired,
  status: PropTypes.string,
  social: PropTypes.object,
  stats: PropTypes.shape({
    visits: PropTypes.number.isRequired,
    followers: PropTypes.number.isRequired,
    following: PropTypes.number.isRequired
  }),
  loadUser: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  isFetching: PropTypes.object.isRequired,
  isFollowing: PropTypes.bool.isRequired,

  me: PropTypes.object
}

export default connect(mapStateToProps, userActions)(Profile)
