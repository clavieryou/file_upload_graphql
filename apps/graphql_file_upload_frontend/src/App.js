import {Button, Icon, Upload} from 'antd'
import React, { Component } from 'react';
import {ApolloProvider} from "react-apollo";
import { getApolloClient } from "./apollo";
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import './App.css';

const UPLOAD_FILE = gql`mutation uploadFile($fileData: Upload!) {
  uploadFile(fileData: $fileData)
}`;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uploading: false,
      fileList: []
    };
  }

  handleUpload = async (uploadFile) => {
    const { fileList } = this.state;
    console.log(uploadFile, fileList)

    this.setState({
      uploading: true,
    });

    try {
      const response = await uploadFile({
        variables: {
          fileData: fileList[0],
        },
      });
      if (!(response && response.data)) {
        return;
      }
      const parsedResponse = JSON.parse(response.data.uploadFile);
      this.setState({
        data: parsedResponse,
        uploading: false,
      });
    } catch (err) {
      this.setState({
        data: [],
        uploading: false,
      });
    }
  }

  onChange = ({ file, fileList }) => {
    if (fileList.length > 0) return;

    this.setState(({ fileList: list }) => {
      const index = list.indexOf(file);
      const newFileList = list.slice();
      newFileList.splice(index, 1);
      return {
        fileList: newFileList,
      };
    });
  }

  beforeUpload = (file) => {
    this.setState(() => ({
      fileList: [file],
    }));
    const reader = new FileReader();
    reader.readAsText(file);
    return true;
  }

  
  render() {
    const { fileList, uploading } = this.state;

    const uploadProps = {
      accept: '.csv',
      beforeUpload: this.beforeUpload,
      fileList,
      loading: { uploading },
      multiple: false,
      onChange: this.onChange,
    };
    const client = getApolloClient();
    return (
      <ApolloProvider client={client}>
        <div className="App">
          <Mutation mutation={UPLOAD_FILE}>
          {uploadFile => (
            <Upload 
              {...uploadProps}
              customRequest={(e) => {
                this.handleUpload(uploadFile);
              }}>
                <Button>
                  <Icon type="upload"/>
                  {' '}
                  Select File To Upload
                </Button>
              </Upload>
          )}
          </Mutation>
        </div>
      </ApolloProvider>
    );
  }
}

export default App;
