import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {ActivityIndicator} from 'react-native';

import api from '../../services/api';

import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Stars,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author,
} from './styles';

export default class User extends Component {
  static navigationOptions = ({navigation}) => ({
    title: navigation.getParam('user').name,
  });

  // eslint-disable-next-line react/static-property-placement
  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
      navigate: PropTypes.func,
    }).isRequired,
  };

  // eslint-disable-next-line react/state-in-constructor
  state = {
    user: '',
    stars: [],
    nextPage: 2,
    loading: false,
    refreshing: false,
  };

  async componentDidMount() {
    const {navigation} = this.props;
    this.setState({loading: true});
    const user = navigation.getParam('user');
    const response = await api.get(`users/${user.login}/starred`);

    this.setState({
      stars: response.data,
      user: user.login,
      loading: false,
    });
  }

  handleLoadMore = async () => {
    const {user, nextPage, stars} = this.state;
    this.setState({loading: true});
    const response = await api.get(`users/${user}/starred?page=${nextPage}`);
    // console.tron.log(response);
    if (response.data.length !== 0) {
      this.setState({
        stars: [...stars, ...response.data],
        loading: false,
        nextPage: nextPage + 1,
      });
    } else {
      this.setState({
        loading: false,
      });
    }
  };

  refreshList = async () => {
    this.setState({refreshing: true});
    const {user} = this.state;
    const response = await api.get(`users/${user}/starred`);

    this.setState({
      stars: [...response.data],
      nextPage: 2,
      refreshing: false,
    });
  };

  handleNavigate = repository => {
    const {navigation} = this.props;
    navigation.navigate('Repository', {repository});
  };

  render() {
    const {navigation} = this.props;
    const {stars, loading, refreshing} = this.state;
    const user = navigation.getParam('user');
    return (
      <Container>
        <Header>
          <Avatar source={{uri: user.avatar}} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>
        <Stars
          onRefresh={this.refreshList} // Função dispara quando o usuário arrasta a lista pra baixo
          refreshing={refreshing} // Variável que armazena um estado true/false que representa se a lista está atualizando
          onEndReached={this.handleLoadMore} // Função que carrega mais itens
          onEndReachedThreshold={0.2} // Carrega mais itens quando chegar em 20% do fim
          // Restante das props
          data={stars}
          keyExtractor={star => String(star.id)}
          renderItem={({item}) => (
            <Starred>
              <OwnerAvatar source={{uri: item.owner.avatar_url}} />
              <Info>
                <Title onPress={() => this.handleNavigate(item)}>
                  {item.name}
                </Title>
                <Author onPress={() => this.handleNavigate(item)}>
                  {item.owner.login}
                </Author>
              </Info>
            </Starred>
          )}
        />
        {loading ? (
          <ActivityIndicator animating={loading} color="#aaa" size="large" />
        ) : null}
      </Container>
    );
  }
}
