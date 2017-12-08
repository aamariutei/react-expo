import React from 'react';
import { Text, View, TouchableOpacity, Platform, NativeModules, ViewPropTypes, requireNativeComponent } from 'react-native';

import PropTypes from 'prop-types';
import { mapValues } from 'lodash';

import { Icon } from 'react-native-elements'
import TimerMixin from 'react-timer-mixin';

import { Camera, Permissions } from 'expo';



export default class CameraExample extends React.Component {
  timeInterval =  null;
  startTime = null;
  videoData = null;

  mixins=[TimerMixin];
  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
    recordButtonColor: '#fff',
    cameraToggleImage: 'ios-videocam',
    videoTimer: '' //00:00:00
  };

  async componentWillMount() {
    var audioPerm = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
    var vidPerm = await Permissions.askAsync(Permissions.CAMERA);

    this.setState({ hasCameraPermission: (audioPerm.status === "granted") && (vidPerm.status === "granted") });
  }

  updateTimer() {
      console.log('hello');
      /*this.setState({
        recordButtonColor: this.state.recordButtonColor === '#fff'
          ? '#f00'
          : '#fff'

      });*/
  }

  toggleButtonColor() {
    this.setState({
      recordButtonColor: this.state.recordButtonColor === '#fff'
        ? '#f00'
        : '#fff'
    });
  }

  parseTime() {

    return (new Date(Date.now() - startTime)).toUTCString().match(/(\d\d:\d\d:\d\d)/)[0];

  }

  takePicture = async function() {

  };

  async handleRecord() {
    var isPhoto = this.state.cameraToggleImage === 'ios-videocam';

    if (!this.camera) return;

    if (isPhoto) {

      this.camera.takePictureAsync().then(function (value) {
        console.log(value);
        this.toggleButtonColor();
        this.setState({ videoTimer: '' });
        this.props.navigation.goBack();
      }.bind(this));

    } else if (this.timeInterval != null) {

      this.toggleButtonColor();
      clearInterval(this.timeInterval);
      this.timeInterval = null;
      this.camera.stopRecording();
      this.setState({ videoTimer: '' });

    } else {
      this.toggleButtonColor();
      startTime = Date.now();
      this.setState({
        videoTimer: '00:00:00'
      });
      this.camera.recordAsync().then(function (value) {
        console.log(value);
      });

      // We are just starting to record
      this.timeInterval = setInterval(function() {
        this.setState({
          videoTimer: this.parseTime()
        });
      }.bind(this), 1000);
    }
  }

  render() {
    const {goBack} = this.props.navigation;
    const { hasCameraPermission } = this.state;

    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={{ flex: 1 }}>
          <Camera ref={ref => {
          this.camera = ref;
        }} style={{ flex: 1 }} type={this.state.type}>

          <View
            style={{
              backgroundColor: 'rgba(0,0,0,0.3)',
              height:50,
              flexDirection: 'row',
              top:0,
              left:0,
              right:0,
              flex: 1,
              position: 'absolute',
              alignItems: 'center',
              justifyContent: 'center'
            }}>

            <Text
              style={{
                color: '#fff',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18,
                marginTop:10
              }}>{this.state.videoTimer}</Text>

            </View>

            <View
              style={{
                backgroundColor: 'rgba(0,0,0,0.3)',
                height:80,
                flexDirection: 'row',
                bottom:0,
                left:0,
                right:0,
                flex: 1,
                position: 'absolute',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onPress={() => { goBack(); }}>
                  <Icon
                    name='ios-arrow-round-back'
                    size={40}
                    type='ionicon'
                    color='#fff' />
              </TouchableOpacity>

              <TouchableOpacity
                style={{
              flex: 2,
              alignItems: 'center',
              justifyContent: 'center'
                }}
                onPress={this.handleRecord.bind(this)}>
                <Icon
                name='ios-radio-button-on'
                size={45}
                type='ionicon'
                color={this.state.recordButtonColor} />
              </TouchableOpacity>




              <TouchableOpacity style={{flex: 1,
                                        alignItems: 'center',
                                        justifyContent: 'center'}}
                onPress={function(){
                  this.setState({
                    cameraToggleImage: this.state.cameraToggleImage === 'ios-videocam'
                      ? 'ios-camera'
                      : 'ios-videocam',
                    videoTimer: this.state.cameraToggleImage === 'ios-videocam'
                      ? '00:00:00' : ''

                      /*
                    recordButtonColor: this.state.cameraToggleImage === 'ios-videocam'
                      ? '#f00'
                      : '#fff'*/

                  });
                  if (this.timeInterval != null) {
                    this.toggleButtonColor();
                    clearInterval(this.timeInterval);
                  }

                }.bind(this)}>
                <Icon name={this.state.cameraToggleImage}
                      size={30}
                      type='ionicon'
                      color='#fff' />
              </TouchableOpacity>

            </View>
          </Camera>
        </View>
      );
    }
  }
}
