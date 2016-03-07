import React from 'react';
import s from './Posts.scss';
import Post from '../Post';
import { ending, isEmpty } from '../toools';
import {connect} from 'react-redux';
import { actions as postsActions } from '../../redux/modules/posts';
import Loader from '../Loader';
// import ShareWithSocial from '../ShareWithSocial';

class Posts extends React.Component {
    componentDidMount () {
      console.log(this.props);
    }
    componentWillMount () {
      this.props.loadPosts();
      this.setState({
        count: this.props.count,
        postsLoaded: 10
      });
    }
    render () {
      var postsPronounce = ending(this.props.count, ['мнение', 'мнения', 'мнений']);
      var posts = this.props.posts;
      var postsArray;
      if (posts && !isEmpty(posts) && Array.isArray(posts)) {
        postsArray = posts.map(function (post) {
          return (
            <Post
              key={post._id}
              created_at={post.created_at}
              text={post.text}
              id={post._id}
              likes={post.likes}
              attachments={post.attachments}
            />
          )
        });
      }

      return (
        <div className='container--right padding-0' id='right'>
          <div>
            <div className={s.header}>
                <div className={s.counter}>
                    {this.props.count} {postsPronounce}
                </div>
            </div>
            {this.props.isFetching && (
              <Loader/>
            )}
            {!this.props.isFetching && (
              <div>
                {this.props.count === 0 && (<NoPosts isAuthenticated={this.props.isAuthenticated}/>)}
                {this.props.count > 0 && (postsArray)}
              </div>
            )}

            {this.props.count > 10 && this.props.count > this.state.postsLoaded && (
              <div className={s.loadMore}
                    onClick={ () => {
                      this.props.loadMorePosts(this.state.postsLoaded)
                      this.setState({
                        postsLoaded: this.state.postsLoaded + 10
                      })
                    }}>
                    {this.props.isFetchingLoadMore && ('Загрузка...')}
                    {!this.props.isFetchingLoadMore && ('Загрузить ещё')}
              </div>
            )}
          </div>
        </div>
        )
    }
}

class NoPosts extends React.Component {
  render () {
    return (
      <div>
        {this.props.isAuthenticated && (
          <div className={s.noPostsContainer}>
            <div className={s.noPosts}>Можем поспорить, что через 5 минут здесь будут анонимные мнения о вас.</div>
          </div>
        )}
        {!this.props.isAuthenticated && (
          <div className={s.noPostsEmpty}>
            <div className={s.NoPosts}>Пока ничего нет. Напишите первым!</div>
          </div>
        )}
      </div>
    );
  }
}

NoPosts.propTypes = {
  isAuthenticated: React.PropTypes.bool.isRequired
}

Posts.propTypes = {
  count: React.PropTypes.number.isRequired,
  posts: React.PropTypes.array.isRequired,
  loadPosts: React.PropTypes.func.isRequired,
  loadMorePosts: React.PropTypes.func.isRequired,
  isFetching: React.PropTypes.bool.isRequired,
  isFetchingLoadMore: React.PropTypes.bool.isRequired,
  isAuthenticated: React.PropTypes.bool.isRequired
}

function mapStateToProps (state) {
  return {
    posts: state.posts,
    count: state.user.stats.posts,
    isAuthenticated: state.auth.authenticated,
    isFetching: state.isFetching.posts,
    isFetchingLoadMore: state.isFetching.loadMorePosts
  }
}
export default connect(mapStateToProps, postsActions)(Posts)
