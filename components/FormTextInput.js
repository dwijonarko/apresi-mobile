import React, {Component} from 'react';
import {StyleSheet, TextInput, TextInputProps} from 'react-native';
import colors from '../config/colors';

export default class FormTextInput extends Component {
  render() {
      const {style,...otherProps}=this.props;
    return (
        <TextInput
            selectionColor={colors.DODGEr_BLUE}
            style={[styles.textInput, style]}
            {...otherProps} 
        />
    );
  }
}

const styles = StyleSheet.create({
    textInput:{
        height:40,
        borderColor:colors.SILVER,
        borderBottomWidth:StyleSheet.hairlineWidth,
        marginBottom:20
    }
});

