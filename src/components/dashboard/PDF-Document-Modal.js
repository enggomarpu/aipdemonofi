import React, { useEffect, useState } from "react"
import { Modal, Button, Form, ModalBody, } from 'react-bootstrap';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import HttpService from '../../shared/http.service'
import { PDFViewer } from '@react-pdf/renderer';
import MyDocument from "./post/saveasPDF"
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
  heading: {
    fontSize: 10,
    color: "red"
  }
});

const PdfModal = (props) => {

  const [postdata, setpost] = useState({});


  const get = async () => {
    console.log("hello Modal");
    await HttpService.get(`posts/${props.postselectid}`)
      .then((res) => {
        if (res) {
          setpost(res.data.Post)
          console.log("Data", res.data);

        }
      }).catch((err) => {
        console.log(err);
      });
  };

  const modalLoaded = async () => {
    get();

  }

  return (
    <>
      <Modal
        {...props}
        size='xl'
        aria-labelledby='contained-modal-title-vcenter'
        centered
        backdrop='static'
        onEntered={modalLoaded}
      >
        <Modal.Header closeButton>
          <Modal.Title id='contained-modal-title-vcenter'></Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <PDFViewer>
        <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
            <Text>Title</Text>
          <Text style={styles.heading}>{postdata && postdata.PostTitle}</Text>
        </View>

        <View style={styles.section}>
            <Text>DESCRIPTION</Text>
          <Text style={styles.heading}>{postdata && postdata.PostContent}</Text>
        </View>
        </Page>
        </Document>
  </PDFViewer>
  
  </Modal.Body>
        <Modal.Footer>
          {/* <Button type='submit'>{postBtnTitle}</Button> */}
          <Button onClick={props.onHide}>Cancel</Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
export default PdfModal
