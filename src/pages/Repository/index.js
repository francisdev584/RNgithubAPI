import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {WebView} from 'react-native-webview';
// import {View} from 'react-native';

// import { Container } from './styles';

export default class Repository extends Component {
  static navigationOptions = ({navigation}) => ({
    title: navigation.getParam('repository').name,
  });

  // eslint-disable-next-line react/static-property-placement
  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
    }).isRequired,
  };

  render() {
    const {navigation} = this.props;
    return (
      <WebView
        source={{uri: navigation.getParam('repository').html_url}}
        style={{flex: 1}}
      />
    );
  }
}
