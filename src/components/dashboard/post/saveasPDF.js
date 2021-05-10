import React, { useEffect, useState } from "react"
import { Modal, Button, Form, } from 'react-bootstrap';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import httpService from '../../../shared/http.service'
// Create styles
const styles = StyleSheet.create({
    page: {
      flexDirection: 'row',
      backgroundColor: '#ffffff'
    },
    section: {
      margin: 10,
      padding: 10,
      flexGrow: 1
    },
    heading : {
      fontSize : 10,
      color : "red"
    }
  });

  
  // Create Document Component
const MyDocument = (props) =>  {

  const [Post, setpost] = useState([]);
  const [postTags, setPostTags] = useState(null)

  useEffect(() => {
    get()
    },[]
  );
  const get = async () => {
    await httpService.get("posts/dashboard")
    .then((res) => {
      if (res) {
        setpost(res.data)
      }
    }).catch((err) => {
      console.log(err);
    });
  };

return (



    <Document>
      <Page size="A4" style={styles.page}>
      { Post.slice(0,1).map((post) => {
          return (
            <>
        <View style={styles.section}>
        
            <Text>Title</Text>
          <Text style={styles.heading}>{post.Post.PostTitle}</Text>
        </View>
        
        <View style={styles.section}>
        <Text>Description</Text>
          <Text>{post.Post.PostContent}</Text>
        </View>
        <View style={styles.section}>
        <Text>Tags</Text>
          <Text>{post.Post.PostTags.TagName}</Text>
        </View>
            </>
          )})}
          {/* {Post.PostTags.map((tag) => {
                          return (
                            <>
                            <Text> {tag.TagName} </Text>
                            </>
                          )})} */}
      </Page>
    </Document>
  );
}

  export default MyDocument
